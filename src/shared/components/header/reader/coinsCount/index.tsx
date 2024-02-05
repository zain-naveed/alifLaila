import classNames from "classnames";
import React, { useEffect } from "react";
import styles from "../style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { getWallet } from "shared/services/kid/walletService";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { kidAccountRole } from "shared/utils/enum";
import dynamic from "next/dynamic";

const CoinsCount = () => {
  const {
    login: { remainingCoins, kidRole },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const handleGetWallet = () => {
    getWallet()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(setLoginUser({ remainingCoins: data?.remaining_coins }));
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    handleGetWallet();
  }, []);

  return (
    <>
      <label className={classNames(styles.totalCoinsLabel)} role="button">
        {kidRole === kidAccountRole.family ? "Remaining Coins" : "Total Coins"}
      </label>
      <label className={classNames(styles.totalCoins)} role="button">
        {remainingCoins && remainingCoins > 0 ? remainingCoins : 0}
      </label>
    </>
  );
};

export default dynamic(() => Promise.resolve(CoinsCount), {
  ssr: false,
  loading: () => {
    return (
      <>
        <label className={classNames(styles.totalCoinsLabel)} role="button">
          Total Coins
        </label>
        <label className={classNames(styles.totalCoins)} role="button">
          0
        </label>
      </>
    );
  },
});
