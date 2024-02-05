import { FilterLines, SearchIcon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import NoContentCard from "shared/components/common/noContentCard";
import Title from "shared/components/common/title";
import useDebounce from "shared/customHook/useDebounce";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import BookCard from "../../bookCard";
import FiltersCanvas from "../../filterCanvas";
import ProfileInfo from "../profileInfo";
import styles from "./style.module.scss";

interface AssignBookProps {
  title: string;
  isInProfile?: boolean;
  languageData: any;
  genreData: any;
  ageRangeData: any;
  profileData?: any;
  booksList: any;
  kidId?: string;
}

const AllBooks = ({
  title,
  isInProfile,
  languageData,
  genreData,
  ageRangeData,
  profileData,
  booksList,
  kidId,
}: AssignBookProps) => {
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const router = useRouter();

  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>(booksList?.data);

  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectQuizSidebar, setSelectQuizSidebar] = useState<number>(2);
  const [bookTypeSidebar, setBookTypeSidebar] = useState<number>(0);
  const [selectAgeRangeSidebar, setSelectAgeRangeSidebar] = useState<number>(0);
  const [selectGenreSidebar, setSelectGenreSidebar] = useState<any>([]);
  const [selectLangSidebar, setSlectLangSidebar] = useState<any>([]);
  const [books, setBooks] = useState<any>(booksList?.data);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [applyFilters, setApplyFilters] = useState<boolean>(false);
  const [initialloading, setInitialLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);
  const [initial, setInitial] = useState<boolean>(
    booksList?.current_page === booksList?.last_page ? false : true
  );

  const handleApplyFilter = () => {
    setInitial(false);
    booklistRef.current = [];
    currentPage.current = 1;
    setSearchVal("");
    setApplyFilters(!applyFilters);
    setShowFilters(false);
  };

  const handleResetFilter = () => {
    setInitial(false);
    booklistRef.current = [];
    currentPage.current = 1;
    setSelectQuizSidebar(2);
    setBookTypeSidebar(0);
    setSelectAgeRangeSidebar(0);
    setSelectGenreSidebar([]);
    setSlectLangSidebar([]);
    setApplyFilters(!applyFilters);
    setShowFilters(false);
  };

  const handleGetBooks = () => {
    let formBody: any = new FormData();
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

    if (kidId) {
      formBody.append("kid_id", kidId);
    }

    allBookForKid(formBody, currentPage.current)
      .then(
        ({
          data: {
            data: { data, last_page, current_page },
          },
        }) => {
          let tempArr: any = [...booklistRef.current, ...data];
          booklistRef.current = tempArr;
          setBooks(tempArr);
          if (current_page === last_page) {
            setIsLoadMore(false);
          } else {
            setIsLoadMore(true);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      booklistRef.current = [];
      currentPage.current = 1;
      setInitialLoading(true);
      handleGetBooks();
    }
  }, [applyFilters, searchVal]);

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
        {isInProfile ? <ProfileInfo profileData={profileData} /> : null}
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-sm-center justify-content-between flex-column flex-sm-row pt-4"
          )}
        >
          <div
            className={classNames("d-flex flex-column align-items-start gap-1")}
          >
            <Heading heading={title} headingStyle={styles.bookMainHeading} />
            <Title
              title="Find newly added books from publishers here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames(
              "d-flex flex-column flex-md-row align-items-start align-items-md-center  justify-content-between gap-3"
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
            <div
              className={classNames(styles.filterContainer, "gap-2")}
              onClick={() => {
                setShowFilters(true);
              }}
            >
              <FilterLines className={classNames(styles.filterIcon)} />
              <label className={classNames(styles.filterLabel)}>Filters</label>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start flex-wrap mb-5 position-relative"
          )}
          id="parent-assign-book-container"
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
                    parentElementId="parent-assign-book-container"
                    key={inx}
                    onClick={() => {
                      router.push(
                        parentPanelConstant.preview.path.replace(":id", itm?.id)
                      );
                    }}
                    customContainerStyle={classNames("mt-3 mt-md-4")}
                    isInKidProfile={isInProfile}
                    kid_id={kidId}
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
                handleGetBooks();
              }}
            />
          </div>
        ) : null}
      </DashboardWraper>
    </>
  );
};

export default AllBooks;
