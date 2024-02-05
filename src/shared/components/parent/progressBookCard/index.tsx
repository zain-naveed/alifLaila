import {
  AssignBookIcon,
  DefaultBookImg,
  HeartEmpty,
  HeartFill,
  LanguageGlobeIcon,
  LoadingAnimation,
  RatingStar,
  TickIcon,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Animation from "shared/components/common/animation";
import { toastMessage } from "shared/components/common/toast";
import { parentPanelConstant } from "shared/routes/routeConstant";
import {
  addBookFav,
  getBookAccess,
  removeBookFav,
} from "shared/services/kid/bookService";
import styles from "./style.module.scss";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { percentage } from "shared/utils/helper";
import SelectKids from "shared/modal/selectKids";

interface ProgressBookCardProps {
  item: any;
  pageNo: any;
  parentId: string;
  index: number;
  isQuator?: boolean;
}

function ProgressBookCard({
  item,
  pageNo,
  parentId,
  index,
  isQuator,
}: ProgressBookCardProps) {
  const {
    login: { currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    item?.is_favourite || false
  );
  const [assignModal, setShowAssignModal] = useState<boolean>(false);

  const handleShowAssignModal = (e: any) => {
    e.stopPropagation();
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowAssignModal(true);
    }
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
  };

  const addFavourite = (bookItem: any) => {
    setIsFavourite(true);
    let obj = {
      book_id: bookItem?.id,
    };
    toastMessage("info", "Added to Favourites");
    addBookFav(obj)
      .then(({ data: { status, message } }) => {
        if (status) {
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage(err?.response?.data?.message, "error");
      });
  };

  const removeFavourite = (bookItem: any) => {
    setIsFavourite(false);
    let obj = {
      book_id: bookItem?.id,
    };
    toastMessage("info", "Removed from Favourites");
    removeBookFav(obj)
      .then(({ data: { status, message } }) => {
        if (status) {
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage(err?.response?.data?.message, "error");
      });
  };

  const handleClick = (bookItem: any) => {
    setLoading(true);
    getBookAccess({ id: bookItem?.id })
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data) {
            router.push(
              parentPanelConstant.preview.path.replace(":id", bookItem?.id)
            );
          } else {
            if (!showModal) {
              dispatch(setShowPlanModal({ showModal: true }));
            }
          }
        } else {
          if (!showModal) {
            dispatch(setShowPlanModal({ showModal: true }));
          }
        }
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleScroll = () => {
    let infoElem: any = document.getElementById(
      `parent-progress-info-container-${index}`
    );
    var parentElement: any = document.getElementById(parentId);
    var cardElement: any = document.getElementById(
      `parent-book-progress-card-${index}`
    );
    if (cardElement && parentElement && infoElem) {
      let res = cardElement?.offsetLeft - parentElement?.scrollLeft;
      infoElem.style.left = `${res}px`;
    }
  };

  const handleResizeObserver = () => {
    handleScroll();
  };

  useEffect(() => {
    var parentElement: any = document.getElementById(parentId);
    var cardElement: any = document.getElementById(
      `parent-book-progress-card-${index}`
    );
    let infoElem: any = document.getElementById(
      `parent-progress-info-container-${index}`
    );
    if (cardElement && parentElement && infoElem) {
      let res = cardElement?.offsetLeft - parentElement?.scrollLeft;
      infoElem.style.left = `${res}px`;
    }
    parentElement.addEventListener("scroll", handleScroll);
    return () => {
      parentElement?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    let topElem: any = document.getElementById(parentId);
    const observer: any = new ResizeObserver(handleResizeObserver).observe(
      topElem
    );
    return () => {
      observer?.unobserve(topElem);
    };
  }, []);

  return (
    <>
      {loading ? <Animation animaton={LoadingAnimation} /> : null}
      <div
        className={classNames(
          isQuator ? styles.cardContainer2 : styles.cardContainer
        )}
        onClick={() => handleClick(item)}
        role="button"
      >
        <div
          id={`parent-book-progress-card-${index}`}
          style={{ height: "100%" }}
          className={classNames(styles.bookThumbailWrapper)}
        >
          <div className={classNames(styles.img, "position-relative")}>
            <object
              data={item?.thumbnail ? item?.thumbnail : item?.cover_photo}
              type="image/png"
              className={classNames(styles.imgStyle)}
            >
              <Image
                src={DefaultBookImg}
                style={{ objectFit: "cover" }}
                alt="Image Not Found"
                className={classNames(styles.imgStyle)}
                height={300}
                width={280}
              />
            </object>
            {item?.is_complete ? (
              <div className={classNames(styles.completeContainer, "gap-1")}>
                <label>Completed</label>
                <div className={classNames(styles.iconContainer)}>
                  <TickIcon />
                </div>
              </div>
            ) : null}
          </div>
          <div
            className={classNames(
              "w-100 d-flex align-items-center justify-content-between gap-2 mt-2",
              styles.bottomContainer
            )}
          >
            <div className={classNames(styles.progressContainer)}>
              <div
                className={classNames(styles.fillProgressContainer)}
                style={{ width: `${percentage(pageNo, item?.total_pages)}%` }}
              />
            </div>
            <label className={classNames(styles.progressText)}>
              {Math.trunc(percentage(pageNo, item?.total_pages))}%
            </label>
          </div>
        </div>

        <div
          className={classNames(styles.infoContainer)}
          id={`parent-progress-info-container-${index}`}
        >
          <div
            className={classNames(styles.infoImg, "position-relative")}
            onClick={() => handleClick(item)}
          >
            <object
              data={item?.thumbnail ? item?.thumbnail : item?.cover_photo}
              type="image/png"
              className={classNames(styles.imgStyle, "pointer")}
            >
              <Image
                src={DefaultBookImg}
                style={{ objectFit: "cover" }}
                alt="Image Not Found"
                className={classNames(styles.imgStyle, "pointer")}
                height={300}
                width={206}
                priority
              />
            </object>
            {item?.is_complete ? (
              <div className={classNames(styles.completeContainer, "gap-1")}>
                <label>Completed</label>
                <div className={classNames(styles.iconContainer)}>
                  <TickIcon />
                </div>
              </div>
            ) : null}
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justufy-content-center px-2 py-2 py-xxl-3 w-100"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start gap-1"
                )}
              >
                <RatingStar className={classNames(styles.starIcon)} />
                <label className={classNames(styles.starLabel)}>
                  {item?.rating_average
                    ? Number(item?.rating_average).toFixed(1)
                    : 0}
                </label>
              </div>
              <div className={classNames("d-flex align-items-center gap-1")}>
                <LanguageGlobeIcon
                  className={classNames(styles.infoCardIcon)}
                />
                <label className={classNames(styles.languageLabel)}>
                  {item?.language?.name}
                </label>
              </div>
            </div>

            <label className={classNames(styles.title, "mt-1")}>
              {item?.title}
            </label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between w-100 mt-1"
              )}
            >
              <div
                className={classNames("d-flex align-items-center gap-1")}
                onClick={handleShowAssignModal}
              >
                <AssignBookIcon
                  className={classNames(styles.infoCardIcon, styles.iconGreen)}
                />
                <label
                  className={classNames(styles.languageLabel, styles.green)}
                  role="button"
                >
                  Assign
                </label>
              </div>
              {item?.deleted_at === null ? (
                <>
                  {isFavourite ? (
                    <Image
                      src={HeartFill}
                      alt="like-icon"
                      className={classNames(styles.infoCardIcon)}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavourite(item);
                      }}
                    />
                  ) : (
                    <Image
                      src={HeartEmpty}
                      alt="like-icon"
                      className={classNames(styles.infoCardIcon)}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addFavourite(item);
                      }}
                    />
                  )}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <SelectKids
        show={assignModal}
        handleClose={handleCloseAssignModal}
        book_id={item?.id}
      />
    </>
  );
}

export default ProgressBookCard;
