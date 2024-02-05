import { DefaultBookImg, NoFavBookIcon } from "assets";
import NoContentCard from "shared/components/common/noContentCard";
import BoxLoader from "shared/loader/box";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {
  bookStats: any;
  loading: boolean;
  sortBy: string;
}

function PartnerAuthorReadBook(props: Props) {
  const { bookStats, loading, sortBy } = props;

  return (
    <>
      {loading ? (
        Array.from(Array(5).keys()).map((item: any, inx: number) => {
          return (
            <div className={classNames(styles.readBookWraper)} key={inx}>
              <BoxLoader iconStyle={styles.img} />
              <div className={classNames(styles.bookContentWrapper)}>
                <BoxLoader iconStyle={styles.headingLoader} />
                <BoxLoader iconStyle={styles.countLabelLoader} />
              </div>
            </div>
          );
        })
      ) : (
        <>
          {bookStats && bookStats?.length ? (
            bookStats?.map(
              (
                item: {
                  title: string;
                  thumbnail: any;
                  count: number;
                },
                inx: number
              ) => {
                return (
                  <div className={classNames(styles.readBookWraper)} key={inx}>
                    <img
                      src={
                        item?.thumbnail ? item?.thumbnail : DefaultBookImg.src
                      }
                      className={styles.img}
                      alt="Image Not found"
                      width={50}
                      height={50}
                    />
                    <div className={classNames(styles.bookContentWrapper)}>
                      <h5>{item?.title}</h5>

                      <span>
                        {sortBy === "most_read"
                          ? `Read ${item?.count} times`
                          : sortBy === "most_popular"
                          ? `Viewed ${item?.count} times`
                          : sortBy === "highly_rated"
                          ? `${item?.count} star ratings`
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <NoContentCard
              customContainer={classNames(
                "d-flex flex-column align-items-center gap-0 w-100"
              )}
              Icon={NoFavBookIcon}
              customIconContianer={styles.noFavBookIcon}
              customLabel1Style={styles.noFavBookLabel1}
              customLabel2Style={styles.noFavBookLabel2}
              label1="No record Found"
              label2="There is no record available"
            />
          )}
        </>
      )}
    </>
  );
}

export default PartnerAuthorReadBook;
