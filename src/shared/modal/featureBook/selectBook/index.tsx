import React, { useEffect, useRef, useState } from "react";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import classNames from "classnames";
import CustomInput from "shared/components/common/customInput";
import { DefaultBookImg, SearchIcon, TickIcon } from "assets";
import Image from "next/image";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import {
  getPublishedBooks,
  getRecentCovers,
} from "shared/services/publisher/featureService";
import useDebounce from "shared/customHook/useDebounce";
import { useOnScroll } from "shared/customHook/useOnScroll";
import moment from "moment";
import BoxLoader from "shared/loader/box";
import NoContentCard from "shared/components/common/noContentCard";

interface Props {
  handleClose: () => void;
  selected: any;
  setSelected: (val: any) => void;
  setStep: (val: number) => void;
  setRecentCovers: (val: any) => void;
}

const SelectBook = ({
  handleClose,
  selected,
  setSelected,
  setStep,
  setRecentCovers,
}: Props) => {
  const [endReach, onScroll] = useOnScroll("published-book-list");

  const pageRef = useRef<number>(1);
  const booksRef = useRef<any[]>([]);

  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);
  const [continueLoading, setContinueLoading] = useState<boolean>(false);
  const [recentLoading, setRecentLoading] = useState<boolean>(false);

  const handleGetPublishedBooks = () => {
    getPublishedBooks(pageRef.current, searchVal)
      .then(
        ({
          data: {
            data: { data, current_page, last_page },
            status,
          },
        }) => {
          if (status) {
            let temp = [...booksRef.current, ...data];
            setBooks(temp);
            booksRef.current = temp;
            if (current_page === last_page) {
              setMoreLoad(false);
            } else {
              setMoreLoad(true);
            }
          } else {
            setBooks([]);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
        setContinueLoading(false);
      });
  };

  const handleGetRecentCovers = () => {
    setRecentLoading(true);
    getRecentCovers(selected?.id)
      .then(({ data: { data, status } }) => {
        if (status) {
          setRecentCovers(data);
          setStep(2);
        } else {
          toastMessage("error", "Something went wrong! Please try again later");
        }
      })
      .catch(() => {
        toastMessage("error", "Something went wrong! Please try again later");
      })
      .finally(() => {
        setRecentLoading(false);
      });
  };

  useEffect(() => {
    if (endReach && !loading && moreLoad) {
      setContinueLoading(true);
      pageRef.current++;
      handleGetPublishedBooks();
    }
  }, [endReach]);

  useEffect(() => {
    setLoading(true);
    pageRef.current = 1;
    booksRef.current = [];
    setBooks([]);
    setSelected(null);
    handleGetPublishedBooks();
  }, [searchVal]);

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );
  return (
    <>
      <ModalHeader
        close={() => {
          handleClose();
        }}
        isFirst={true}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-5 pb-4 pt-3"
        )}
      >
        <label className={classNames(styles.title, "mb-4")}>
          Select any book
        </label>

        <CustomInput
          value={search}
          Icon={SearchIcon}
          placeholder="Search book by name"
          customInputContainer={classNames(styles.inputContainer)}
          customInputStyle={classNames(styles.inputStyle)}
          onChange={(e) => {
            setSearch(e.currentTarget.value);
          }}
        />

        <div
          className={classNames(
            "d-flex flex-column align-items-start gap-1 w-100"
          )}
        >
          <label className={classNames(styles.heading)}>
            Select book You want to Feature
          </label>
          <label className={classNames(styles.desc)}>
            Your all published books list show Below
          </label>
        </div>

        <div
          className={classNames(
            styles.booksContainer,
            "w-100 gap-3 d-flex flex-column mt-3"
          )}
          id="published-book-list"
          onScroll={onScroll}
        >
          {loading ? (
            <>
              {Array.from(Array(4).keys()).map((itm, inx) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-center w-100 p-2 gap-3 position-relative",
                      styles.border
                    )}
                    key={inx}
                  >
                    <BoxLoader iconStyle={classNames(styles.bookCover)} />

                    <div
                      className={classNames(
                        "d-flex flex-column align-items-start gap-1"
                      )}
                    >
                      <BoxLoader iconStyle={classNames(styles.headingLoader)} />
                      <BoxLoader iconStyle={classNames(styles.descLoader)} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>
              {books?.map((itm, inx) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-center w-100 p-2 gap-3 position-relative",
                      styles.border,
                      selected?.id === itm?.id && styles.active
                    )}
                    key={inx}
                    role="button"
                    onClick={() => {
                      setSelected(itm);
                    }}
                  >
                    <object
                      data={itm?.thumbnail}
                      type="image/png"
                      className={classNames(styles.bookCover, "pointer")}
                    >
                      <Image
                        src={DefaultBookImg}
                        alt="book-cover"
                        height={100}
                        width={94}
                        className={classNames(styles.bookCover)}
                      />
                    </object>

                    <div
                      className={classNames(
                        "d-flex flex-column align-items-start gap-1"
                      )}
                    >
                      <label
                        className={classNames(styles.heading)}
                        role="button"
                      >
                        {itm?.title}
                      </label>
                      <label className={classNames(styles.desc)} role="button">
                        Uploaded On{" "}
                        {moment(itm?.created_at).format("DD MMM, YYYY")}
                      </label>
                    </div>
                    {selected?.id === itm?.id ? (
                      <div className={classNames(styles.tickContainer)}>
                        <TickIcon />
                      </div>
                    ) : null}
                  </div>
                );
              })}
              {books?.length < 1 ? (
                <NoContentCard
                  label1="No Books Found"
                  label2="There is no published book"
                  customContainer={"gap-0 my-4"}
                  customIconContianer={classNames(styles.noFoundIconStyle)}
                  customLabel1Style={classNames(styles.noFoundLabel1)}
                  customLabel2Style={classNames(styles.noFoundLabel2)}
                />
              ) : null}
              {continueLoading ? (
                <div
                  className={classNames(
                    "d-flex align-items-center w-100 p-2 gap-3 position-relative",
                    styles.border
                  )}
                >
                  <BoxLoader iconStyle={classNames(styles.bookCover)} />

                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start gap-1"
                    )}
                  >
                    <BoxLoader iconStyle={classNames(styles.headingLoader)} />
                    <BoxLoader iconStyle={classNames(styles.descLoader)} />
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
        {books?.length > 0 ? (
          <CustomButton
            title="Next"
            containerStyle={classNames(styles.nextBtn, "mt-3")}
            onClick={() => {
              if (selected !== null) {
                handleGetRecentCovers();
              } else {
                toastMessage("error", "Please select a book");
              }
            }}
            disabled={recentLoading}
            loading={recentLoading}
          />
        ) : null}
      </div>
    </>
  );
};

export default SelectBook;
