import { CrossIcon, NextIcon } from "assets";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import CustomInput from "shared/components/common/customInput";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  applyFilter: (val1: any, val2: any) => void;
  applyResetFilter: any;
}
const HistoryFilterSidebar = ({
  isOpen,
  setIsOpen,
  applyFilter,
  applyResetFilter,
}: SideCanvasProps) => {
  const [start, setStart] = useState<any>();
  const [end, setEnd] = useState<any>();
  function handleClick(e: any) {
    const elem: any = document.getElementById("filterSideCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem = document.getElementById("backDropFilterContainer");
    elem?.addEventListener("click", handleClick);
    return () => {
      elem?.removeEventListener("click", handleClick);
    };
  }, []);

  const allReset = () => {
    setStart(null);
    setEnd(null);
    applyResetFilter();
  };

  return (
    <div
      className={classNames(styles.backDropContainer)}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropFilterContainer"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="filterSideCanvas"
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center px-4 py-4"
          )}
        >
          <Heading heading="Filters" />
          <div
            className={classNames(styles.crossIconContainer)}
            onClick={() => {
              setIsOpen(false);
            }}
            role="button"
          >
            <CrossIcon />
          </div>
        </div>
        <div className="px-4">
          <CustomInput
            label="Start Date"
            type="date"
            isDate
            placeholder="Select Start Date"
            value={start}
            onChange={(e) => {
              setStart(e.currentTarget.value);
            }}
          />
          <CustomInput
            label="End Date"
            type="date"
            isDate
            placeholder="Select End Date"
            value={end}
            onChange={(e) => {
              setEnd(e.currentTarget.value);
            }}
          />
        </div>
        <div className={classNames(styles.filterButton)}>
          <CustomButton
            onClick={allReset}
            title="Reset Filters"
            containerStyle={styles.resetfilterButton}
            iconStyle={styles.iconStyle}
          />
          <CustomButton
            onClick={() => applyFilter(start, end)}
            title="Apply Filters"
            containerStyle={styles.filterButton}
            iconStyle={styles.iconStyle}
            IconDirction="right"
            Icon={NextIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryFilterSidebar;
