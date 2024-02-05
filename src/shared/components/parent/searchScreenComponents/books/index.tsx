import { FilterLines } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import NoContentCard from "shared/components/common/noContentCard";
import BookCard from "shared/components/parent/bookCard";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { parentPanelConstant } from "shared/routes/routeConstant";
import styles from "./style.module.scss";

interface BooksProps {
  initialLoading: boolean;
  books: any[];
  currentPage: any;
  setShowFilters: (val: boolean) => void;
  loading: boolean;
  isLoadMore: boolean;
  setLoading: (val: boolean) => void;
  handleGetBooks: () => void;
}

const Books = ({
  initialLoading,
  books,
  setShowFilters,
  currentPage,
  loading,
  isLoadMore,
  setLoading,
  handleGetBooks,
}: BooksProps) => {
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const router: any = useRouter();

  return (
    <div className={classNames("mt-4")}>
      <div
        className={classNames("d-flex align-items-center justify-content-end")}
      >
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
      <div
        className={classNames(
          "d-flex align-items-start justify-content-between flex-column w-100"
        )}
      >
        <div
          className={classNames(
            "position-relative d-flex align-items-start justify-content-start flex-wrap  w-100"
          )}
          id="parent-books-filter-page-list"
        >
          {initialLoading ? (
            <BookLoader
              Iteration={12}
              isParentModule={true}
              customContainer={classNames("mt-3 mt-md-4")}
              isQuartor={isShown}
            />
          ) : books?.length > 0 ? (
            books?.map((itm: any, inx: any) => {
              return (
                <BookCard
                  item={itm}
                  parentElementId="parent-books-filter-page-list"
                  key={inx}
                  onClick={() => {
                    router.push(
                      parentPanelConstant.preview.path.replace(":id", itm?.id)
                    );
                  }}
                  customContainerStyle={classNames("mt-3 mt-md-4")}
                  isQuator={isShown}
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
        {isLoadMore && !initialLoading ? (
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
                handleGetBooks();
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Books;
