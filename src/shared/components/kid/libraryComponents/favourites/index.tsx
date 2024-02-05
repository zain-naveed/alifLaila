import { NoFavBookIcon, SearchIcon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BookCard from "shared/components/common/bookCard";
import NoContentCard from "shared/components/common/noContentCard";
import Pagination from "shared/components/common/pagination";
import useDebounce from "shared/customHook/useDebounce";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { bookFavList } from "shared/services/kid/bookService";
import styles from "./style.module.scss";
const Favourites = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(10);
  const [favList, setFavList] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [loadMore, setLoadMore] = useState<boolean>(false);

  const favListHandler = () => {
    setLoading(true);
    let formBody = new FormData();
    formBody.append("search", search);
    bookFavList(formBody, currentPage)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setFavList(data?.data);
          setTotal(data?.total);
          if (data?.current_page === data?.last_page) {
            setLoadMore(false);
          } else {
            setLoadMore(true);
          }
        } else {
          setFavList([]);
          setTotal(0);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setIsInitialPageLoad(false);
      });
  };

  const removeItem = (bookItem: any) => {
    const favListClone = [...favList];
    const index = favListClone.findIndex((itm) => itm.id === bookItem.id);
    if (index > -1) {
      favListClone.splice(index, 1);
      setFavList(favListClone);
    }
  };

  useDebounce(
    () => {
      if (!isInitialPageLoad) {
        favListHandler();
      }
    },
    [search],
    800
  );

  useEffect(() => {
    favListHandler();
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
          <label className={classNames(styles.title)}>Favourite Books </label>
          <label className={classNames(styles.subTitle)}>
            See your all Favourite Books
          </label>
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
      <div
        className={classNames(
          `d-flex align-items-center justify-content-start flex-wrap position-relative`
        )}
        id="favourite-book-list"
      >
        {loading ? (
          <BookLoader Iteration={10} customContainer={classNames("mt-4")} />
        ) : favList && favList.length ? (
          favList.map((itm, inx) => {
            return (
              <BookCard
                compoID="favourite-book"
                item={itm}
                key={inx}
                index={inx}
                customContainerStyle={classNames("mt-4")}
                parentElementId="favourite-book-list"
                onClick={() => {
                  router.push(
                    kidPanelConstant.preview.path.replace(":id", itm?.id)
                  );
                }}
                isFav
                removeItem={removeItem}
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
            label2="There is no Book available in the “Favourites” page"
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

export default Favourites;
