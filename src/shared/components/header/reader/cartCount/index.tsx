import React from "react";
import styles from "../style.module.scss";
import classNames from "classnames";
import { useSelector } from "react-redux";

const CartCount = () => {
  const { cart } = useSelector((state: any) => state.root);
  return cart?.count > 0 ? (
    <div className={classNames(styles.countContainer)}>{cart?.count}</div>
  ) : null;
};

export default CartCount;
