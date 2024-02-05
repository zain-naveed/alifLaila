import React from "react";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import classNames from "classnames";
import { ClockCircleIcon } from "assets";
import { getNumberOfDays } from "shared/utils/helper";

const CurrentPlan = () => {
  const {
    login: { currentPlan },
  } = useSelector((state: any) => state.root);
  return (
    <>
      {currentPlan ? (
        <div className={classNames("d-flex align-items-center")}>
          <div className={classNames("d-flex align-items-center gap-1")}>
            <ClockCircleIcon className={classNames(styles.circleIcon)} />
            <label className={classNames(styles.daysLabel)}>
              {getNumberOfDays(currentPlan?.expiry_date)} Days Left -
            </label>
          </div>
          <label className={classNames(styles.packageNameLabel, "ms-1")}>
            {currentPlan?.plan?.name}
          </label>
        </div>
      ) : null}
    </>
  );
};

export default CurrentPlan;
