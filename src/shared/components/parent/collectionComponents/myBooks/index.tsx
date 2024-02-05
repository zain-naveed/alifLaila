import { NoFavBookIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import NoContentCard from "shared/components/common/noContentCard";
import CustomPagination from "shared/components/kid/customPagination";
import BookLoader from "shared/loader/pageLoader/kid/books";
import { myyBooksList } from "shared/services/kid/bookService";
import PersonalBookCard from "../../personalBookCard";
import styles from "../style.module.scss";
interface Props {
  data: any;
  intialLoading: boolean;
}

const MyBooks = ({ data, intialLoading }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(data?.total);
  const [books, setBooks] = useState<any>(data?.data);
  const [loading, setLoading] = useState<boolean>(intialLoading);
  const [initial, setInitial] = useState<boolean>(true);

  const handleGetMyBooksList = () => {
    setLoading(true);
    myyBooksList({}, currentPage)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setBooks(data?.data);
          setTotal(data?.total);
        } else {
          setBooks([]);
          setTotal(0);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setInitial(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      handleGetMyBooksList();
    }
  }, [currentPage]);

  useEffect(() => {
    setLoading(intialLoading);
  }, [intialLoading]);

  useEffect(() => {
    setBooks(data?.data);
  }, [data]);

  return (
    <div
      className={classNames(
        styles.booksContainer,
        "d-flex align-items-center justify-content-start flex-wrap position-relative mb-4 mb-sm-5 pt-4"
      )}
      id="mybooks-parent-books-listing"
    >
      {loading ? (
        <BookLoader isParentModule Iteration={10} />
      ) : (
        <>
          {books?.length > 0 ? (
            <>
              {books?.map((itm: any, inx: any) => {
                return (
                  <PersonalBookCard
                    key={inx}
                    item={itm}
                    parentElementId="mybooks-parent-books-listing"
                    customContainerStyle={classNames(styles.margin)}
                  />
                );
              })}
              <div
                className={classNames(
                  "w-100 d-flex align-items-center justify-content-center"
                )}
              >
                <CustomPagination
                  currentPage={currentPage}
                  totalCount={total}
                  pageSize={8}
                  onPageChange={(page: any) => {
                    setInitial(false);
                    setCurrentPage(page);
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <NoContentCard
                customContainer={classNames(
                  "d-flex flex-column align-items-center gap-0 w-100"
                )}
                Icon={NoFavBookIcon}
                label1="No Books Found"
                label2="There is no Book available in the “My Books” page"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MyBooks;
