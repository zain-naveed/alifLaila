import { ChevDownIcon, NoFavBookIcon, SearchIcon } from "assets";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import Pagination from "shared/components/common/pagination";
import { myyBooksList } from "shared/services/kid/bookService";
import useDebounce from "shared/customHook/useDebounce";
import NoContentCard from "shared/components/common/noContentCard";
import { SortFilters } from "shared/utils/pageConstant/kid/libraryConstant";
import OptionsDropDown from "shared/dropDowns/options";
import BookLoader from "shared/loader/pageLoader/kid/books";
import PersonalBookCard from "shared/components/kid/personalBookCard";

const MyBooks = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(10);
  const [bookList, setBookList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [activeSelection, setActiveSelection] = useState<any>(null);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: SortFilters[0].label,
      Icon: null,
      action: () => {
        setActiveSelection(SortFilters[0]);
        handleGetMyBooksList(SortFilters[0].value);
      },
    },
    {
      title: SortFilters[1].label,
      Icon: null,
      action: () => {
        setActiveSelection(SortFilters[1]);
        handleGetMyBooksList(SortFilters[1].value);
      },
    },
    {
      title: SortFilters[2].label,
      Icon: null,
      action: () => {
        setActiveSelection(SortFilters[2]);
        handleGetMyBooksList(SortFilters[2].value);
      },
    },
  ];

  const handleGetMyBooksList = (sort: any) => {
    setLoading(true);
    let formBody = new FormData();
    formBody.append("search", search);
    formBody.append("sort_by", sort);
    myyBooksList(formBody, currentPage)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setBookList(data?.data);
          setTotal(data?.total);
          if (data?.current_page === data?.last_page) {
            setLoadMore(false);
          } else {
            setLoadMore(true);
          }
        } else {
          setBookList([]);
          setTotal(0);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setIsInitialPageLoad(false);
      });
  };

  useDebounce(
    () => {
      if (!isInitialPageLoad) {
        handleGetMyBooksList(
          activeSelection?.value ? activeSelection?.value : ""
        );
      }
    },
    [search],
    800
  );

  useEffect(() => {
    handleGetMyBooksList("");
  }, [currentPage]);

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mt-4"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-start flex-column justify-content-center"
          )}
        >
          <label className={classNames(styles.title)}>My Purchased books</label>
          <label className={classNames(styles.subTitle)}>
            See all your Books Listing here
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column-reverse flex-md-row align-items-end align-items-md-center justify-content-end gap-2"
          )}
        >
          <div
            className={classNames(styles.filterContainer, "position-relative")}
            role="button"
            onClick={() => {
              setOpenSelection(!openSelection);
            }}
          >
            <label
              className={classNames(
                styles.filterLabel,
                !activeSelection && styles.inActiveLabel
              )}
              role="button"
            >
              {!activeSelection ? "Sort by:" : activeSelection?.label}
            </label>
            <ChevDownIcon
              className={classNames(
                styles.chevIcon,
                !activeSelection && styles.inActive
              )}
            />
            <OptionsDropDown
              options={options}
              openSelection={openSelection}
              setOpenSelection={setOpenSelection}
              customContainer={styles.optionsContainer}
            />
          </div>
          <div className={classNames(styles.searchContainer, "px-3")}>
            <SearchIcon className={classNames(styles.searchIcon)} />
            <input
              className={classNames(styles.searchInput, "ms-1")}
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start flex-wrap position-relative"
        )}
        id="mybooks-books-listing"
      >
        {loading ? (
          <BookLoader Iteration={10} customContainer={classNames("mt-4")} />
        ) : bookList && bookList.length ? (
          bookList.map((itm, inx) => {
            return (
              <PersonalBookCard
                key={inx}
                item={itm}
                parentElementId="mybooks-books-listing"
                customContainerStyle={classNames("mt-4")}
              />
            );
          })
        ) : (
          <NoContentCard
            customContainer={classNames(
              "d-flex flex-column align-items-center gap-0 w-100"
            )}
            Icon={NoFavBookIcon}
            label1="No Books Found"
            label2="There is no Book available in the “My Books” page"
          />
        )}
      </div>
      {loadMore ? (
        <div className={classNames(styles.seperator, "mt-5")} />
      ) : null}
      {!loading ? (
        <Pagination
          currentPage={currentPage}
          totalCount={total}
          pageSize={8}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      ) : null}
    </>
  );
};

export default MyBooks;
