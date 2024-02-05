import { BackIcon, NextIcon } from "assets";
import classNames from "classnames";
import { DOTS, usePagination } from "shared/customHook/usePagination";
import styles from "./style.module.scss";

const Pagination = (props: any) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  } = props;

  const paginationRange: any = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    if (currentPage < totalCount / pageSize) {
      onPageChange(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <ul
      className={classNames(styles.paginationContainer, "ps-0 mt-3 ", {
        [className]: className,
      })}
    >
      <li
        className={classNames("me-auto ps-0 ps-sm-3 ms-0", styles.display)}
        onClick={onPrevious}
      >
        <div
          className={classNames(styles.arrowContainer, "px-3")}
          role={currentPage > 1 ? "button" : "none"}
        >
          <BackIcon className={classNames(styles.iconStyle, "me-0 me-sm-2")} />
          <label
            className={classNames(styles.actionLabel, "d-none d-sm-flex")}
            role={currentPage > 1 ? "button" : "none"}
          >
            Previous
          </label>
        </div>
      </li>
      <div className={classNames("d-flex")}>
        {paginationRange?.map((pageNumber: any, inx: any) => {
          if (pageNumber === DOTS) {
            return (
              <li className={styles.dots} key={inx}>
                &#8230;
              </li>
            );
          }
          return (
            <li
              className={classNames(
                styles.paginationItem,
                pageNumber === currentPage && styles.active
              )}
              onClick={() => onPageChange(pageNumber)}
              key={inx}
            >
              {pageNumber}
            </li>
          );
        })}
      </div>
      <li
        className={classNames("ms-auto pe-0 pe-sm-3 me-0", styles.display)}
        onClick={onNext}
      >
        <div
          className={classNames(styles.arrowContainer, "px-3")}
          role={currentPage < totalCount / pageSize ? "button" : "none"}
        >
          <label
            className={classNames(styles.actionLabel, "d-none d-sm-flex")}
            role={currentPage < totalCount / pageSize ? "button" : "none"}
          >
            Next
          </label>
          <NextIcon className={classNames(styles.iconStyle, "ms-0 ms-sm-2")} />
        </div>
      </li>
      <div className={classNames(" gap-3 my-3", styles.smallScreenDisplay)}>
        <li
          className={classNames("me-auto ps-0 ps-sm-3 ms-0")}
          onClick={onPrevious}
        >
          <div
            className={classNames(styles.arrowContainer, "px-3")}
            role={currentPage > 1 ? "button" : "none"}
          >
            <BackIcon
              className={classNames(styles.iconStyle, "me-0 me-sm-2")}
            />
            <label
              className={classNames(styles.actionLabel, "d-none d-sm-flex")}
              role={currentPage > 1 ? "button" : "none"}
            >
              Previous
            </label>
          </div>
        </li>
        <li
          className={classNames("ms-auto pe-0 pe-sm-3 me-0")}
          onClick={onNext}
        >
          <div
            className={classNames(styles.arrowContainer, "px-3")}
            role={currentPage < totalCount / pageSize ? "button" : "none"}
          >
            <label
              className={classNames(styles.actionLabel, "d-none d-sm-flex")}
              role={currentPage < totalCount / pageSize ? "button" : "none"}
            >
              Next
            </label>
            <NextIcon
              className={classNames(styles.iconStyle, "ms-0 ms-sm-2")}
            />
          </div>
        </li>
      </div>
    </ul>
  );
};

export default Pagination;
