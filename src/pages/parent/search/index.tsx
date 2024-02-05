import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import FiltersCanvas from "shared/components/parent/filterCanvas";
import Books from "shared/components/parent/searchScreenComponents/books";
import Publishers from "shared/components/parent/searchScreenComponents/publisher";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  SearchTabs,
  SearchTabsEnums,
} from "shared/utils/pageConstant/kid/searchConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";

const Search = ({
  text,
  languageData,
  genreData,
  ageRangeData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    search: { search },
  } = useSelector((state: any) => state.root);

  const dispatch = useDispatch();
  const router = useRouter();

  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>([]);

  const [activeTab, setActiveTab] = useState<string | any>(SearchTabs[0]);
  const [total, setTotal] = useState<number>(0);
  const [publisherTotal, setPublisherTotal] = useState<number>(0);
  const [initialloading, setInitialLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectQuizSidebar, setSelectQuizSidebar] = useState<number>(0);
  const [bookTypeSidebar, setBookTypeSidebar] = useState<number>(0);
  const [selectAgeRangeSidebar, setSelectAgeRangeSidebar] = useState<number>(0);
  const [selectGenreSidebar, setSelectGenreSidebar] = useState<any>([]);
  const [selectLangSidebar, setSlectLangSidebar] = useState<any>([]);
  const [books, setBooks] = useState<any>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [applyFilters, setApplyFilters] = useState<boolean>(false);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);

  const handleActiveTab = (val: string) => {
    setActiveTab(val);
    currentPage.current = 1;
  };

  const handleApplyFilter = () => {
    currentPage.current = 1;
    setApplyFilters(!applyFilters);
    setShowFilters(false);
  };

  const handleResetFilter = () => {
    currentPage.current = 1;
    setSelectQuizSidebar(0);
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
    formBody.append("search", search);

    allBookForKid(formBody, currentPage.current)
      .then(
        ({
          data: {
            data: { data, total, current_page, last_page },
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
          setTotal(total);
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Dashboard",
            action: () => {
              router.push(parentPanelConstant.dashboard.path);
            },
          },
          {
            title: "Search",
          },
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (activeTab === SearchTabsEnums.books && text != undefined) {
      currentPage.current = 1;
      booklistRef.current = [];
      setInitialLoading(true);
      handleGetBooks();
    }
  }, [applyFilters, text, activeTab]);

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
        <div className={classNames(styles.mainContainer, "mb-5")}>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between w-100 mb-3"
            )}
          >
            <label className={classNames(styles.title)}>
              Search Results <span>“{search}”</span>
            </label>
            <label className={classNames(styles.resultLabel)}>
              {activeTab === SearchTabsEnums.books ? (
                <>
                  {total} result{total > 1 ? "s" : ""} found
                </>
              ) : (
                <>
                  {publisherTotal} result{publisherTotal > 1 ? "s" : ""} found
                </>
              )}
            </label>
          </div>
          <CustomTab
            tabs={SearchTabs}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          {activeTab === SearchTabsEnums.books ? (
            <Books
              initialLoading={initialloading}
              books={books}
              currentPage={currentPage}
              setShowFilters={setShowFilters}
              loading={loading}
              isLoadMore={isLoadMore}
              setLoading={setLoading}
              handleGetBooks={handleGetBooks}
            />
          ) : (
            <Publishers setTotal={setPublisherTotal} total={publisherTotal} />
          )}
        </div>
      </DashboardWraper>
    </>
  );
};

export const getServerSideProps = withError(async ({ res, req, query }) => {
  const [languageRes, genreRes, ageRangeRes] = await Promise.all([
    fetch(BaseURL + Endpoint.partner.book.languateList),
    fetch(BaseURL + Endpoint.partner.book.genreList),
    fetch(BaseURL + Endpoint.partner.book.ageRange),
  ]);
  const [languageData, genreData, ageRangeData] = await Promise.all([
    languageRes.json(),
    genreRes.json(),
    ageRangeRes.json(),
  ]);
  return {
    props: {
      text: query?.text ? query?.text : "",
      languageData,
      genreData,
      ageRangeData,
    },
  };
});

export default Search;
