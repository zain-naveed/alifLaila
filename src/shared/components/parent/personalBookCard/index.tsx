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
import { useDispatch, useSelector } from "react-redux";
import Animation from "shared/components/common/animation";
import { toastMessage } from "shared/components/common/toast";
import SelectKids from "shared/modal/selectKids";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import {
  addBookFav,
  getBookAccess,
  removeBookFav,
} from "shared/services/kid/bookService";
import { getNumberOfDays } from "shared/utils/helper";
import styles from "./style.module.scss";

interface FavouriteBookCardProps {
  item?: any;
  index?: number;
  customContainerStyle?: any;
  parentElementId: string;
  isShared?: boolean;
}

function PersonalBookCard({
  item,
  index,
  customContainerStyle,
  parentElementId,
  isShared,
}: FavouriteBookCardProps) {
  const {
    login: { isLoggedIn, currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const router = useRouter();
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    item?.book?.is_favourite || false
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
    let obj = {
      book_id: bookItem?.id,
    };
    setIsFavourite(true);
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
    let obj = {
      book_id: bookItem?.id,
    };
    setIsFavourite(false);
    toastMessage("info", "Removed from Favourites");
    removeBookFav(obj)
      .then(({ data: { status, message } }) => {
        if (status) {
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      });
  };

  const handleNavigate = () => {
    if (isLoggedIn) {
      setPreviewLoading(true);
      getBookAccess({ id: item?.book?.id as string })
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (data) {
              router.push(
                parentPanelConstant.preview.path.replace(":id", item?.book?.id)
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
          setPreviewLoading(false);
        });
    } else {
      router.push(
        parentPanelConstant.preview.path.replace(":id", item?.book?.id)
      );
    }
  };

  const handleScroll = () => {
    let infoElem: any = document.getElementById(
      `mybook-parent-info-container-${index}`
    );
    var parentElement: any = document.getElementById(parentElementId);
    var cardElement: any = document.getElementById(
      `mybook-parent-book-card-${index}`
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
    var parentElement: any = document.getElementById(parentElementId);
    var cardElement: any = document.getElementById(
      `mybook-parent-book-card-${index}`
    );
    let infoElem: any = document.getElementById(
      `mybook-parent-info-container-${index}`
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
    let topElem: any = document.getElementById(parentElementId);
    const observer: any = new ResizeObserver(handleResizeObserver).observe(
      topElem
    );
    return () => {
      observer?.unobserve(topElem);
    };
  }, []);

  return (
    <>
      {previewLoading ? <Animation animaton={LoadingAnimation} /> : null}
      <div
        className={classNames(
          styles.cardContainer,
          customContainerStyle && customContainerStyle
        )}
      >
        <div
          className={classNames(styles.bookThumbailWrapper)}
          id={`mybook-parent-book-card-${index}`}
        >
          <div
            className={classNames(styles.img, "position-relative")}
            onClick={handleNavigate}
          >
            <object
              data={
                item?.book?.thumbnail
                  ? item?.book?.thumbnail
                  : item?.book?.cover_photo
              }
              type="image/png"
              className={classNames(styles.imgStyle, "pointer")}
            >
              <Image
                src={DefaultBookImg}
                style={{ objectFit: "cover" }}
                alt="Image Not Found"
                className={classNames(styles.imgStyle, "pointer")}
                width={230}
                height={335}
                priority
              />
            </object>
            {item?.book?.is_complete ? (
              <div className={classNames(styles.completeContainer, "gap-1")}>
                <label>Completed</label>
                <div className={classNames(styles.iconContainer)}>
                  <TickIcon />
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div
          className={classNames(styles.infoContainer)}
          id={`mybook-parent-info-container-${index}`}
        >
          <div
            className={classNames(styles.infoImg, "position-relative")}
            onClick={handleNavigate}
          >
            <object
              data={
                item?.book?.thumbnail
                  ? item?.book?.thumbnail
                  : item?.book?.cover_photo
              }
              type="image/png"
              className={classNames(styles.imgStyle, "pointer")}
            >
              <Image
                src={DefaultBookImg}
                style={{ objectFit: "cover" }}
                alt="Image Not Found"
                className={classNames(styles.imgStyle, "pointer")}
                width={230}
                height={335}
                priority
              />
            </object>
            {item?.book?.is_complete ? (
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
                  {item?.book?.rating_average
                    ? Number(item?.book?.rating_average).toFixed(1)
                    : 0}
                </label>
              </div>
              <div className={classNames("d-flex align-items-center gap-1")}>
                <LanguageGlobeIcon
                  className={classNames(styles.infoCardIcon)}
                />
                <label className={classNames(styles.languageLabel)}>
                  {item?.book?.language?.name}
                </label>
              </div>
            </div>
            <label className={classNames(styles.title, "mt-1")}>
              {item?.book?.title}
            </label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between w-100 mt-1"
              )}
            >
              <div
                className={classNames("d-flex align-items-center gap-1")}
                role="button"
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
              {item?.book?.deleted_at === null ? (
                <>
                  {isFavourite ? (
                    <Image
                      src={HeartFill}
                      alt="like-icon"
                      className={classNames(styles.infoCardIcon)}
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavourite(item?.book);
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
                        addFavourite(item?.book);
                      }}
                    />
                  )}
                </>
              ) : null}
            </div>
            <div
              className={classNames(
                "d-flex align-items-center mt-1 mt-md-2 gap-1"
              )}
            >
              <div
                className={classNames(styles.timerContainer)}
                style={item?.type === 2 ? { backgroundColor: "#ECFDF3" } : {}}
              >
                <label
                  className={classNames(styles.timeLabel)}
                  style={item?.type === 2 ? { color: "#027A48" } : {}}
                >
                  {item?.type === 2
                    ? "Life Time Bought"
                    : getNumberOfDays(item?.expiry_date) < 1
                    ? "Expired"
                    : getNumberOfDays(item?.expiry_date) === 1
                    ? "Expiring Today"
                    : getNumberOfDays(item?.expiry_date) > 2
                    ? `${getNumberOfDays(item?.expiry_date)} Days Left`
                    : `1 Day Left`}
                </label>
              </div>
              {isShared ? (
                <label className={classNames(styles.shareLabel)}>
                  by {item?.user?.first_name} {item?.user?.last_name}
                </label>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <SelectKids
        show={assignModal}
        handleClose={handleCloseAssignModal}
        book_id={item?.book_id}
      />
    </>
  );
}

export default PersonalBookCard;
