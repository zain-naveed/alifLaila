import classNames from "classnames";
import React, { useState } from "react";
import styles from "./style.module.scss";
import { TickIcon } from "assets";

interface CheckBoxProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const CheckBox = ({ label, isActive, onClick }: CheckBoxProps) => {
  const [checked, setChecked] = useState<boolean>(false);
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start gap-2"
      )}
      // onClick={() => {
      //   setChecked(!checked);
      // }}
      onClick={onClick}
      role="button"
    >
      <div
        className={classNames(
          styles?.checkContainer,
          isActive && styles.activeCheckContainer
        )}
      >
        {isActive ? <TickIcon /> : null}
      </div>
      <span className={classNames(styles.labelStyle)}>{label}</span>
    </div>
  );
};

export default CheckBox;
