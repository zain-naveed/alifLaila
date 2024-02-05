import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
interface Props {
  heading: string;
  headingStyle: any;
}

function Heading(props: Partial<Props>) {
  const { heading, headingStyle } = props;

  return (
    <h2
      className={classNames(
        headingStyle ? headingStyle : styles.heading,
        "m-0"
      )}
    >
      {heading}
    </h2>
  );
}

export default Heading;
