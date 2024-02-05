import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import BookCard from "shared/components/common/bookCard";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { getNewArrivalBooksList } from "shared/services/kid/bookService";
import styles from "./style.module.scss";

interface NewArrivalListProps {
  newArrival: any;
}

const NewArrivalList = ({ newArrival }: NewArrivalListProps) => {
  const router = useRouter();
  const currentPageRef = useRef<number>(1);
  const newArrivalBooksRef = useRef<any[]>([]);
  const [newArrivalBooks, setNewArrivalBooks] = useState<any>([]);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);

  const scrollRight = () => {
    let listElem: any = document.getElementById(
      "landing-new-Arrival-book-list"
    );
    listElem.scrollLeft = listElem.scrollLeft + listElem.clientWidth;
  };
  const scrollLeft = () => {
    let listElem: any = document.getElementById(
      "landing-new-Arrival-book-list"
    );
    listElem.scrollLeft = listElem.scrollLeft - listElem.clientWidth;
    if (newArrivalBooks?.length > 5) {
      setScrollEnd(false);
    }
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
            if (current_page === last_page) {
              setMoreLoad(false);
            } else {
              setScrollEnd(false);
              setMoreLoad(true);
            }
            let cloneArr = [...newArrivalBooksRef.current];
            cloneArr = [...cloneArr, ...data];
            setNewArrivalBooks(cloneArr);
            newArrivalBooksRef.current = cloneArr;
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
    } = newArrival;
    if (current_page === last_page) {
      setMoreLoad(false);
      if (data?.length > 5) {
        setScrollEnd(false);
      }
    } else {
      setScrollEnd(false);
      setMoreLoad(true);
    }
    setNewArrivalBooks(data);
    newArrivalBooksRef.current = data;
  };

  const handleScrollEvent = () => {
    let elem: any = document.getElementById("landing-new-Arrival-book-list");
    if (elem.scrollLeft !== 0) {
      setIsScrollLeft(true);
    } else {
      setIsScrollLeft(false);
    }
  };

  const handleScrollEndEvent = () => {
    let listElem: any = document.getElementById(
      "landing-new-Arrival-book-list"
    );
    if (listElem.scrollLeft !== 0) {
      if (moreLoad) {
        setScrollEnd(false);
        currentPageRef.current = currentPageRef.current + 1;
        setMoreLoader(true);
        handleGetNewArrivals();
      } else {
        setScrollEnd(true);
      }
    }
  };

  useEffect(() => {
    let elem: any = document.getElementById("landing-new-Arrival-book-list");
    elem?.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (newArrivalBooksRef.current?.length > 0) {
      let listElem: any = document.getElementById(
        "landing-new-Arrival-book-list"
      );
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [newArrivalBooks]);

  useEffect(() => {
    initialSetup();
  }, []);

  return (
    <div
      className={classNames(
        styles.customContainer,
        "px-3 px-sm-0  position-relative w-100"
      )}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mt-4 mb-2"
        )}
      >
        <label className={classNames(styles.title)}>
          <span>New</span> Arrivals
        </label>
      </div>

      <div className={classNames("position-relative", styles.arrowsContainer)}>
        {isHovering && newArrivalBooks?.length > 5 ? (
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
        {isHovering && newArrivalBooks?.length > 5 ? (
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
      <div
        className={classNames(
          "w-100 d-flex align-items-start justify-content-start ",
          styles.bookList
        )}
        id="landing-new-Arrival-book-list"
      >
        {newArrivalBooks?.map((itm: any, inx: any) => {
          return (
            <BookCard
              compoID="arrival"
              item={itm}
              key={inx}
              index={inx}
              parentElementId="landing-new-Arrival-book-list"
              onClick={() =>
                router.push(
                  kidPanelConstant.preview.path.replace(":id", itm?.id)
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewArrivalList;
