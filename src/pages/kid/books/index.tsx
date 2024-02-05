import { ChevDownIcon, FilterLines, SearchIcon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookCard from "shared/components/common/bookCard";
import CustomButton from "shared/components/common/customButton";
import CustomRadioButton from "shared/components/common/customRadioButton";
import NoContentCard from "shared/components/common/noContentCard";
import Footer from "shared/components/footer";
import CheckBox from "shared/components/kid/checkBox";
import FilterCollapse from "shared/components/kid/filterCollapseable";
import SideFiltersCanvas from "shared/components/kid/sideFiltersCanvas";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import useDebounce from "shared/customHook/useDebounce";
import { useScroll } from "shared/customHook/useScoll";
import OptionsDropDown from "shared/dropDowns/options";
import BookLoader from "shared/loader/pageLoader/kid/books";
import CheckBoxLoader from "shared/loader/pageLoader/kid/checkBoxLoader";
import CustomRadioLoader from "shared/loader/pageLoader/kid/customRadioLoader";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import {
  getAgeRangeList,
  getGenreList,
  getLangList,
} from "shared/services/publisher/bookService";
import {
  SortFilters,
  bookTypeFilters,
  quizFilters,
} from "shared/utils/pageConstant/kid/booksConstant";
import styles from "./style.module.scss";

const Books = () => {
  const { width } = useWindowDimensions();
  const { login } = useSelector((state: any) => state.root);
  const router: any = useRouter();
  const dispatch = useDispatch();
  const bodyRef = useRef<any>(null);
  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>([]);
  const [initialloading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [langList, setLangList] = useState([]);
  const [genreList, setGenreList] = useState([]);
  const [ageRangeList, setAgeRangeList] = useState([]);
  const [filterOptions, setFilterOptions] = useState<boolean>(false);
  const [showSideFilters, setShowSideFilters] = useState<boolean>(false);
  const [showFiltersCanvas, setShowFiltersCanvas] = useState<boolean>(false);
  const [filter2, setFilter2] = useState<any>(SortFilters[0]);
  const [selectGenre, setSelectGenre]: any = useState([]);
  const [selectLang, setSlectLang]: any = useState([]);
  const [selectQuiz, setSelectQuiz] = useState<number>(2);
  const [bookType, setBookType] = useState<number>(0);
  const [selectAgeRange, setSelectAgeRange] = useState<number>(0);
  const [bookList, setBookList] = useState([]);
  const [total, setTotal] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);
  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: SortFilters[0].label,
      Icon: null,
      action: () => {
        currentPage.current = 1;
        setFilter2(SortFilters[0]);
      },
    },
    {
      title: SortFilters[1].label,
      Icon: null,
      action: () => {
        currentPage.current = 1;
        setFilter2(SortFilters[1]);
      },
    },
    {
      title: SortFilters[2].label,
      Icon: null,
      action: () => {
        currentPage.current = 1;
        setFilter2(SortFilters[2]);
      },
    },
    {
      title: SortFilters[3].label,
      Icon: null,
      action: () => {
        currentPage.current = 1;
        setFilter2(SortFilters[3]);
      },
    },
  ];

  const navigateBookDetail = (bookId: string | number) => {
    if (login?.isLoggedIn) {
      router.push(
        kidPanelConstant.preview.path.replace(":id", bookId.toString())
      );
    } else {
      dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
    }
  };

  const getAllBook = () => {
    let formBody: any = new FormData();
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
    formBody.append("search", searchVal);
    formBody.append("sort_by", filter2 ? filter2?.value : SortFilters[0].value);
    allBookForKid(formBody, currentPage.current)
      .then(({ data: { data } }) => {
        if (data) {
          let tempArr: any = [...booklistRef.current, ...data?.data];
          booklistRef.current = tempArr;
          setBookList(tempArr);
          setTotal(data?.total);
          if (data?.current_page === data?.last_page) {
            setIsLoadMore(false);
          } else {
            setIsLoadMore(true);
          }
        }
      })
      .catch((err) => {})
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
    setSelectGenre([]);
    setSlectLang([]);
    setSelectAgeRange(0);
    setBookType(0);
    setSelectQuiz(2);
    currentPage.current = 1;
    booklistRef.current = [];
  };

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    setInitialLoading(true);
    currentPage.current = 1;
    booklistRef.current = [];
    setBookList([]);
    getAllBook();
  }, [
    selectGenre.length,
    selectLang.length,
    selectAgeRange,
    selectQuiz,
    bookType,
    searchVal,
    filter2,
  ]);

  useDebounce(
    () => {
      if (search !== undefined) {
        setSearchVal(search);
        // setCurrentPage(1);
        currentPage.current = 1;
      }
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
      <ReaderNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 mt-5 w-100"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between "
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              <CustomButton
                title={
                  !showSideFilters
                    ? "Filters"
                    : filter() > 0
                    ? "Reset Filters"
                    : "Filter"
                }
                Icon={FilterLines}
                IconDirction="left"
                containerStyle={classNames(styles.filterBtnStyle, "gap-2")}
                iconStyle={classNames(styles.iconStyle)}
                onClick={() => {
                  if (width < 768) {
                    if (showSideFilters) {
                      resetHandler();
                      setShowSideFilters(false);
                      setShowFiltersCanvas(false);
                    } else {
                      setShowFiltersCanvas(true);
                    }
                  } else {
                    if (showSideFilters) {
                      resetHandler();
                    }
                    setShowSideFilters(!showSideFilters);
                  }
                }}
              />
              {showSideFilters ? (
                <label className={classNames(styles.filterResultLabel)}>
                  {total} {filter() ? "filtered" : ""} Results
                </label>
              ) : null}
            </div>

            <div
              className={classNames(
                "d-flex  flex-row  align-items-center justify-content-end gap-3 "
              )}
            >
              <div className={classNames(styles.searchContainer, "px-3")}>
                <SearchIcon className={classNames(styles.searchIcon)} />
                <input
                  className={classNames(styles.searchInput, "ms-1")}
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div
                className={classNames(
                  styles.filter2Container,
                  "position-relative"
                )}
                onClick={() => {
                  setFilterOptions(!filterOptions);
                }}
              >
                <label className={classNames(styles.filter2Label)}>
                  {filter2?.label}
                </label>
                <ChevDownIcon className={classNames(styles.searchIcon)} />
                <OptionsDropDown
                  options={options}
                  openSelection={filterOptions}
                  setOpenSelection={setFilterOptions}
                  customContainer={styles.optionsContainer}
                />
              </div>
            </div>
          </div>
          <div className={classNames("d-flex")}>
            <div
              className={classNames(
                showSideFilters
                  ? "d-none  d-md-flex flex-column gap-3"
                  : "d-none",
                showSideFilters && styles.sideFiltersContainer,
                "mt-4"
              )}
            >
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
              <FilterCollapse title="Language" id="filter-books-screen-1">
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
              <FilterCollapse title="GENRE" id="filter-books-screen-2">
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
              <FilterCollapse title="AGE GROUP" id="filter-books-screen-3">
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start justify-content-between gap-2"
                  )}
                >
                  {listLoading ? (
                    <CustomRadioLoader iteration={4} />
                  ) : (
                    <>
                      <CustomRadioButton
                        isActive={selectAgeRange == 0}
                        onClick={() => ageRangeHandler(0)}
                        label={"All"}
                      />
                      {ageRangeList?.map((itm: any, inx) => {
                        return (
                          <CustomRadioButton
                            isActive={selectAgeRange == itm?.id}
                            onClick={() => ageRangeHandler(itm?.id)}
                            label={itm?.text}
                            key={inx}
                          />
                        );
                      })}
                    </>
                  )}
                </div>
              </FilterCollapse>
              <FilterCollapse
                title="Quiz"
                id="filter-books-screen-4"
                noBottomSeperator
              >
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start justify-content-between gap-2"
                  )}
                >
                  {quizFilters.map((itm, inx) => {
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
                id="books-filter-page-list"
              >
                {initialloading ? (
                  <BookLoader
                    Iteration={12}
                    customContainer={classNames("mt-3 mt-md-4")}
                    isQuartor={showSideFilters}
                  />
                ) : bookList?.length > 0 ? (
                  bookList?.map((itm: any, inx: any) => {
                    return (
                      <BookCard
                        compoID="books-filter"
                        key={inx}
                        index={inx}
                        parentElementId="books-filter-page-list"
                        item={itm}
                        onClick={() => navigateBookDetail(itm?.id)}
                        customContainerStyle={classNames("mt-3 mt-md-4")}
                        isQuarter={showSideFilters}
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
        <Footer />
      </div>
    </>
  );
};

export default Books;
