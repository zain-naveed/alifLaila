import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import ProgressBookCard from "shared/components/parent/progressBookCard";
import {
  getNewArrivalBooksList,
  getProgress,
} from "shared/services/kid/bookService";
import styles from "./style.module.scss";
import BookCard from "shared/components/parent/bookCard";
import { useSelector } from "react-redux";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { useRouter } from "next/router";

interface BookListProps {
  response: any;
  isProgress?: boolean;
  id: string;
}

const BookList = ({ response, isProgress, id }: BookListProps) => {
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
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

  const handleGetProgress = () => {
    getProgress({
      page: currentPageRef.current,
      search: "",
      sort_by: "incomplete",
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
      });
  };

  const handleGetNewArrivals = () => {
    getNewArrivalBooksList({ page: currentPageRef.current })
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
      });
  };

  const initialSetup = () => {
    const {
      data: { data, current_page, last_page },
    } = response;
    if (current_page === last_page) {
      setMoreLoad(false);
      if (data?.length > 5) {
        setScrollEnd(false);
      }
    } else {
      setScrollEnd(false);
      setMoreLoad(true);
    }
    setBooks(data);
    booksRef.current = data;
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
        if (isProgress) {
          handleGetProgress();
        } else {
          handleGetNewArrivals();
        }
      } else {
        setScrollEnd(true);
      }
    }
  };

  useEffect(() => {
    let elem: any = document.getElementById(id);
    elem.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    initialSetup();
  }, []);

  useEffect(() => {
    if (booksRef.current?.length > 0) {
      let listElem: any = document.getElementById(id);
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [books]);

  useEffect(() => {
    resetScroll();
  }, [isShown]);

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between px-3"
        )}
      >
        <label className={classNames(styles.title)}>
          {isProgress ? (
            <>
              <span>Continue</span> Reading
            </>
          ) : (
            <>
              <span>New</span> Arrival
            </>
          )}
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
        {isHovering && (isShown ? books?.length > 4 : books?.length > 5) ? (
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
            return isProgress ? (
              <ProgressBookCard
                item={itm?.book}
                key={inx}
                index={inx}
                pageNo={itm?.page_no}
                parentId={id}
                isQuator={isShown}
              />
            ) : (
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
        {isHovering && (isShown ? books?.length > 4 : books?.length > 5) ? (
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
    </>
  );
};

export default BookList;
