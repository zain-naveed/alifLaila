import React from "react";
import classNames from "classnames";
import styles from "./style.module.scss";
import Heading from "../heading";

interface BookProps {
  heading: string;
  value: string | number;
  bookStyeContainer?: any;
}
const RowItem = (props: BookProps) => {
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
        <span>{value}</span>
      </div>
    </>
  );
};

export default RowItem;
