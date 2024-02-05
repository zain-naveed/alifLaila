import { ChevDownIcon, FilterLines } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import BookCard from "shared/components/common/bookCard";
import CustomButton from "shared/components/common/customButton";
import CustomRadioButton from "shared/components/common/customRadioButton";
import NoContentCard from "shared/components/common/noContentCard";
import CheckBox from "shared/components/kid/checkBox";
import FilterCollapse from "shared/components/kid/filterCollapseable";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import OptionsDropDown from "shared/dropDowns/options";
import BookLoader from "shared/loader/pageLoader/kid/books";
import CheckBoxLoader from "shared/loader/pageLoader/kid/checkBoxLoader";
import CustomRadioLoader from "shared/loader/pageLoader/kid/customRadioLoader";
import { kidPanelConstant } from "shared/routes/routeConstant";
import {
  SortFilters,
  bookTypeFilters,
  quizFilters,
} from "shared/utils/pageConstant/kid/booksConstant";
import styles from "./style.module.scss";

interface BooksProps {
  showSideFilters: boolean;
  filter: () => number;
  resetHandler: () => void;
  setShowSideFilters: (val: boolean) => void;
  setShowFiltersCanvas: (val: boolean) => void;
  bookList: any;
  setFilterOptions: (val: boolean) => void;
  filterOptions: boolean;
  filter2: any;
  setFilter2: (val: any) => void;
  bookType: any;
  setBookType: (val: any) => void;
  listLoading: boolean;
  langList: any;
  selectLang: any;
  langHandler: (val: any) => void;
  genreList: any;
  selectGenre: any;
  selectGenreHandler: (val: any) => void;
  selectAgeRange: any;
  ageRangeHandler: (val: any) => void;
  ageRangeList: any;
  selectQuiz: any;
  setSelectQuiz: (val: any) => void;
  loading: boolean;
  currentPage: any;
  initialloading: boolean;
  isLoadMore: boolean;
  setLoading: (val: boolean) => void;
  getAllBook: () => void;
}

const Books = ({
  showSideFilters,
  filter,
  resetHandler,
  setShowSideFilters,
  setShowFiltersCanvas,
  bookList,
  setFilterOptions,
  filterOptions,
  filter2,
  setFilter2,
  bookType,
  setBookType,
  listLoading,
  langList,
  selectLang,
  langHandler,
  genreList,
  selectGenre,
  selectGenreHandler,
  selectAgeRange,
  ageRangeHandler,
  ageRangeList,
  selectQuiz,
  setSelectQuiz,
  loading,
  currentPage,
  isLoadMore,
  initialloading,
  setLoading,
  getAllBook,
}: BooksProps) => {
  const router: any = useRouter();
  const { width } = useWindowDimensions();

  const navigateBookDetail = (bookId: string | number) => {
    router.push(
      kidPanelConstant.preview.path.replace(":id", bookId.toString())
    );
  };

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

  return (
    <div
      className={classNames(styles.customContainer, "px-3 px-sm-0 mt-4 w-100")}
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
              {bookList.length} {filter() ? "filtered" : ""} Results
            </label>
          ) : null}
        </div>

        <div
          className={classNames(
            "d-flex  flex-row  align-items-center justify-content-end gap-3 "
          )}
        >
          <div
            className={classNames(styles.filter2Container, "position-relative")}
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
            showSideFilters ? "d-none  d-md-flex flex-column gap-3" : "d-none",
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
                langList?.map((itm: any, inx: any) => {
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
                genreList?.map((itm: any, inx: any) => {
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
                  {ageRangeList?.map((itm: any, inx: any) => {
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
                    compoID="search-book"
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
  );
};

export default Books;
