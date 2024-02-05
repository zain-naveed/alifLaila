import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import ProgressBookCard from "shared/components/kid/progressBookCard";
import { getProgress } from "shared/services/kid/bookService";
import styles from "./style.module.scss";

interface ProgressBookListProps {
  progress: any;
}

const ProgressBookList = ({ progress }: ProgressBookListProps) => {
  const currentPageRef = useRef<number>(1);
  const totalPageRef = useRef<number>(1);
  const progressBooksRef = useRef<any[]>([]);
  const [progressBooks, setProgressBooks] = useState<any>([]);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);

  const scrollRight = () => {
    let listElem: any = document.getElementById("landing-progress-book-list");
    listElem.scrollLeft = listElem.scrollLeft + listElem.clientWidth;
  };
  const scrollLeft = () => {
    let listElem: any = document.getElementById("landing-progress-book-list");
    listElem.scrollLeft = listElem.scrollLeft - listElem.clientWidth;
    if (progressBooks?.length > 5) {
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
            let cloneArr = [...progressBooksRef.current];
            cloneArr = [...cloneArr, ...data];
            setProgressBooks(cloneArr);
            progressBooksRef.current = cloneArr;
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
    } = progress;
    if (current_page === last_page) {
      setMoreLoad(false);
      if (data?.length > 5) {
        setScrollEnd(false);
      }
    } else {
      setScrollEnd(false);
      setMoreLoad(true);
    }
    setProgressBooks(data);
    progressBooksRef.current = data;
  };

  const handleScrollEvent = () => {
    let elem: any = document.getElementById("landing-progress-book-list");
    if (elem.scrollLeft !== 0) {
      setIsScrollLeft(true);
    } else {
      setIsScrollLeft(false);
    }
  };

  const handleScrollEndEvent = () => {
    let listElem: any = document.getElementById("landing-progress-book-list");
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
    let elem: any = document.getElementById("landing-progress-book-list");
    elem?.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (progressBooksRef.current?.length > 0) {
      let listElem: any = document.getElementById("landing-progress-book-list");
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [progressBooks]);

  useEffect(() => {
    initialSetup();
  }, []);

  return (
    <div className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mt-4"
        )}
      >
        <label className={classNames(styles.title)}>
          <span>continue</span> Reading
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
        {isHovering && progressBooks?.length > 5 ? (
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
          id="landing-progress-book-list"
        >
          {progressBooks?.map((itm: any, inx: any) => {
            return (
              <ProgressBookCard
                item={itm?.book}
                key={inx}
                index={inx}
                pageNo={itm?.page_no}
                parentId={"landing-progress-book-list"}
              />
            );
          })}
        </div>
        {isHovering && progressBooks?.length > 5 ? (
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
    </div>
  );
};

export default ProgressBookList;
