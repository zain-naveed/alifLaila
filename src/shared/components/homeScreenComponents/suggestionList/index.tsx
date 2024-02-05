import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import BookCard from "shared/components/common/bookCard";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { getBookSuggestionList } from "shared/services/kid/bookService";
import styles from "./style.module.scss";

interface SuggestionListProps {
  suggestion: any;
}

const SuggestionList = ({ suggestion }: SuggestionListProps) => {
  const router = useRouter();
  const currentPageRef = useRef<number>(1);
  const suggestedBooksRef = useRef<any[]>([]);
  const [suggestedBooks, setSuggestedBooks] = useState<any>([]);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [moreLoader, setMoreLoader] = useState<boolean>(false);
  const [scrollEnd, setScrollEnd] = useState<boolean>(true);
  const [isScrollLeft, setIsScrollLeft] = useState<boolean>(false);
  const [moreLoad, setMoreLoad] = useState<boolean>(true);

  const scrollRight = () => {
    let listElem: any = document.getElementById(
      "landing-kid-recommended-book-list"
    );
    listElem.scrollLeft = listElem.scrollLeft + listElem.clientWidth;
  };
  const scrollLeft = () => {
    let listElem: any = document.getElementById(
      "landing-kid-recommended-book-list"
    );
    listElem.scrollLeft = listElem.scrollLeft - listElem.clientWidth;
    if (suggestedBooks?.length > 5) {
      setScrollEnd(false);
    }
  };

  const handleGetSuggestions = () => {
    getBookSuggestionList({ page: currentPageRef.current })
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
            let cloneArr = [...suggestedBooksRef.current];
            cloneArr = [...cloneArr, ...data];
            setSuggestedBooks(cloneArr);
            suggestedBooksRef.current = cloneArr;
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
    } = suggestion;
    if (current_page === last_page) {
      setMoreLoad(false);
      if (data?.length > 5) {
        setScrollEnd(false);
      }
    } else {
      setScrollEnd(false);
      setMoreLoad(true);
    }
    suggestedBooksRef.current = data;
    setSuggestedBooks(data);
  };

  const handleScrollEvent = () => {
    let elem: any = document.getElementById(
      "landing-kid-recommended-book-list"
    );
    if (elem.scrollLeft !== 0) {
      setIsScrollLeft(true);
    } else {
      setIsScrollLeft(false);
    }
  };

  const handleScrollEndEvent = () => {
    let listElem: any = document.getElementById(
      "landing-kid-recommended-book-list"
    );
    if (listElem.scrollLeft !== 0) {
      if (moreLoad) {
        setScrollEnd(false);
        currentPageRef.current = currentPageRef.current + 1;
        setMoreLoader(true);
        handleGetSuggestions();
      } else {
        setScrollEnd(true);
      }
    }
  };

  useEffect(() => {
    let elem: any = document.getElementById(
      "landing-kid-recommended-book-list"
    );
    elem.addEventListener("scroll", handleScrollEvent);
    return () => {
      elem?.removeEventListener("scroll", handleScrollEvent);
    };
  }, []);

  useEffect(() => {
    if (suggestedBooksRef.current?.length > 0) {
      let listElem: any = document.getElementById(
        "landing-kid-recommended-book-list"
      );
      listElem?.addEventListener("scrollend", handleScrollEndEvent);
      return () => {
        listElem?.removeEventListener("scrollend", handleScrollEndEvent);
      };
    }
  }, [suggestedBooks]);

  useEffect(() => {
    initialSetup();
  }, []);

  return (
    <div className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mt-2"
        )}
      >
        <label className={classNames(styles.title)}>
          <span>Recommended</span> For You
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
        {isHovering && suggestedBooks?.length > 5 ? (
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
            "w-100 d-flex align-items-start justify-content-start mt-3",
            styles.bookList
          )}
          id="landing-kid-recommended-book-list"
        >
          {suggestedBooks?.map((itm: any, inx: any) => {
            return (
              <BookCard
                item={itm}
                key={inx}
                index={inx}
                compoID="suggest"
                parentElementId="landing-kid-recommended-book-list"
                onClick={() =>
                  router.push(
                    kidPanelConstant.preview.path.replace(":id", itm?.id)
                  )
                }
              />
            );
          })}
        </div>
        {isHovering && suggestedBooks?.length > 5 ? (
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

export default SuggestionList;
