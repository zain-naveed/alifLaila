import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import BookCard from "shared/components/parent/bookCard";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { allBookForKid } from "shared/services/kid/bookService";
import styles from "./style.module.scss";
import BookLoader from "shared/loader/pageLoader/kid/books";

interface AgeRangeBooksProps {
  response: any;
  id: string;
  ageId: string;
  index: any;
}

const AgeRangeBooks = ({ response, id, ageId, index }: AgeRangeBooksProps) => {
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);

  const data = response?.data[ageId];
  const router = useRouter();
  const currentPageRef = useRef<number>(1);
  const totalPageRef = useRef<number>(1);
  const booksRef = useRef<any[]>([]);
  const [books, setBooks] = useState<any>([]);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  const scrollRight = () => {
    let listElem: any = document.getElementById(id);
    listElem.scrollLeft = listElem.scrollLeft + listElem.clientWidth;
  };
  const scrollLeft = () => {
    let listElem: any = document.getElementById(id);
    listElem.scrollLeft = listElem.scrollLeft - listElem.clientWidth;
    if (books?.length > 5) {
      setScrollEnd(false);
    }
  };

  const handleGetBooks = () => {
    let formBody: any = new FormData();

    formBody.append("age_range_id", ageId);
    formBody.append("per_page", "10");

    allBookForKid(formBody, currentPageRef.current)
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
            let cloneArr = [...booksRef.current];
            cloneArr = [...cloneArr, ...data];
            setBooks(cloneArr);
            booksRef.current = cloneArr;
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setMoreLoader(false);
        setInitialLoading(false);
      });
  };

  const resetScroll = () => {
    let elem: any = document.getElementById(id);
    let width: any = document.getElementById(id)?.clientWidth;
    elem.scrollLeft = elem.scrollLeft - width;
  };

  const handleBookClick = (book_id: any) => {
    router.push(parentPanelConstant.preview.path.replace(":id", book_id));
  };

  const handleScrollEvent = () => {
    let elem: any = document.getElementById(id);
    if (elem.scrollLeft !== 0) {
      setIsScrollLeft(true);
    } else {
      setIsScrollLeft(false);
    }
  };

  const handleScrollEndEvent = () => {
    let listElem: any = document.getElementById(id);
    if (listElem.scrollLeft !== 0) {
      if (moreLoad) {
        setScrollEnd(false);
        currentPageRef.current = currentPageRef.current + 1;
        setMoreLoader(true);
        handleGetBooks();
      } else {
        setScrollEnd(true);
      }
    }
  };

  useEffect(() => {
    let elem: any = document.getElementById(id);
    elem?.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, [books, initialLoading]);

  useEffect(() => {
    currentPageRef.current = 1;
    setInitialLoading(true);
    handleGetBooks();
  }, []);

  useEffect(() => {
    if (booksRef.current?.length > 0) {
      let listElem: any = document.getElementById(id);
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [books, initialLoading]);

  useEffect(() => {
    resetScroll();
  }, [isShown]);

  return initialLoading ? (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-3"
        )}
      >
        <label className={classNames(styles.title)}>
          Books for{" "}
          {data?.map((itm: any, inx: number) => {
            return (
              <span key={inx}>
                {data?.length > 1 && inx !== 0
                  ? inx === data?.length - 1
                    ? " & "
                    : " , "
                  : null}
                {itm?.first_name}
              </span>
            );
          })}
        </label>
      </div>
      <div className={classNames("position-relative")}>
        <div
          className={classNames(
            "w-100 d-flex align-items-start justify-content-start mt-4",
            styles.progressBookList
          )}
          id={id}
        >
          <BookLoader
            Iteration={5}
            customContainer={classNames("mt-4 mt-lg-5")}
            isQuartor={isShown}
            isParentModule={true}
          />
        </div>
      </div>
      {index !== Object.keys(response?.data)?.length - 1 ? (
        <div className={classNames(styles.seperator)} />
      ) : null}
    </>
  ) : !initialLoading && books?.length > 0 ? (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-3"
        )}
      >
        <label className={classNames(styles.title)}>
          Books for{" "}
          {data?.map((itm: any, inx: number) => {
            return (
              <span key={inx}>
                {data?.length > 1 && inx !== 0
                  ? inx === data?.length - 1
                    ? " & "
                    : " , "
                  : null}
                {itm?.first_name}
              </span>
            );
          })}
        </label>
      </div>
      <div
        className={classNames("position-relative")}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {isHovering &&
        !initialLoading &&
        (isShown ? books?.length > 4 : books?.length > 5) ? (
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
            "w-100 d-flex align-items-start justify-content-start mt-4",
            styles.progressBookList
          )}
          id={id}
        >
          {books?.map((itm: any, inx: any) => {
            return (
              <BookCard
                item={itm}
                key={inx}
                index={inx}
                parentElementId={id}
                isQuator={isShown}
                onClick={() => handleBookClick(itm?.id)}
              />
            );
          })}
        </div>
        {isHovering &&
        !initialLoading &&
        (isShown ? books?.length > 4 : books?.length > 5) ? (
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
      {index !== Object.keys(response?.data)?.length - 1 ? (
        <div className={classNames(styles.seperator)} />
      ) : null}
    </>
  ) : null;
};

export default AgeRangeBooks;
