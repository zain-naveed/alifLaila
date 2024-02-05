import classNames from "classnames";
import { useEffect } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { NewIcon, defaultAvatar } from "assets";
import moment from "moment";
import { roles } from "shared/utils/enum";

interface ProgressAssigneeDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  options: any;
  isLast: boolean;
  isFirst: boolean;
  showNewTag?: boolean;
}

const ProgressAssigneeDropDown = ({
  openSelection,
  setOpenSelection,
  options,
  isLast,
  isFirst,
  showNewTag,
}: Partial<ProgressAssigneeDropDownProps>) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("ProgressAssigneeDropDown");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection?.(false);
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
      className={classNames(
        isFirst ? styles.cont3 : isLast ? styles.cont2 : styles.cont1
      )}
      id="ProgressAssigneeDropDown"
      style={openSelection ? { display: "flex" } : { display: "none" }}
    >
      {options?.map((item: any, inx: number) => {
        return (
          <div
            className={classNames(
              "d-flex align-items-center gap-2 py-2 px-2",
              styles.optionContainer,
              inx === options?.length - 1 && styles.btmradius,
              inx === 0 && styles.topradius
            )}
            style={inx === options?.length - 1 ? { borderBottom: "0px" } : {}}
            key={inx}
            role="button"
          >
            <img
              src={
                item?.profile_picture
                  ? item?.profile_picture
                  : defaultAvatar.src
              }
              alt="drop-assignee-pic"
              height={40}
              width={40}
              className={classNames(styles.imgStyle)}
            />
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-0"
              )}
            >
              <div className={classNames("d-flex align-items-center gap-2")}>
                <label className={classNames(styles.labelStyle)} role="button">
                  {item?.role === roles.teacher
                    ? "Teacher"
                    : item?.role === roles.school
                    ? "School"
                    : item?.role === roles.parent
                    ? "Parent"
                    : "Self Assign"}
                </label>
                {item?.is_new && showNewTag ? <NewIcon /> : null}
              </div>
              <label className={classNames(styles.time)}>
                <span>Start:</span>{" "}
                {moment(
                  item?.assigned_at ? item?.assigned_at : new Date()
                ).format("DD-MM-YYYY")}
              </label>
              {item?.due_at ? (
                <label className={classNames(styles.time)}>
                  <span>Due:</span> {moment(item?.due_at).format("DD-MM-YYYY")}
                </label>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressAssigneeDropDown;
