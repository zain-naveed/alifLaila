import { ChevMinus, ChevPlus } from "assets";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";

interface FilterCollapseProps {
  title: string;
  children: any;
  id: string;
  noBottomSeperator?: boolean;
  topSeperator?: boolean;
}

const FilterCollapse = ({
  title,
  children,
  id,
  noBottomSeperator,
  topSeperator,
}: FilterCollapseProps) => {
  const [show, setShow] = useState<boolean>(true);
  useEffect(() => {
    let divItem = document.getElementById(id);
    if (divItem) {
      let height = divItem.clientHeight;
      if (height !== 0) {
        divItem.style.height = height + "px";
      }
    }
  }, [id]);
  return (
    <div
      className={classNames("d-flex align-items-start flex-column w-100 gap-3")}
    >
      {topSeperator ? <div className={classNames(styles.seperator)} /> : null}
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100"
        )}
        onClick={() => {
          setShow(!show);
        }}
        role={"button"}
      >
        <label className={classNames(styles?.title)} role={"button"}>
          {title}
        </label>
        {show ? (
          <ChevMinus className={classNames(styles?.icon)} />
        ) : (
          <ChevPlus className={classNames(styles?.icon)} />
        )}
      </div>
      <div
        className={classNames(styles.collapseItem, !show && styles.hide)}
        id={id}
      >
        {children}
      </div>
      {!noBottomSeperator ? (
        <div className={classNames(styles.seperator)} />
      ) : null}
    </div>
  );
};

export default FilterCollapse;
