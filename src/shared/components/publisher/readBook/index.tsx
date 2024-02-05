import React from "react";
import { NoFavBookIcon } from "assets";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import Image from "next/image";
import BoxLoader from "shared/loader/box";
import NoContentCard from "shared/components/common/noContentCard";
interface Props {
  bookStats: any;
  loading: boolean;
  sortBy: string;
}

function ReadBook(props: Props) {
  const { bookStats, loading, sortBy } = props;

  return (
    <>
      {loading ? (
        Array.from(Array(3).keys()).map((item: any, inx: number) => {
          return (
            <div
              className={classNames(
                styles.readBookWraper,
                inx !== 0 ? styles.padingTop21 : "",
                inx !== 2 ? styles.borderWithPaddingBottom : ""
              )}
              key={inx}
            >
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
                  thumbnail: string;
                  count: number;
                },
                inx: number
              ) => {
                return (
                  <div
                    className={classNames(
                      styles.readBookWraper,
                      inx !== 0 ? styles.padingTop21 : "",
                      inx !== bookStats.length - 1
                        ? styles.borderWithPaddingBottom
                        : ""
                    )}
                    key={inx}
                  >
                    <img
                      src={item?.thumbnail}
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

export default ReadBook;
