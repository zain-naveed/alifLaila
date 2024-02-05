import {
  BorrowBookIcon,
  BuyBookIcon,
  DefaultBookImg,
  FreeBookIcon,
  HeartEmpty,
  HeartFill,
  LanguageGlobeIcon,
  LoadingAnimation,
  RatingStar,
  TickIcon,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  addBookFav,
  buyBook,
  getBookAccess,
  removeBookFav,
} from "shared/services/kid/bookService";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";
import PurchaseConfirmationModal from "shared/modal/purchaseConfirmation";
import InsufficentCoin from "shared/modal/insufficientCoin";
import PurchaseSuccessModal from "shared/modal/purchaseSuccess";
import { useDispatch, useSelector } from "react-redux";
import Animation from "../animation";
import { getWallet } from "shared/services/kid/walletService";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { kidAccountRole } from "shared/utils/enum";
import { getNumberOfDays } from "shared/utils/helper";

interface BookCardProps {
  onClick?: (args?: any) => any;
  item?: any;
  index?: number;
  customContainerStyle?: any;
  parentElementId: string;
  noFixWidth?: boolean;
  noHover?: boolean;
  isFav?: boolean;
  removeItem?: (val: any) => void;
  compoID: string;
  isQuarter?: boolean;
}

function BookCard({
  onClick,
  item,
  index,
  customContainerStyle,
  parentElementId,
  noFixWidth,
  noHover,
  isFav,
  removeItem,
  compoID,
  isQuarter,
}: BookCardProps) {
  const {
    login: { isLoggedIn, kidRole },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [type, setType] = useState<number>(1);
  const [bookDetail, setBookDetail] = useState<any>(item);
  const [wallet, setWallet] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);
  const [coinModal, setShowCoinModal] = useState<boolean>(false);
  const [confirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [successModal, setShowSuccessModal] = useState<boolean>(false);
  const [purchaseLoader, setPurchaseLoader] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    isFav || item?.is_favourite || false
  );
  const [loading, setLoading] = useState<boolean>(true);

  const handleShowConfirmationModal = (type: number) => {
    handleGetWallet();
    setShowConfirmationModal(true);
    setType(type);
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const handleShowCoinModal = () => {
    setShowCoinModal(true);
  };

  const handleCloseCoinModal = () => {
    setShowCoinModal(false);
  };

  const handleShowSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const addFavourite = (bookItem: any) => {
    if (isLoggedIn) {
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
    } else {
      onClick?.();
    }
  };

  const removeFavourite = (bookItem: any) => {
    if (isLoggedIn) {
      toastMessage("info", "Removed from Favourites");
      setIsFavourite(false);
      let obj = {
        book_id: bookItem?.id,
      };
      removeBookFav(obj)
        .then(({ data: { status, message } }) => {
          if (status) {
            if (removeItem) {
              removeItem(bookItem);
            }
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage(err?.response?.data?.message, "error");
        });
    } else {
      onClick?.();
    }
  };

  const handleGetWallet = () => {
    setLoading(true);
    getWallet()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setWallet(data);
          dispatch(setLoginUser({ remainingCoins: data?.remaining_coins }));
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBookPurchase = () => {
    if (isLoggedIn) {
      setPurchaseLoader(true);
      buyBook({ book_id: item?.id, type: type })
        .then(({ data: { data, status, message, statusCode } }) => {
          if (status) {
            handleShowSuccessModal();
            let temp: any = { ...bookDetail };
            temp["book_access"] = data;
            setBookDetail(temp);
            handleCloseConfirmationModal();
            handleGetWallet();
          } else if (statusCode === 402) {
            handleCloseConfirmationModal();
            handleShowCoinModal();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("Error", err?.response?.data?.message);
        })
        .finally(() => {
          setPurchaseLoader(false);
        });
    } else {
      onClick?.();
    }
  };

  const handleNavigate = () => {
    if (isLoggedIn) {
      setPreviewLoading(true);
      getBookAccess({ id: item?.id as string })
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (data) {
              onClick?.();
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
    } else {
      onClick?.();
    }
  };

  const handleScroll = () => {
    let infoElem: any = document.getElementById(
      `info-container-${compoID}-${index}`
    );
    var parentElement: any = document.getElementById(parentElementId);
    var cardElement: any = document.getElementById(
      `book-card-${compoID}-${index}`
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
      `book-card-${compoID}-${index}`
    );
    let infoElem: any = document.getElementById(
      `info-container-${compoID}-${index}`
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
      <div
        className={classNames(
          isQuarter
            ? styles.quartorCardContainer
            : noFixWidth
            ? styles.noFixWidthCardContainer
            : styles.cardContainer,
          customContainerStyle && customContainerStyle
        )}
      >
        <div
          className={classNames(styles.bookThumbailWrapper)}
          id={`book-card-${compoID}-${index}`}
        >
          <div
            className={classNames(styles.img, "position-relative")}
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
                className={classNames(styles.imgStyle, "pointer")}
                style={{ objectFit: "cover" }}
                width={230}
                height={335}
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
        </div>

        {!noHover ? (
          <div
            className={classNames(styles.infoContainer)}
            id={`info-container-${compoID}-${index}`}
          >
            <div
              className={classNames(styles.infoImg, "position-relative")}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
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
              {item?.type === 2 ? (
                <>
                  {!item?.book_access ? (
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-between w-100 mt-1 mt-md-2"
                      )}
                    >
                      {kidRole !== kidAccountRole.family ? (
                        <div
                          className={classNames(
                            "d-flex align-items-center gap-1"
                          )}
                          role="button"
                          onClick={() => {
                            handleShowConfirmationModal(2);
                          }}
                        >
                          <BuyBookIcon
                            className={classNames(styles.infoCardIcon)}
                          />
                          <label
                            className={classNames(
                              styles.coinsLabel,
                              styles.secondary
                            )}
                            role="button"
                          >
                            {item?.buy_coins} Coins
                          </label>
                        </div>
                      ) : null}
                      <div
                        className={classNames(
                          "d-flex align-items-center gap-1"
                        )}
                        role="button"
                        onClick={() => {
                          handleShowConfirmationModal(1);
                        }}
                      >
                        <BorrowBookIcon
                          className={classNames(styles.infoCardIcon)}
                        />
                        <label
                          className={classNames(
                            styles.coinsLabel,
                            styles.primary
                          )}
                          role="button"
                        >
                          {item?.borrow_coins} Coins
                        </label>
                      </div>
                    </div>
                  ) : (
                    kidRole !== kidAccountRole.family &&
                    (item?.book_access?.type !== 2 ? (
                      <div
                        className={classNames(
                          "d-flex align-items-center justify-content-between w-100 mt-1 mt-md-2"
                        )}
                      >
                        <div
                          className={classNames(
                            "d-flex align-items-center gap-1"
                          )}
                          role="button"
                          onClick={() => {
                            handleShowConfirmationModal(2);
                          }}
                        >
                          <BuyBookIcon
                            className={classNames(styles.infoCardIcon)}
                          />
                          <label
                            className={classNames(
                              styles.coinsLabel,
                              styles.secondary
                            )}
                            role="button"
                          >
                            {item?.buy_coins} Coins
                          </label>
                        </div>
                      </div>
                    ) : null)
                  )}
                </>
              ) : (
                <div
                  className={classNames(
                    "d-flex align-items-center gap-1 mt-1 mt-md-2 "
                  )}
                >
                  <FreeBookIcon className={classNames(styles.infoCardIcon)} />
                  <label
                    className={classNames(styles.coinsLabel, styles.parrot)}
                  >
                    Free Book
                  </label>
                </div>
              )}
              {item?.book_access ? (
                <>
                  {item?.book_access?.type === 1 ? (
                    <>
                      {getNumberOfDays(item?.book_access?.expiry_date) >= 1 ? (
                        <div
                          className={classNames(
                            styles.timerContainer,
                            "mt-1 mt-md-2"
                          )}
                        >
                          <label className={classNames(styles.timeLabel)}>
                            Borrowed
                          </label>
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div
                      className={classNames(
                        styles.timerContainer,
                        "mt-1 mt-md-2"
                      )}
                      style={{ backgroundColor: "#ECFDF3" }}
                    >
                      <label
                        className={classNames(styles.timeLabel)}
                        style={{ color: "#027A48" }}
                      >
                        Life Time Bought
                      </label>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      <PurchaseConfirmationModal
        open={confirmationModal}
        handleClose={handleCloseConfirmationModal}
        handleBookPurchase={handleBookPurchase}
        type={type}
        bookDetail={bookDetail}
        purchaseLoader={purchaseLoader}
        wallet={wallet}
        loading={loading}
      />
      <InsufficentCoin open={coinModal} handleClose={handleCloseCoinModal} />
      <PurchaseSuccessModal
        show={successModal}
        handleClose={handleCloseSuccessModal}
        purchaseId={bookDetail?.book_access?.purchase_id}
      />
    </>
  );
}

export default BookCard;
