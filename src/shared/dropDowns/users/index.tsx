import classNames from "classnames";
import { memo, useEffect, useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { defaultAvatar } from "assets";
import { useSelector } from "react-redux";

interface UsersDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  onClick?: (val: string) => void;
  kids: any[];
}

const UsersDropDown = ({
  openSelection,
  setOpenSelection,
  onClick,
  kids,
}: UsersDropDownProps) => {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const [options, setOptions] = useState<any>([]);
  function handleClick(e: any) {
    const elem: any = document.getElementById("usersDropDownContainer");
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

  useEffect(() => {
    if (kids) {
      let tempOpt = [...kids];
      let obj = {
        id: user?.id,
        reader: {
          full_name: user?.parent?.full_name,
          profile_picture: user?.parent?.profile_picture,
        },
      };
      tempOpt.push(obj);
      setOptions(tempOpt);
    }
  }, []);

  return (
    <div
      className={classNames(styles.optionsContainer)}
      id="usersDropDownContainer"
      style={openSelection ? { display: "flex" } : { display: "none" }}
    >
      {options?.map((item: any, inx: number) => {
        return (
          <div
            className={classNames(
              "d-flex align-items-center gap-2 py-3 px-3",
              styles.optionContainer,
              inx === options?.length - 1 && styles.btmradius,
              inx === 0 && styles.topradius
            )}
            style={inx === options?.length - 1 ? { borderBottom: "0px" } : {}}
            onClick={() => {
              onClick?.(item);
              setOpenSelection?.(false);
            }}
            key={inx}
            role="button"
          >
            <img
              src={
                item?.reader?.profile_picture
                  ? item?.reader?.profile_picture
                  : defaultAvatar.src
              }
              alt="kid-avatar"
              className={classNames(styles.avtStyle)}
              height={32}
              width={32}
            />
            <label className={classNames(styles.labelStyle)} role="button">
              {item?.reader?.full_name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default memo(UsersDropDown);
