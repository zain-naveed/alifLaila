import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";

const BookInfo = ({ bookDetail }: any) => {
  return (
    <div
      className={classNames("d-flex flex-column align-items-center w-100 py-2")}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start w-100 p-4 flex-wrap gap-3"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column align-items-start",
            styles.contentContainer
          )}
        >
          <label className={classNames(styles.title)}>Age Range</label>
          <label className={classNames(styles.subTitle)}>
            {bookDetail?.age_range?.min}-{bookDetail?.age_range?.max}
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start",
            styles.contentContainer
          )}
        >
          <label className={classNames(styles.title, styles.secondary)}>
            No. of Pages
          </label>
          <label className={classNames(styles.subTitle)}>
            {bookDetail?.total_pages}
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start",
            styles.contentContainer
          )}
        >
          <label className={classNames(styles.title, styles.yellow)}>
            Quiz
          </label>
          <label className={classNames(styles.subTitle)}>
            {" "}
            {bookDetail?.is_quiz ? "Yes" : "No"}
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start",
            styles.contentContainer
          )}
        >
          <label className={classNames(styles.title, styles.green)}>
            Language
          </label>
          <label className={classNames(styles.subTitle)}>
            {" "}
            {bookDetail?.language?.name}
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start",
            styles.contentContainer
          )}
        >
          <label className={classNames(styles.title, styles.green)}>
            Genre
          </label>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-1 flex-wrap"
            )}
          >
            {bookDetail?.genres?.map((itm: any, inx: any) => {
              return (
                <label className={classNames(styles.subTitle)} key={inx}>
                  {itm?.name}
                  {inx !== bookDetail?.genres?.length - 1 ? `,` : ""}
                </label>
              );
            })}
          </div>
        </div>
      </div>
      {bookDetail?.buy_coins ||
      bookDetail?.borrow_coins ||
      bookDetail?.is_hard_copy ? (
        <>
          <div className={classNames(styles.seperator)} />
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start w-100 p-4 flex-wrap gap-3"
            )}
          >
            {bookDetail?.buy_coins ? (
              <div
                className={classNames(
                  "d-flex flex-column align-items-start",
                  styles.contentContainer
                )}
              >
                <label className={classNames(styles.title, styles.secondary)}>
                  Coins for Buy
                </label>
                <label className={classNames(styles.subTitle)}>
                  {bookDetail?.buy_coins}
                </label>
              </div>
            ) : null}

            {bookDetail?.borrow_coins ? (
              <div
                className={classNames(
                  "d-flex flex-column align-items-start",
                  styles.contentContainer
                )}
              >
                <label className={classNames(styles.title)}>
                  Coins for Borrow
                </label>
                <label className={classNames(styles.subTitle)}>
                  {bookDetail?.borrow_coins}
                </label>
              </div>
            ) : null}

            {bookDetail?.is_hard_copy ? (
              <div
                className={classNames(
                  "d-flex flex-column align-items-start",
                  styles.contentContainer
                )}
              >
                <label className={classNames(styles.title, styles.green)}>
                  Printed Book Price
                </label>
                <label className={classNames(styles.subTitle)}>
                  {Math.trunc(bookDetail?.price)} pkr
                </label>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BookInfo;
