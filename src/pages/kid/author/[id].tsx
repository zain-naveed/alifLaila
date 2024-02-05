import {
  FilterLines,
  FlagIcon,
  GlobeIcon,
  ImageIcon,
  SearchIcon,
  VerifiedIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "shared/components/common/bookCard";
import CustomButton from "shared/components/common/customButton";
import CustomRadioButton from "shared/components/common/customRadioButton";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import Footer from "shared/components/footer";
import CheckBox from "shared/components/kid/checkBox";
import FilterCollapse from "shared/components/kid/filterCollapseable";
import SideFiltersCanvas from "shared/components/kid/sideFiltersCanvas";
import useDebounce from "shared/customHook/useDebounce";
import { useScroll } from "shared/customHook/useScoll";
import BookLoader from "shared/loader/pageLoader/kid/books";
import CheckBoxLoader from "shared/loader/pageLoader/kid/checkBoxLoader";
import CustomRadioLoader from "shared/loader/pageLoader/kid/customRadioLoader";
import { forms } from "shared/modal/auth/constants";
import ReportModal from "shared/modal/report";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import {
  getAgeRangeList,
  getGenreList,
  getLangList,
} from "shared/services/publisher/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  bookTypeFilters,
  quizFilters,
} from "shared/utils/pageConstant/kid/booksConstant";
import styles from "./style.module.scss";
const NavWrapper = dynamic(() => import("shared/components/navWrapper"), {
  ssr: false,
});

