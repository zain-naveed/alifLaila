import { ChevLeftIcon, ChevRightIcon } from "assets";
import classNames from "classnames";
import { DOTS, usePagination } from "shared/customHook/usePagination";
import styles from "./style.module.scss";

const CustomPagination = (props: any) => {
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

  if (
    currentPage === 0 ||
    paginationRange?.length < 2 ||
    paginationRange == undefined
  ) {
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
      className={classNames(styles.paginationContainer, "ps-0 gap-2 ", {
        [className]: className,
      })}
    >
      <li className={classNames(styles.display)} onClick={onPrevious}>
        <div
          className={classNames(styles.arrowContainer)}
          role={currentPage > 1 ? "button" : "none"}
        >
          <ChevLeftIcon
            className={classNames(
              styles.iconStyle,
              currentPage > 1 && styles.activeIcon
            )}
          />
        </div>
      </li>
      <div className={classNames("d-flex")}>
        {paginationRange &&
          paginationRange?.map((pageNumber: any, inx: any) => {
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
      <li className={classNames(styles.display)} onClick={onNext}>
        <div
          className={classNames(styles.arrowContainer)}
          role={currentPage < totalCount / pageSize ? "button" : "none"}
        >
          <ChevRightIcon
            className={classNames(
              styles.iconStyle,
              currentPage < totalCount / pageSize && styles.activeIcon
            )}
          />
        </div>
      </li>
      <div className={classNames(" gap-3 my-3", styles.smallScreenDisplay)}>
        <li onClick={onPrevious}>
          <div
            className={classNames(styles.arrowContainer)}
            role={currentPage > 1 ? "button" : "none"}
          >
            <ChevLeftIcon
              className={classNames(
                styles.iconStyle,
                currentPage > 1 && styles.activeIcon
              )}
            />
          </div>
        </li>
        <li onClick={onNext}>
          <div
            className={classNames(styles.arrowContainer)}
            role={currentPage < totalCount / pageSize ? "button" : "none"}
          >
            <ChevRightIcon
              className={classNames(
                styles.iconStyle,
                currentPage < totalCount / pageSize && styles.activeIcon
              )}
            />
          </div>
        </li>
      </div>
    </ul>
  );
};

export default CustomPagination;
