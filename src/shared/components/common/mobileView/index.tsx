import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import Image from "next/image";
import { AppleStore, GooglePay, LogoIcon, MobileViewBG } from "assets";

const MobileView = () => {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-center justify-content-center px-3 w-100"
      )}
      style={{ height: "100vh" }}
    >
      <LogoIcon className={classNames(styles.icon, "mt-3 mb-4")} />
      <div className={classNames(styles.viewContainer, "w-100 pt-4")}>
        <MobileViewBG className={classNames(styles.imgStyle)} />
      </div>
      <label className={classNames(styles.title, "mt-3")}>
        {/* Get the Aliflaila app to browse on mobile */}
        Aliflaila App Coming Soon
      </label>
      <label className={classNames(styles.subTitle, "mt-2")}>
        {/* Browse thousands of book, earn rewards, catch up on notifications and
        many more - all in Aliflaila mobile app */}
        To continue reading on mobile, open the website in desktop view . Click
        on the settings icon, and from there, turn on the
        <strong> "Desktop Site" </strong>
        option.
      </label>
      <label className={classNames(styles.subTitle, "mt-3")}>
        Stay tuned for our upcoming app for even more convenient reading.
      </label>

      {/* <div
        className={classNames(
          "d-flex align-items-center gap-1 w-100 mt-3 flex-wrap justify-content-center"
        )}
      >
        <Image alt="" src={AppleStore} height={39.6} width={135.3} />
        <Image alt="" src={GooglePay} height={39.6} width={135.3} />
      </div> */}
    </div>
  );
};

export default MobileView;
