import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { Flow } from "assets";

const FlowCard = () => {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center justify-content-center mt-5 gap-3 mb-5"
      )}
    >
      <div className={classNames("d-flex flex-column")}>
        <label className={classNames(styles.title, "px-3 px-sm-0")}>
          FREE BOOKS FOR ALL.
        </label>
        <label className={classNames(styles.title, "px-3 px-sm-0")}>
          <span className={classNames(styles.primary)}>PREMIUM BOOKS</span> for
          MEMBERS ONLY!
        </label>
      </div>

      <label className={classNames(styles.subTitle, "px-3 px-sm-0")}>
        Join us, get coins, and unlock the magic of reading.
      </label>
      <Image
        src={Flow}
        alt="flow-cover"
        className={classNames(styles.cardsFlowImg)}
      />
    </div>
  );
};

export default FlowCard;