const Author = ({
  profileData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    login: { isLoggedIn },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const bodyRef = useRef<any>(null);
  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>([]);

  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);
  const [showFiltersCanvas, setShowFiltersCanvas] = useState<boolean>(false);
  const [showSideFilters, setShowSideFilters] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const publisherDetail = profileData?.data;

  const [initialloading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [selectGenre, setSelectGenre]: any = useState([]);
  const [selectLang, setSlectLang]: any = useState([]);
  const [selectAgeRange, setSelectAgeRange] = useState<number>(0);
  const [selectQuiz, setSelectQuiz] = useState<number>(2);
  const [bookType, setBookType] = useState<number>(0);
  const [bookList, setBookList] = useState([]);
  const [langList, setLangList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [ageRangeList, setAgeRangeList] = useState([]);

  const handleShowAuthModal = () => {
    dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
  };

  const handleShowReportModal = () => {
    if (isLoggedIn) {
      setShowReportModal(true);
    } else {
      handleShowAuthModal();
    }
  };

  const handleCloseReportModal = () => {
    setShowReportModal(false);
  };

  const handleNavigation = (itm: any) => {
    if (isLoggedIn) {
      router.push(kidPanelConstant.preview.path.replace(":id", itm?.id));
    } else {
      handleShowAuthModal();
    }
  };

  useEffect(() => {
    if (profileData?.data === null) {
      router.back();
    }
  }, [router.query.id]);

  const getAllBook = () => {
    let formBody: any = new FormData();
    formBody.append("publisher_id", router.query.id);
    if (selectGenre.length) {
      selectGenre.map((genredId: number) => {
        formBody.append("genres[]", genredId);
      });
    }
    if (selectLang.length) {
      selectLang.map((langId: number) => {
        formBody.append("languages[]", langId);
      });
    }
    if (selectLang.length) {
      selectLang.map((langId: number) => {
        formBody.append("languages[]", langId);
      });
    }
    if (selectAgeRange !== 0) {
      formBody.append("age_range_id", selectAgeRange);
    }
    if (selectQuiz !== 2) {
      formBody.append("quiz", selectQuiz);
    }
    if (bookType !== 0) {
      formBody.append("type", bookType);
    }
    allBookForKid(formBody, currentPage.current)
      .then(({ data: { data } }) => {
        if (data) {
          let tempArr: any = [...booklistRef.current, ...data?.data];
          booklistRef.current = tempArr;
          setBookList(tempArr);
          if (data?.current_page === data?.last_page) {
            setIsLoadMore(false);
          } else {
            setIsLoadMore(true);
          }
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  const filter = () => {
    return (
      selectGenre.length +
      selectLang.length +
      selectAgeRange +
      selectQuiz +
      bookType
    );
  };

  const selectGenreHandler = (id: string | number) => {
    let cloneGenre: any = [...selectGenre];
    if (!cloneGenre.includes(id)) {
      cloneGenre.push(id);
      setSelectGenre(cloneGenre);
    } else {
      let index = cloneGenre.indexOf(id);
      cloneGenre.splice(index, 1);
      setSelectGenre(cloneGenre);
    }
  };

  const langHandler = (id: string | number) => {
    let cloneLang: any = [...selectLang];
    if (!cloneLang.includes(id)) {
      cloneLang.push(id);
      setSlectLang(cloneLang);
    } else {
      let index = cloneLang.indexOf(id);
      cloneLang.splice(index, 1);
      setSlectLang(cloneLang);
    }
  };

  const ageRangeHandler = (id: number) => {
    setSelectAgeRange(id);
  };
  const resetHandler = () => {
    currentPage.current = 1;
    setSelectGenre([]);
    setSlectLang([]);
    setSelectAgeRange(0);
    setBookType(0);
    setSelectQuiz(2);
  };

  const getList = () => {
    setListLoading(true);
    Promise.all([getGenreList(), getLangList(), getAgeRangeList()])
      .then((resolve) => {
        const [genre, langList, ageRanges] = resolve;
        setLangList(langList.data?.data || []);
        setGenreList(genre.data?.data || []);
        setAgeRangeList(ageRanges.data?.data || []);
      })
      .catch((err) => {})
      .finally(() => {
        setListLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      setInitialLoading(true);
      currentPage.current = 1;
      booklistRef.current = [];
      setBookList([]);
      getAllBook();
    }
  }, [
    selectGenre.length,
    selectLang.length,
    selectAgeRange,
    selectQuiz,
    bookType,
    router.query.id,
    searchVal,
  ]);

  useDebounce(
    () => {
      setSearchVal(search);
      currentPage.current = 1;
    },
    [search],
    800
  );

  useScroll(bodyRef);

  return (
    <>
      <SideFiltersCanvas
        isOpen={showFiltersCanvas}
        setIsOpen={setShowFiltersCanvas}
        setShowSideFilters={setShowSideFilters}
        langList={langList}
        genreList={genreList}
        ageRangeList={ageRangeList}
        selectLang={selectLang}
        listLoading={listLoading}
        setBookType={setBookType}
        bookType={bookType}
        selectQuiz={selectQuiz}
        setSelectQuiz={setSelectQuiz}
        selectGenre={selectGenre}
        selectAgeRange={selectAgeRange}
        setSelectAgeRange={setSelectAgeRange}
        setSelectGenre={setSelectGenre}
        setSlectLang={setSlectLang}
      />
      <NavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        {publisherDetail?.banner ? (
          <img
            src={publisherDetail?.banner}
            alt=""
            className={classNames(styles.coverImg)}
            height={300}
            width={1440}
          />
        ) : (
          <div className={classNames(styles.coverContainer)}>
            <ImageIcon className={classNames(styles.imgIcon)} />
          </div>
        )}

        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          <div
            className={classNames(
              "d-flex flex-column flex-sm-row align-items-center justify-content-between gap-4",
              styles.infoContainer
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-3"
              )}
            >
              <img
                alt="profile-pic"
                src={
                  publisherDetail?.profile_picture
                    ? publisherDetail?.profile_picture
                    : defaultAvatar.src
                }
                width={800}
                height={1120}
                className={classNames(styles.avatar)}
              />

              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-between"
                )}
              >
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-start gap-2"
                  )}
                >
                  <label className={classNames(styles.publisherName)}>
                    {publisherDetail?.full_name}
                  </label>
                  <VerifiedIcon className={classNames(styles.verifyIcon)} />
                </div>
                <label className={classNames(styles.publisherBadge)}>
                  🥇 Author
                </label>
              </div>
            </div>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              {/* <CustomButton
                title="Website"
                Icon={GlobeIcon}
                IconDirction="left"
                containerStyle={classNames(styles.btn1Style)}
                iconStyle={classNames(styles.icon1Style)}
                onClick={() => {
                  window.open("https://" + publisherDetail?.website, "_blank");
                }}
              /> */}
              {isLoggedIn ? (
                <CustomButton
                  title="Report"
                  Icon={FlagIcon}
                  IconDirction="left"
                  containerStyle={classNames(styles.btn2Style)}
                  iconStyle={classNames(styles.icon2Style)}
                  onClick={handleShowReportModal}
                />
              ) : null}
            </div>
          </div>

          {publisherDetail?.about ? (
            <label className={classNames(styles.bioLabel, "mt-4 mb-0 mb-md-3")}>
              {publisherDetail?.about
                ?.split("\n")
                .map((i: string, ii: number) => {
                  return <div key={ii}>{i}</div>;
                })}
            </label>
          ) : null}
          <div
            className={classNames(
              "d-flex flex-column align-items-center justify-content-center"
            )}
          >
            <label className={classNames(styles.title)}>
              Books By <span>{publisherDetail?.full_name}</span>
            </label>
            <div
              className={classNames(
                "d-flex align-items-center align-self-end justify-content-end  gap-3"
              )}
            >
              <div className={classNames(styles.searchContainer, "px-3")}>
                <SearchIcon className={classNames(styles.searchIcon)} />
                <input
                  className={classNames(styles.searchInput, "ms-1")}
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className={classNames("d-flex d-md-none")}>
                <CustomButton
                  title={!showSideFilters ? "Filters" : "Reset Filters"}
                  Icon={FilterLines}
                  IconDirction="left"
                  containerStyle={classNames(styles.filterBtnStyle, "gap-2")}
                  iconStyle={classNames(styles.iconStyle)}
                  onClick={() => {
                    if (showSideFilters) {
                      setShowSideFilters(false);
                      setShowFiltersCanvas(false);
                    } else {
                      setShowFiltersCanvas(true);
                    }
                  }}
                />
              </div>
            </div>
            <div className={classNames("d-flex w-100")}>
              <div
                className={classNames(
                  "d-none  d-md-flex flex-column gap-3 mt-4",
                  styles.sideFiltersContainer
                )}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <label className={classNames(styles.filterLabel)}>
                    Filters
                  </label>
                  {filter() > 2 ? (
                    <label
                      className={classNames(styles.filterReset)}
                      onClick={resetHandler}
                    >
                      Reset
                    </label>
                  ) : null}
                </div>
                <FilterCollapse
                  title="Book Type"
                  id="filter-books-screen-4"
                  noBottomSeperator
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    {bookTypeFilters.map((itm, inx) => {
                      return (
                        <CustomRadioButton
                          isActive={bookType == itm?.id}
                          label={itm?.name}
                          onClick={() => setBookType(itm?.id)}
                          key={inx}
                        />
                      );
                    })}
                  </div>
                </FilterCollapse>
                <FilterCollapse
                  title="Language"
                  id="filter-publisher-screen-1"
                  topSeperator
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    {listLoading ? (
                      <CheckBoxLoader iteration={2} />
                    ) : (
                      langList?.map((itm: any, inx) => {
                        return (
                          <CheckBox
                            isActive={selectLang.includes(itm?.id)}
                            label={itm?.name}
                            key={inx}
                            onClick={() => langHandler(itm?.id)}
                          />
                        );
                      })
                    )}
                  </div>
                </FilterCollapse>
                <FilterCollapse title="GENRE" id="filter-publisher-screen-2">
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    {listLoading ? (
                      <CheckBoxLoader iteration={7} />
                    ) : (
                      genreList?.map((itm: any, inx) => {
                        return (
                          <CheckBox
                            isActive={selectGenre.includes(itm?.id)}
                            onClick={() => selectGenreHandler(itm?.id)}
                            label={itm?.name}
                            key={inx}
                          />
                        );
                      })
                    )}
                  </div>
                </FilterCollapse>
                <FilterCollapse
                  title="AGE GROUP"
                  id="filter-publisher-screen-3"
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    {listLoading ? (
                      <CustomRadioLoader iteration={4} />
                    ) : (
                      ageRangeList?.map((itm: any, inx) => {
                        return (
                          <CustomRadioButton
                            isActive={selectAgeRange == itm?.id}
                            onClick={() => ageRangeHandler(itm?.id)}
                            label={itm?.text}
                            key={inx}
                          />
                        );
                      })
                    )}
                  </div>
                </FilterCollapse>
                <FilterCollapse
                  title="Quiz"
                  id="filter-publisher-screen-4"
                  noBottomSeperator
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    {quizFilters?.map((itm, inx) => {
                      return (
                        <CustomRadioButton
                          isActive={selectQuiz == itm?.id}
                          label={itm?.name}
                          onClick={() => setSelectQuiz(itm?.id)}
                          key={inx}
                        />
                      );
                    })}
                  </div>
                </FilterCollapse>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-start justify-content-between flex-column w-100"
                )}
              >
                <div
                  className={classNames(
                    "position-relative d-flex align-items-start justify-content-start flex-wrap  w-100"
                  )}
                  id="publisher-page-book-listing"
                  style={{ height: "fit-content" }}
                >
                  {initialloading ? (
                    <BookLoader
                      Iteration={12}
                      isQuartor
                      customContainer={classNames("mt-3 mt-md-4")}
                    />
                  ) : bookList?.length > 0 ? (
                    bookList.map((itm: any, inx: any) => {
                      return (
                        <BookCard
                          compoID="publisher-page"
                          item={itm}
                          key={inx}
                          index={inx}
                          parentElementId="publisher-page-book-listing"
                          onClick={() => {
                            handleNavigation(itm);
                          }}
                          customContainerStyle={classNames("mt-3 mt-md-4")}
                          isQuarter
                        />
                      );
                    })
                  ) : (
                    <NoContentCard
                      customContainer={classNames(
                        "d-flex flex-column align-items-center gap-3 w-100 my-5"
                      )}
                      label1="No Books Found"
                      label2="There are no Books available"
                    />
                  )}
                </div>
                {isLoadMore && !initialloading ? (
                  <div
                    className={classNames(
                      "w-100 d-flex align-items-center justify-content-center mt-4"
                    )}
                  >
                    <CustomButton
                      title="Load More"
                      containerStyle={classNames(styles.loadMoreBtn)}
                      loading={loading}
                      disabled={loading}
                      onClick={() => {
                        currentPage.current = currentPage.current + 1;
                        setLoading(true);
                        getAllBook();
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <ReportModal
          showModal={showReportModal}
          handleClose={handleCloseReportModal}
          type={2}
        />
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const profileRes = await fetch(
    BaseURL + Endpoint.kid.author.profile + params?.id
  );
  const profileData = await profileRes.json();
  return {
    props: {
      profileData: profileData,
    },
  };
});

export default Author;
