import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import Footer from "shared/components/footer";
import Books from "shared/components/kid/searchComponents/books";
import Publishers from "shared/components/kid/searchComponents/publishers";
import SideFiltersCanvas from "shared/components/kid/sideFiltersCanvas";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { allBookForKid } from "shared/services/kid/bookService";
import {
  getAgeRangeList,
  getGenreList,
  getLangList,
} from "shared/services/publisher/bookService";
import { SortFilters } from "shared/utils/pageConstant/kid/booksConstant";
import {
  SearchTabs,
  SearchTabsEnums,
} from "shared/utils/pageConstant/kid/searchConstants";
import styles from "./style.module.scss";
import { useScroll } from "shared/customHook/useScoll";

const Search = () => {
  const {
    search: { search },
  } = useSelector((state: any) => state.root);

  const router: any = useRouter();
  const bodyRef = useRef<any>(null);
  const currentPage = useRef<number>(1);
  const booklistRef = useRef<any[]>([]);

  const [searchVal, setSearchVal] = useState<string>(
    router?.query?.text ? router?.query?.text : ""
  );
  const [activeTab, setActiveTab] = useState<string | any>(SearchTabs[0]);
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
  const [total, setTotal] = useState<number>(0);
  const [publisherTotal, setPublisherTotal] = useState<number>(0);
  const [isLoadMore, setIsLoadMore] = useState<boolean>(true);

  const handleActiveTab = (val: string) => {
    setActiveTab(val);
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
    if (activeTab === SearchTabsEnums.books) {
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
    filter2,
    searchVal,
    activeTab,
  ]);

  useEffect(() => {
    if (router?.query?.text != undefined) {
      currentPage.current = 1;
      setSearchVal(router?.query?.text);
    }
  }, [router?.query?.text]);

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
            "px-3 px-sm-0 pt-4 w-100"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between w-100 mb-4"
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
              showSideFilters={showSideFilters}
              filter={filter}
              resetHandler={resetHandler}
              setShowSideFilters={setShowSideFilters}
              setShowFiltersCanvas={setShowFiltersCanvas}
              bookList={bookList}
              setFilterOptions={setFilterOptions}
              filterOptions={filterOptions}
              filter2={filter2}
              setFilter2={setFilter2}
              bookType={bookType}
              setBookType={setBookType}
              listLoading={listLoading}
              langList={langList}
              selectLang={selectLang}
              langHandler={langHandler}
              genreList={genreList}
              selectGenre={selectGenre}
              selectGenreHandler={selectGenreHandler}
              selectAgeRange={selectAgeRange}
              ageRangeHandler={ageRangeHandler}
              ageRangeList={ageRangeList}
              selectQuiz={selectQuiz}
              setSelectQuiz={setSelectQuiz}
              loading={loading}
              currentPage={currentPage}
              initialloading={initialloading}
              isLoadMore={isLoadMore}
              setLoading={setLoading}
              getAllBook={getAllBook}
            />
          ) : (
            <Publishers setTotal={setPublisherTotal} total={publisherTotal} />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Search;
