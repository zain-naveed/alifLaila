import classNames from "classnames";
import Heading from "../heading";
import styles from "./style.module.scss";

interface BookProps {
  heading: string;
  value: any;
  bookStyeContainer?: any;
}
const ColumnItem = (props: BookProps) => {
  const { heading, value, bookStyeContainer } = props;
  return (
    <>
      <div
        className={classNames(
          styles.bookItemContainer,
          bookStyeContainer ? bookStyeContainer : ""
        )}
      >
        <Heading heading={heading} headingStyle={styles.bookItemHeading} />
        <span>Rs. {Math.trunc(value)}</span>
      </div>
    </>
  );
};

export default ColumnItem;
