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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import BookCard from "shared/components/parent/bookCard";
import FiltersCanvas from "shared/components/parent/filterCanvas";
import useDebounce from "shared/customHook/useDebounce";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { forms } from "shared/modal/auth/constants";
import ReportModal from "shared/modal/report";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";

const Author = ({
  publisherData,
  languageData,
  genreData,
  ageRangeData,
  booksList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    login: { isLoggedIn },
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();

  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>(booksList?.data?.data);

  const publisherDetail = publisherData?.data;
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectQuizSidebar, setSelectQuizSidebar] = useState<number>(0);
  const [bookTypeSidebar, setBookTypeSidebar] = useState<number>(0);
  const [selectAgeRangeSidebar, setSelectAgeRangeSidebar] = useState<number>(0);
  const [selectGenreSidebar, setSelectGenreSidebar] = useState<any>([]);
  const [selectLangSidebar, setSlectLangSidebar] = useState<any>([]);
  const [books, setBooks] = useState<any>(booksList?.data?.data);

  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [applyFilters, setApplyFilters] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);
  const [initialloading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(
    booksList?.data?.current_page === booksList?.data?.last_page ? false : true
  );

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

  const handleApplyFilter = () => {
    setInitial(false);
    currentPage.current = 1;
    setSearchVal("");
    setApplyFilters(!applyFilters);
    setShowFilters(false);
  };

  const handleResetFilter = () => {
    setSelectQuizSidebar(0);
    setBookTypeSidebar(0);
    setSelectAgeRangeSidebar(0);
    setSelectGenreSidebar([]);
    setSlectLangSidebar([]);
    setInitial(false);
    setApplyFilters(!applyFilters);
    setShowFilters(false);
  };

  const getAllBook = () => {
    let formBody: any = new FormData();
    formBody.append("publisher_id", router.query.id);
    if (selectGenreSidebar.length) {
      selectGenreSidebar.map((genredId: number) => {
        formBody.append("genres[]", genredId);
      });
    }
    if (selectLangSidebar.length) {
      selectLangSidebar.map((langId: number) => {
        formBody.append("languages[]", langId);
      });
    }

    if (selectAgeRangeSidebar !== 0) {
      formBody.append("age_range_id", selectAgeRangeSidebar);
    }
    if (selectQuizSidebar !== 2) {
      formBody.append("quiz", selectQuizSidebar);
    }
    if (bookTypeSidebar !== 0) {
      formBody.append("type", bookTypeSidebar);
    }
    formBody.append("search", searchVal);
    allBookForKid(formBody, currentPage.current)
      .then(({ data: { data } }) => {
        if (data) {
          let tempArr: any = [...booklistRef.current, ...data?.data];
          booklistRef.current = tempArr;
          setBooks(tempArr);
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

  useEffect(() => {
    if (!initial) {
      setInitialLoading(true);
      booklistRef.current = [];
      currentPage.current = 1;
      getAllBook();
    }
  }, [applyFilters, searchVal]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: publisherDetail?.publishing_house,
          },
        ],
      })
    );
  }, [publisherDetail]);

  useDebounce(
    () => {
      setSearchVal(search);
      currentPage.current = 1;
    },
    [search],
    800
  );

  return (
    <>
      <FiltersCanvas
        isOpen={showFilters}
        setIsOpen={setShowFilters}
        langList={languageData?.data}
        genreList={genreData?.data}
        ageRangeList={ageRangeData?.data}
        handleApplyFilter={handleApplyFilter}
        selectQuizSidebar={selectQuizSidebar}
        setSelectQuizSidebar={setSelectQuizSidebar}
        bookTypeSidebar={bookTypeSidebar}
        setBookTypeSidebar={setBookTypeSidebar}
        selectAgeRangeSidebar={selectAgeRangeSidebar}
        setSelectAgeRangeSidebar={setSelectAgeRangeSidebar}
        selectGenreSidebar={selectGenreSidebar}
        setSelectGenreSidebar={setSelectGenreSidebar}
        selectLangSidebar={selectLangSidebar}
        setSlectLangSidebar={setSlectLangSidebar}
        handleResetFilter={handleResetFilter}
      />
      <DashboardWraper navigationItems={parentPathConstants}>
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

        <div className={classNames("px-3 px-sm-0")}>
          <div
            className={classNames(
              "d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 gap-md-4",
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
              <CustomButton
                title="Website"
                Icon={GlobeIcon}
                IconDirction="left"
                containerStyle={classNames(styles.btn1Style)}
                iconStyle={classNames(styles.icon1Style)}
                onClick={() => {
                  window.open("https://" + publisherDetail?.website, "_blank");
                }}
              />

              <CustomButton
                title="Report"
                Icon={FlagIcon}
                IconDirction="left"
                containerStyle={classNames(styles.btn2Style)}
                iconStyle={classNames(styles.icon2Style)}
                onClick={handleShowReportModal}
              />
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
                "d-flex align-items-center align-self-end justify-content-end mt-3 gap-3"
              )}
            >
              <div className={classNames(styles.searchContainer, "px-3")}>
                <SearchIcon className={classNames(styles.searchIcon)} />
                <input
                  className={classNames(styles.searchInput, "ms-1")}
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setInitial(false);
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <CustomButton
                title={"Filters"}
                Icon={FilterLines}
                IconDirction="left"
                containerStyle={classNames(styles.filterBtnStyle, "gap-2")}
                iconStyle={classNames(styles.iconStyle)}
                onClick={() => {
                  setShowFilters(!showFilters);
                }}
              />
            </div>
            <div className={classNames(" w-100 mt-3 ")}>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start flex-wrap mb-5 position-relative px-4"
                )}
                id="parent-publisher-book-container"
              >
                {initialloading ? (
                  <BookLoader
                    Iteration={10}
                    isParentModule={true}
                    customContainer={classNames("mt-3 mt-md-4")}
                    isQuartor={isShown}
                  />
                ) : books?.length > 0 ? (
                  <>
                    {books?.map((itm: any, inx: any) => {
                      return (
                        <BookCard
                          item={itm}
                          parentElementId="parent-publisher-book-container"
                          key={inx}
                          onClick={() => {
                            router.push(
                              parentPanelConstant.preview.path.replace(
                                ":id",
                                itm?.id
                              )
                            );
                          }}
                          customContainerStyle={classNames("mt-3 mt-md-4")}
                          isQuator={isShown}
                        />
                      );
                    })}
                  </>
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
                    "w-100 d-flex align-items-center justify-content-center mb-5"
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
      </DashboardWraper>
      <ReportModal
        showModal={showReportModal}
        handleClose={handleCloseReportModal}
        type={2}
      />
    </>
  );
};

export const getServerSideProps = withError<{
  publisherData?: any;
  languageData?: any;
  genreData?: any;
  ageRangeData?: any;
  booksList?: any;
}>(async ({ req, res, params }) => {
  const [languageRes, genreRes, ageRangeRes, booksListRes, publisherRes] =
    await Promise.all([
      fetch(BaseURL + Endpoint.partner.book.languateList),
      fetch(BaseURL + Endpoint.partner.book.genreList),
      fetch(BaseURL + Endpoint.partner.book.ageRange),
      fetch(BaseURL + Endpoint.kid.book.all, {
        method: "POST",
        body: JSON.stringify({ publisher_id: params?.id }),
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }),
      fetch(BaseURL + Endpoint.kid.author.profile + params?.id),
    ]);
  const [languageData, genreData, ageRangeData, booksList, publisherData] =
    await Promise.all([
      languageRes.json(),
      genreRes.json(),
      ageRangeRes.json(),
      booksListRes.json(),
      publisherRes.json(),
    ]);

  return {
    props: {
      publisherData,
      languageData,
      genreData,
      ageRangeData,
      booksList,
    },
  };
});

export default Author;
