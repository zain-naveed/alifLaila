import classNames from "classnames";
import React, { useState } from "react";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";

interface CheckBoxProps {
  iteration: number;
}
const CheckBoxLoader = ({ iteration }: CheckBoxProps) => {
  return (
    <>
      {Array.from(Array(iteration).keys()).map((item, index) => {
        return (
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
            role="button"
            key={index}
          >
            <BoxLoader iconStyle={styles?.checkContainer} />
            <span className={classNames(styles.labelStyle)}>
              <BoxLoader />
            </span>
          </div>
        );
      })}
    </>
  );
};

export default CheckBoxLoader;
