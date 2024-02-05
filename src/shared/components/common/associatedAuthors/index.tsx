import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import { ArrowRight, BackArrow2Icon, defaultAvatar } from "assets";
import { Spinner } from "react-bootstrap";
import { getAssociatedAuthorsList } from "shared/services/kid/publisherService";
import { useRouter } from "next/router";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";

interface AssociatedProps {
  authors: any;
}

const AssociatedAuthors = ({ authors }: AssociatedProps) => {
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const currentPageRef = useRef<number>(1);
  const totalPageRef = useRef<number>(1);
  const authorsListRef = useRef<any[]>([]);
  const [auhtorsList, setAuhtorsList] = useState<any>([]);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);

  const scrollRight = () => {
    let listElem: any = document.getElementById(
      "publisher-associated-partners-list"
    );
    listElem.scrollLeft = listElem.scrollLeft + listElem.clientWidth;
  };
  const scrollLeft = () => {
    let listElem: any = document.getElementById(
      "publisher-associated-partners-list"
    );
    listElem.scrollLeft = listElem.scrollLeft - listElem.clientWidth;
    if (auhtorsList?.length > 5) {
      setScrollEnd(false);
    }
  };

  const handleGetProgress = () => {
    getAssociatedAuthorsList(currentPageRef.current, router?.query?.id)
      .then(
        ({
          data: {
            data: { data, current_page, last_page },
            message,
            status,
          },
        }) => {
          if (status) {
            totalPageRef.current = last_page;
            if (current_page === last_page) {
              setMoreLoad(false);
            } else {
              setScrollEnd(false);
              setMoreLoad(true);
            }
            let cloneArr = [...authorsListRef.current];
            cloneArr = [...cloneArr, ...data];
            setAuhtorsList(cloneArr);
            authorsListRef.current = cloneArr;
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setMoreLoader(false);
      });
  };

  const initialSetup = () => {
    const {
      data: { data, current_page, last_page },
    } = authors;
    if (current_page === last_page) {
      setMoreLoad(false);
      if (data?.length > 5) {
        setScrollEnd(false);
      }
    } else {
      setScrollEnd(false);
      setMoreLoad(true);
    }
    setAuhtorsList(data);
    authorsListRef.current = data;
  };

  const handleScrollEvent = () => {
    let elem: any = document.getElementById(
      "publisher-associated-partners-list"
    );
    if (elem.scrollLeft !== 0) {
      setIsScrollLeft(true);
    } else {
      setIsScrollLeft(false);
    }
  };

  const handleScrollEndEvent = () => {
    let listElem: any = document.getElementById(
      "publisher-associated-partners-list"
    );
    if (listElem.scrollLeft !== 0) {
      if (moreLoad) {
        setScrollEnd(false);
        currentPageRef.current = currentPageRef.current + 1;
        setMoreLoader(true);
        handleGetProgress();
      } else {
        setScrollEnd(true);
      }
    }
  };

  useEffect(() => {
    let elem: any = document.getElementById(
      "publisher-associated-partners-list"
    );
    elem?.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (authorsListRef.current?.length > 0) {
      let listElem: any = document.getElementById(
        "publisher-associated-partners-list"
      );
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [auhtorsList]);

  useEffect(() => {
    initialSetup();
  }, []);
  return (
    <div
      className={classNames(
        styles.customContainer,
        "px-3 px-sm-0 w-100 pt-3 pb-5"
      )}
    >
      <div
        className={classNames("position-relative")}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {isHovering && auhtorsList?.length > 5 ? (
          <div
            className={classNames(
              styles.leftArrowContainer,
              isScrollLeft && styles.active
            )}
            onClick={scrollLeft}
          >
            <BackArrow2Icon className={classNames(styles.arrowIcon)} />
          </div>
        ) : null}
        <div
          className={classNames(
            "w-100 d-flex align-items-start justify-content-start mt-2",
            styles.progressBookList
          )}
          id="publisher-associated-partners-list"
        >
          {auhtorsList?.map((itm: any, inx: number) => {
            return (
              <div
                className={classNames(styles.userCard)}
                key={inx}
                onClick={() => {
                  if (role === roles.parent) {
                    router.push(
                      parentPanelConstant.author.path.replace(":id", itm?.id)
                    );
                  } else {
                    router.push(
                      kidPanelConstant.author.path.replace(":id", itm?.id)
                    );
                  }
                }}
              >
                <div>
                  <img
                    src={
                      itm?.profile_picture
                        ? itm?.profile_picture
                        : defaultAvatar.src
                    }
                    alt=""
                  />
                  <label>{itm?.full_name}</label>
                  <span>
                    {itm?.books_count} Book
                    {itm?.books_count === 0 || itm?.books_count > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {isHovering && auhtorsList?.length > 5 ? (
          <div
            className={classNames(
              styles.rightArrowContainer,
              !scrollEnd && styles.active
            )}
            onClick={scrollRight}
          >
            {moreLoader ? (
              <Spinner size="sm" color="white" animation="border" />
            ) : (
              <ArrowRight className={classNames(styles.arrowIcon)} />
            )}
          </div>
        ) : null}
      </div>
      <div className={classNames(styles.seperator, "mt-4 mt-md-5")} />
    </div>
  );
};

export default AssociatedAuthors;
