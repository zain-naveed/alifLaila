import classNames from "classnames";
import React from "react";
import styles from "../style.module.scss";
import { useSelector } from "react-redux";

const CoinsCount = () => {
  const {
    login: { remainingCoins },
  } = useSelector((state: any) => state.root);
  return (
    <label className={classNames(styles.totalCoins)}>
      {remainingCoins ? remainingCoins : 0}
    </label>
  );
};

export default CoinsCount;
