import { defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  parentReaderProfileDropDownOptions,
  readerProfileDropDownOptions,
} from "shared/utils/constants";
import { kidAccountRole } from "shared/utils/enum";
import styles from "./style.module.scss";

interface ProfileDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  handleConfirmation: () => void;
}

const ProfileDropDown = ({
  openSelection,
  setOpenSelection,
  handleConfirmation,
}: ProfileDropDownProps) => {
  const router = useRouter();

  const {
    login: { user, kidRole },
  } = useSelector((state: any) => state.root);

  function handleClick(e: any) {
    const elem: any = document.getElementById("profileDropDownContainer");
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
      id="profileDropDownContainer"
      style={openSelection ? { display: "flex" } : { display: "none" }}
      className={classNames(styles.optionsContainer, "flex-column pt-3")}
    >
      <div
        className={classNames("d-flex align-items-center px-3")}
        style={{ maxWidth: "250px" }}
      >
        <img
          src={
            user?.reader?.profile_picture
              ? user?.reader?.profile_picture
              : defaultAvatar.src
          }
          className={classNames(styles.avatar)}
          alt="profile-pic"
          height={40}
          width={40}
        />
        <div
          className={classNames("d-flex flex-column ms-3 align-items-start")}
          style={{ maxWidth: "250px", overflow: "hidden" }}
        >
          <label className={classNames(styles.nameLabel)}>
            {user?.reader?.first_name} {user?.reader?.last_name}
          </label>
          <label className={classNames(styles.emailLabel)}>
            {user?.email ? user?.email : user?.username}
          </label>
        </div>
      </div>
      <div className={classNames(styles.seperator, "mt-3")} />
      <div className={classNames("d-flex flex-column w-100")}>
        {kidRole === kidAccountRole.individual ? (
          <>
            {readerProfileDropDownOptions.map((item, key) => {
              return (
                <div
                  className={classNames(
                    "d-flex justify-content-start align-items-center px-3 py-3",
                    styles.optionContainer,
                    key === readerProfileDropDownOptions?.length - 1 &&
                      styles.btmradius
                  )}
                  key={key}
                  role="button"
                  onClick={() => {
                    document.body.removeEventListener(
                      "click",
                      (event: any) => {
                        handleClick(event);
                      },
                      true
                    );
                    if (item?.title === "Log out") {
                      handleConfirmation();
                    } else if (item?.title === "Badges") {
                      setOpenSelection(false);
                      router.push(item?.route);
                    } else {
                      setOpenSelection(false);
                      router.push({
                        pathname: item?.route,
                        query: { keyword: item?.value },
                      });
                    }
                  }}
                >
                  <item.Icon className={classNames(styles.optionIcon)} />
                  <label
                    className={classNames(styles.optionlabel, "ms-2")}
                    role="button"
                  >
                    {item?.title}
                  </label>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {parentReaderProfileDropDownOptions.map((item, key) => {
              return (
                <div
                  className={classNames(
                    "d-flex justify-content-start align-items-center px-3 py-3",
                    styles.optionContainer,
                    key === readerProfileDropDownOptions?.length - 1 &&
                      styles.btmradius
                  )}
                  key={key}
                  role="button"
                  onClick={() => {
                    document.body.removeEventListener(
                      "click",
                      (event: any) => {
                        handleClick(event);
                      },
                      true
                    );
                    if (item?.title === "Log out") {
                      handleConfirmation();
                    } else if (item?.title === "Badges") {
                      setOpenSelection(false);
                      router.push(item?.route);
                    } else {
                      setOpenSelection(false);
                      router.push({
                        pathname: item?.route,
                        query: { keyword: item?.value },
                      });
                    }
                  }}
                >
                  <item.Icon className={classNames(styles.optionIcon)} />
                  <label
                    className={classNames(styles.optionlabel, "ms-2")}
                    role="button"
                  >
                    {item?.title}
                  </label>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDropDown;
