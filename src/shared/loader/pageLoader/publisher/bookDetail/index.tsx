import classNames from "classnames";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";

interface Props {}

function BookDetailLoading(props: Props) {
  return (
    <div className={classNames(styles.bookDetailWrapper, styles.book_cover)}>
      <div className={classNames(styles.bookPadding, "pb-0")}>
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center",
            styles.bookWrapper
          )}
        >
          <BoxLoader iconStyle={styles.bookHeading} />
          <BoxLoader iconStyle={styles.result} />
        </div>
        <div
          className={classNames(
            "mt-4 position-relative",
            styles.bookPreviewWrapper
          )}
        >
          <BoxLoader iconStyle={styles.img} />
        </div>
        <div className={classNames("mt-4", styles.aboutBook)}>
          <BoxLoader iconStyle={styles.aboutBookHeading} />
          <BoxLoader iconStyle={styles.p} />
          <BoxLoader iconStyle={styles.p} />
          <BoxLoader iconStyle={styles.p} />
        </div>
      </div>
      <div className={classNames(styles.bookLine)}></div>
      <div className={classNames(styles.bookPadding, styles.bookInfo)}>
        <div className="d-flex mt-3">
          <BookInfoItem />

          <BookInfoItem bookStyeContainer={classNames("mx-5")} />
          <BookInfoItem bookStyeContainer={classNames(styles.marginLeft)} />
        </div>
      </div>
    </div>
  );
}
interface BookProps {
  bookStyeContainer?: any;
}
const BookInfoItem = (props: BookProps) => {
  const { bookStyeContainer } = props;
  return (
    <>
      <div
        className={classNames(
          styles.bookItemContainer,
          bookStyeContainer ? bookStyeContainer : ""
        )}
      >
        <BoxLoader iconStyle={styles.bookItemHeading} />
        <BoxLoader iconStyle={styles.bookItemValue} />
      </div>
    </>
  );
};

export default BookDetailLoading;
