import classNames from "classnames";
import { useEffect } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { defaultAvatar } from "assets";

interface NotificationDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
}

const NotificationDropDown = ({
  openSelection,
  setOpenSelection,
}: NotificationDropDownProps) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("NotificationDropDown");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection(false);
      }
    }
  }

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );
    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      id="NotificationDropDown"
      style={openSelection ? { display: "flex" } : { display: "none" }}
      className={classNames(styles.optionsContainer, "flex-column")}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start px-3 py-3 gap-2"
        )}
      >
        <label className={classNames(styles.title)}>Notifications</label>
        <div className={classNames(styles.countContaier)}>
          <label className={classNames(styles.countLabel)}>3</label>
        </div>
      </div>
      <div className={classNames(styles.seperator)} />
      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-center"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-start justify-content-center gap-2 p-3"
          )}
        >
          <Image
            src={defaultAvatar}
            alt="profile-pic"
            className={classNames(styles.avatar)}
          />
          <div className={classNames("d-flex flex-column align-items-start")}>
            <label className={classNames(styles.name)}>Hasan Abdullah</label>
            <label className={classNames(styles.content)}>
              Just added a new book.
            </label>
            <label className={classNames(styles.time)}>2 hrs ago</label>
          </div>
        </div>
        <div className={classNames(styles.seperator)} />
        <div
          className={classNames(
            "d-flex align-items-start justify-content-center gap-2 p-3"
          )}
        >
          <Image
            src={defaultAvatar}
            alt="profile-pic"
            className={classNames(styles.avatar)}
          />
          <div className={classNames("d-flex flex-column align-items-start")}>
            <label className={classNames(styles.name)}>Hasan Abdullah</label>
            <label className={classNames(styles.content)}>
              Just added a new book.
            </label>
            <label className={classNames(styles.time)}>2 hrs ago</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropDown;
