import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";

interface CustomToolTipProps {
  children: any;
  label: string;
}

const CustomToolTip = ({ children, label }: CustomToolTipProps) => {
  return (
    <div className={classNames(styles.tooltip)}>
      {children}
      <span className={classNames(styles.tooltiptext)}>{label}</span>
    </div>
  );
};

export default CustomToolTip;
