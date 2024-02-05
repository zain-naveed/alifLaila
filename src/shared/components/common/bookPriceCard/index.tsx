import Image from "next/image";
import { useRouter } from "next/router";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import {
  DefaultBookImg,
  HeartEmpty,
  HeartFill,
  LanguageGlobeIcon,
  LoadingAnimation,
  RatingStar,
} from "assets";
import { useEffect, useState } from "react";
import { toastMessage } from "../toast";
import {
  addBookFav,
  getBookAccess,
  removeBookFav,
} from "shared/services/kid/bookService";
import { useDispatch, useSelector } from "react-redux";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import Animation from "../animation";
interface Props {
  item: any;
  index: number;
  parentElementId: string;
  isParentModule?: boolean;
}

function BookPriceCard(props: Props) {
  const { item, index, parentElementId, isParentModule } = props;
  const {
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const [bookDetail, setBookDetail] = useState<any>(item);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    item?.is_favourite || false
  );
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  const addFavourite = (bookItem: any) => {
    setIsFavourite(true);
    toastMessage("info", "Added to Favourites");
    let obj = {
      book_id: bookItem?.id,
    };
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
    toastMessage("info", "Removed from Favourites");
    setIsFavourite(false);
    let obj = {
      book_id: bookItem?.id,
    };
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

  const handleNavigate = () => {
    if (isParentModule) {
      router.push(parentPanelConstant.preview.path.replace(":id", item?.id));
    } else {
      setPreviewLoading(true);
      getBookAccess({ id: item?.id as string })
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (data) {
              router.push(
                kidPanelConstant.preview.path.replace(":id", item?.id)
              );
            } else {
              if (!showModal) {
                dispatch(
                  setShowPlanModal({ showModal: true, reachLimit: true })
                );
              } else {
                dispatch(setShowPlanModal({ reachLimit: true }));
              }
            }
          } else {
            if (!showModal) {
              dispatch(setShowPlanModal({ showModal: true, reachLimit: true }));
            } else {
              dispatch(setShowPlanModal({ reachLimit: true }));
            }
          }
        })
        .catch((err) => {
          toastMessage("Error", err?.response?.data?.message);
        })
        .finally(() => {
          setPreviewLoading(false);
        });
    }
  };

  const handleScroll = () => {
    let infoElem: any = document.getElementById(
      `info-price-container-${index}`
    );
    var parentElement: any = document.getElementById(parentElementId);
    var cardElement: any = document.getElementById(`book-price-card-${index}`);
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
    var cardElement: any = document.getElementById(`book-price-card-${index}`);
    let infoElem: any = document.getElementById(
      `info-price-container-${index}`
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

  useEffect(() => {
    setBookDetail(item);
  }, [item?.id]);

  return (
    <>
      {previewLoading ? <Animation animaton={LoadingAnimation} /> : null}
      <div className={classNames(styles.cardContainer, "d-flex flex-column")}>
        <div
          className={classNames(
            isParentModule
              ? styles.bookThumbailWrapper2
              : styles.bookThumbailWrapper
          )}
          id={`book-price-card-${index}`}
        >
          <div
            className={classNames(isParentModule ? styles.img2 : styles.img)}
            onClick={handleNavigate}
          >
            <object
              data={item?.thumbnail ? item?.thumbnail : item?.cover_photo}
              type="image/png"
              className={classNames(styles.imgStyle)}
              role="button"
            >
              <Image
                src={DefaultBookImg}
                style={{ objectFit: "cover" }}
                alt="Image Not Found"
                width={230}
                height={335}
                className={classNames(styles.imgStyle)}
                role="button"
              />
            </object>
          </div>
        </div>

        <div
          className={classNames(
            "w-100 d-flex align-items-center justify-content-between gap-2 mt-2",
            isParentModule ? styles.bottomContainer2 : styles.bottomContainer
          )}
        >
          <span className={styles.outterTitle} role="button">
            {item?.title}
          </span>
          <span className={styles.price}>
            Rs. {Math.trunc(item?.price ? item?.price : 0)}
          </span>
        </div>

        <div
          className={classNames(
            isParentModule ? styles.infoContainer2 : styles.infoContainer
          )}
          id={`info-price-container-${index}`}
        >
          <div
            className={classNames(
              isParentModule ? styles.infoImg2 : styles.infoImg
            )}
            id={`book-price-card-${index}`}
            onClick={handleNavigate}
          >
            <object
              data={item?.thumbnail ? item?.thumbnail : item?.cover_photo}
              type="image/png"
              className={classNames(styles.imgStyle, "pointer")}
            >
              <Image
                src={DefaultBookImg}
                alt="Image Not Found"
                style={{ objectFit: "cover" }}
                className={classNames(styles.imgStyle, "pointer")}
                width={230}
                height={335}
                priority
              />
            </object>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justufy-content-center px-2 py-2 py-xxl-3 w-100"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-1"
              )}
            >
              <RatingStar className={classNames(styles.starIcon)} />
              <label className={classNames(styles.starLabel)}>
                {bookDetail?.rating_average
                  ? Number(bookDetail?.rating_average).toFixed(1)
                  : 0}
              </label>
            </div>
            <label className={classNames(styles.title, "mt-1")}>
              {item?.title}
            </label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between w-100 mt-1"
              )}
            >
              <div className={classNames("d-flex align-items-center gap-1")}>
                <LanguageGlobeIcon
                  className={classNames(styles.infoCardIcon)}
                />
                <label className={classNames(styles.languageLabel)}>
                  {item?.language?.name}
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
    </>
  );
}

export default BookPriceCard;
