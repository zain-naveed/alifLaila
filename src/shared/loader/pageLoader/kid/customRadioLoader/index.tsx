import classNames from "classnames";
import React, { useState } from "react";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
interface Props {
  iteration: number;
}

function CustomRadioLoader(props: Props) {
  const { iteration } = props;

  return (
    <>
      {Array.from(Array(iteration).keys()).map((item, index) => {
       return <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
          key={index}
        >
          <div className={classNames(styles?.checkContainer)}>
            <BoxLoader />
          </div>
          <span className={classNames(styles.labelStyle)}>
            <BoxLoader />
          </span>
        </div>;
      })}
    </>
  );
}

export default CustomRadioLoader;
