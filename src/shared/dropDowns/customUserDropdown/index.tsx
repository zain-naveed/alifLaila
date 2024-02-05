import { ChevDownIcon, CrossIcon, defaultAvatar } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { getAuthorsList } from "shared/services/publisher/authorsService";
import useDebounce from "shared/customHook/useDebounce";
import { useOnScroll } from "shared/customHook/useOnScroll";
import BoxLoader from "shared/loader/box";
import NoContentCard from "shared/components/common/noContentCard";

interface InputProps {
  label?: string;
  required?: boolean;
  error?: any;
  value: any;
  onChangeHandle: (val: string | any) => void;
  placeholder?: string;
  disabled?: boolean;
  handleReset: () => void;
}

const CustomUserDropDown = ({
  label,
  required,
  error,
  value,
  onChangeHandle,
  placeholder,
  disabled,
  handleReset,
}: InputProps) => {
  const [endReach, onScroll] = useOnScroll("customerUserDropDown");
  const pageRef = useRef<number>(1);
  const authorsListRef = useRef<any[]>([]);

  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [authorsList, setAuthorsList] = useState<Array<any>>([]);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);
  const [continueLoading, setContinueLoading] = useState<boolean>(false);

  function handleClick(e: any) {
    const elem: any = document.getElementById("customerUserDropDown");
    if (!elem?.contains(e.target)) {
      setOpenSelection(false);
    }
  }

  useEffect(() => {
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

  const handleGetAuthorsList = () => {
    getAuthorsList({
      page: pageRef.current,
      search: searchVal,
      filter: "&is_blocked=0",
    })
      .then(
        ({
          data: {
            data: { data, current_page, last_page },
            message,
            status,
          },
        }) => {
          if (status) {
            let temp = [...authorsListRef.current, ...data];
            setAuthorsList(temp);
            authorsListRef.current = temp;
            if (current_page === last_page) {
              setMoreLoad(false);
            } else {
              setMoreLoad(true);
            }
          } else {
            setAuthorsList([]);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setContinueLoading(false);
      });
  };

  useEffect(() => {
    if (endReach && !loading && moreLoad && !continueLoading) {
      pageRef.current++;
      setContinueLoading(true);
      handleGetAuthorsList();
    }
  }, [endReach]);

  useEffect(() => {
    pageRef.current = 1;
    authorsListRef.current = [];
    setLoading(true);
    handleGetAuthorsList();
  }, [searchVal]);

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  return (
    <div
      className={classNames("position-relative", error ? "mb-0" : "mb-3")}
      role={"button"}
    >
      <div className="d-flex flex-column">
        {label && (
          <label className={styles.inputLabel}>
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
        )}
        <div
          className={styles.inputContainer}
          onClick={() => {
            if (!disabled) {
              setOpenSelection(!openSelection);
              setTimeout(() => {
                document.body.addEventListener(
                  "click",
                  (event: any) => {
                    handleClick(event);
                  },
                  true
                );
              }, 200);
            }
          }}
        >
          {value === "" ? (
            <>
              <input
                type="text"
                placeholder={placeholder}
                onClick={(e) => {}}
                className={classNames(styles.inputStyle)}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <ChevDownIcon className={styles.arrow} />
            </>
          ) : (
            <>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={classNames("d-flex align-items-center gap-2")}
              >
                <img
                  alt=""
                  src={
                    value?.author?.profile_picture
                      ? value?.author?.profile_picture
                      : defaultAvatar.src
                  }
                  className={classNames(styles.avt)}
                  height={36}
                  width={36}
                />
                <label className={classNames(styles.userName)}>
                  {value?.author?.full_name}
                </label>
              </div>
              <CrossIcon
                className={styles.crossIcon}
                onClick={(e: any) => {
                  e.stopPropagation();
                  setSearch("");
                  handleReset();
                }}
              />
            </>
          )}
        </div>
      </div>
      <div
        className={classNames(styles.optionsContainer)}
        style={openSelection ? { display: "flex" } : { display: "none" }}
        id="customerUserDropDown"
        onScroll={onScroll}
      >
        {loading ? (
          <>
            {Array.from(Array(4).keys()).map((itm, inx) => {
              return (
                <div
                  className={classNames(
                    "d-flex align-items-center p-2 gap-2",
                    styles.userContainer
                  )}
                  style={inx === 3 ? { borderBottom: "0px" } : {}}
                >
                  <BoxLoader iconStyle={classNames(styles.avt)} />
                  <BoxLoader iconStyle={classNames(styles.userNameLoader)} />
                </div>
              );
            })}
          </>
        ) : (
          <>
            {authorsList?.map((itm, inx) => {
              return (
                <div
                  onClick={() => {
                    onChangeHandle?.(itm);
                    document.body.removeEventListener(
                      "click",
                      (event: any) => {
                        handleClick(event);
                      },
                      true
                    );
                    setOpenSelection(false);
                  }}
                  className={classNames(
                    "d-flex align-items-center p-2 gap-2",
                    styles.userContainer
                  )}
                  style={
                    inx === authorsList?.length - 1
                      ? { borderBottom: "0px" }
                      : {}
                  }
                >
                  <img
                    alt=""
                    src={
                      itm?.author?.profile_picture
                        ? itm?.author?.profile_picture
                        : defaultAvatar.src
                    }
                    className={classNames(styles.avt)}
                    height={36}
                    width={36}
                  />
                  <label className={classNames(styles.userName)}>
                    {itm?.author?.full_name}
                  </label>
                </div>
              );
            })}
            {authorsList?.length < 1 ? (
              <div className={classNames("w-100")}>
                <NoContentCard
                  label1="No Partners Found"
                  customContainer={"gap-0 my-4"}
                  customIconContianer={classNames(styles.noFoundIconStyle)}
                  customLabel1Style={classNames(styles.noFoundLabel1)}
                  customLabel2Style={classNames(styles.noFoundLabel2)}
                />
              </div>
            ) : null}
            {continueLoading ? (
              <div
                className={classNames(
                  "d-flex align-items-center p-2 gap-2",
                  styles.userContainer
                )}
              >
                <BoxLoader iconStyle={classNames(styles.avt)} />
                <BoxLoader iconStyle={classNames(styles.userNameLoader)} />
              </div>
            ) : null}
          </>
        )}
      </div>
      {!!error && <div className="error">{error}</div>}
    </div>
  );
};

export default CustomUserDropDown;
