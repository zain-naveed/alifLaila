import {
  BookCloseIcon,
  ChevUpIcon,
  LogoIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "assets";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import HTMLFlipBook from "react-pageflip";
import { useDispatch, useSelector } from "react-redux";
import NoAccessPage from "shared/components/common/noAccessPage";
import StartPage from "shared/components/common/startPage";
import { toastMessage } from "shared/components/common/toast";
import Slider from "shared/components/kid/slider";
import InsufficentCoin from "shared/modal/insufficientCoin";
import PurchaseConfirmationModal from "shared/modal/purchaseConfirmation";
import PurchaseSuccessModal from "shared/modal/purchaseSuccess";
import RatingModal from "shared/modal/rating";
import ReportModal from "shared/modal/report";
import SelectKids from "shared/modal/selectKids";
import SelectPlanModal from "shared/modal/selectPlan";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import {
  buyBook,
  finishBook,
  getBookPreiview,
  trackBookPages,
} from "shared/services/kid/bookService";
import { getWallet } from "shared/services/kid/walletService";
import { languageEnum } from "shared/utils/enum";
import styles from "./style.module.scss";
import AuthModal from "shared/modal/auth";
const Quiz = dynamic(() => import("shared/modal/quiz"), {
  ssr: false,
});

interface BookPreviewProps {
  bookResponse: any;
  showAssign?: boolean;
  handleBuyHardCopy?: () => void;
  viewQuiz?: boolean;
  showRating: boolean;
  showBuyActions?: boolean;
  kid_role: any;
  isPublic?: boolean;
}

const BookView = ({
  bookResponse,
  showAssign,
  handleBuyHardCopy,
  viewQuiz,
  showRating,
  showBuyActions = true,
  kid_role,
  isPublic,
}: BookPreviewProps) => {
  const {
    auth,
    login: { currentPlan, remainingCoins },
    plan: { showModal },
  } = useSelector((state: any) => state.root);

  const router = useRouter();
  const dispatch = useDispatch();
  const handle = useFullScreenHandle();

  const bookID: number = bookResponse?.data?.book?.id;
  const selectedLang = bookResponse?.data?.book?.language?.name;

  const bookRef = useRef<any>(null);
  const pageNumber = useRef<number>(1);
  const startPageNumberRef = useRef<number>(0);
  const totalPagesRef = useRef<number>(bookResponse?.data?.book?.total_pages);
  const lastReadPageNumber = useRef<number>(0);
  const bookArrRef = useRef<any[]>([]);

  const [renderCount, setRenderCount] = useState<number>(1);
  const [bookHeight, setHeight] = useState<number>(0);
  const [bookWidth, setWidth] = useState<number>(1);
  const [type, setType] = useState<number>(1);
  const [slider, setSlider] = useState<number>(0);
  const [bookArr, setBookArr] = useState<any>([]);
  const [bookDetail, setBookDetail] = useState<any>(bookResponse?.data?.book);
  const [wallet, setWallet] = useState<any>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [purchaseLoader, setPurchaseLoader] = useState<boolean>(false);
  const [isAccess, setIsAccess] = useState<boolean>(bookResponse?.data?.access);
  const [coinModal, setShowCoinModal] = useState<boolean>(false);
  const [confirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [successModal, setShowSuccessModal] = useState<boolean>(false);
  const [showActions, setShowActions] = useState<boolean>(false);
  const [walletloading, setWalletLoading] = useState<boolean>(true);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [assignModal, setShowAssignModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  /* -------------------------------------Rotation Functions------------------------------------- */

  const handlePreviousPage = () => {
    if (pageNumber.current > 1) {
      let x = 0;
      x = pageNumber.current - 2;
      if (x !== 1) {
        pageNumber.current = x;
        setSlider(x);
      } else {
        setSlider(0);
        pageNumber.current = x;
      }
      if (selectedLang === languageEnum.urdu) {
        startPageNumberRef.current =
          bookArrRef.current?.length - pageNumber.current;
      } else {
        startPageNumberRef.current = pageNumber.current;
      }
    }
  };

  const handleNextPage = () => {
    if (pageNumber.current <= totalPagesRef.current) {
      if (!isAccess && pageNumber.current < 4) {
        //if no access then page number must be less then equal to 4
        let x = 0;
        x = pageNumber.current + 2;
        if (x < totalPagesRef.current) {
          pageNumber.current = x;
          setSlider(x);
        } else {
          setSlider(totalPagesRef.current);
          pageNumber.current = totalPagesRef.current;
        }
        if (selectedLang === languageEnum.urdu) {
          startPageNumberRef.current =
            bookArrRef.current?.length - pageNumber.current;
        } else {
          startPageNumberRef.current = pageNumber.current;
        }
      } else if (isAccess) {
        let x = 0;
        x = pageNumber.current + 2;
        if (x < totalPagesRef.current) {
          pageNumber.current = x;
          setSlider(x);
        } else {
          setSlider(totalPagesRef.current);
          pageNumber.current = totalPagesRef.current;
        }
        if (selectedLang === languageEnum.urdu) {
          startPageNumberRef.current =
            bookArrRef.current?.length - pageNumber.current;
        } else {
          startPageNumberRef.current = pageNumber.current;
        }
      }
    }
  };

  function handleLeftRotate() {
    bookRef?.current?.pageFlip()?.flipPrev();
    if (selectedLang === languageEnum.urdu) {
      handleNextPage();
    } else {
      handlePreviousPage();
    }
  }

  function handleRightRotate() {
    bookRef?.current?.pageFlip()?.flipNext();
    if (selectedLang === languageEnum.urdu) {
      handlePreviousPage();
    } else {
      handleNextPage();
    }
  }

  function handleLastPage() {
    if (handle.active) {
      setLoading(true);
      handle.exit();
    } else {
      if (showRating) {
        if (bookDetail?.user_book_rating) {
          handleShowQuiz();
        } else {
          handleShowRatingModal();
        }
      } else {
        router.back();
      }
    }
  }

  const handleClick = (page_no: number) => {
    if (bookArr?.length % 2 === 0) {
      if (page_no % 2 === 0) {
        setSlider(page_no - 2);
        pageNumber.current = page_no - 2;
      } else {
        setSlider(page_no + 1);
        pageNumber.current = page_no + 1;
      }
    } else {
      if (page_no % 2 === 0) {
        setSlider(page_no - 2);
        pageNumber.current = page_no - 1;
      } else {
        setSlider(page_no + 2);
        pageNumber.current = page_no + 2;
      }
    }
    if (selectedLang === languageEnum.urdu) {
      startPageNumberRef.current =
        bookArrRef.current?.length - pageNumber.current;
    } else {
      startPageNumberRef.current = pageNumber.current;
    }
  };

  const rotateToPage = (page: number) => {
    let tempTotalPages = bookArrRef?.current?.length;
    let tempPage = page + 1;
    if (page % 2 === 0) {
      pageNumber.current = page + 1;
    } else {
      pageNumber.current = page;
    }

    if (Number(tempTotalPages) % 2 === 0) {
      tempTotalPages = tempTotalPages + 2;
    } else {
      tempTotalPages = tempTotalPages + 1;
    }
    if (selectedLang === languageEnum.urdu) {
      let exactPage = tempTotalPages - tempPage;
      startPageNumberRef.current = exactPage;
      bookRef?.current?.pageFlip()?.turnToPage(Number(exactPage));
    } else {
      startPageNumberRef.current = page;
      bookRef?.current?.pageFlip()?.turnToPage(Number(page));
    }
  };

  /* -------------------------------------Api Functions------------------------------------- */

  function handleTrackBook(page: number) {
    trackBookPages({ book_id: bookID, page_no: page })
      .then(({ data: { data, status, message } }) => {
        if (status) {
        }
        if (page === bookDetail?.total_pages && !isPublic) {
          handleFinish();
        }
      })
      .catch((err) => {});
  }

  function handleFinish() {
    finishBook({ is_complete: 1, book_id: bookID })
      .then(({ data: { data, status, message } }) => {
        if (status) {
        }
      })
      .catch((err) => {});
  }

  function handleGetWallet() {
    setWalletLoading(true);
    getWallet()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setWallet(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setWalletLoading(false);
      });
  }

  function handleBookPurchase() {
    setPurchaseLoader(true);
    buyBook({ book_id: router.query.id, type: type })
      .then(({ data: { data, status, message, statusCode } }) => {
        if (status) {
          handleGetBookAgain();
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
  }

  function handleGetBookAgain() {
    getBookPreiview(router.query.id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setBookDetail(data?.book);
          let tempArr = [];
          if (data?.book?.language?.name === languageEnum.urdu) {
            tempArr = data?.pages.reverse();
            setBookArr(tempArr);
          } else {
            setBookArr(data?.pages);
          }
          bookArrRef.current = tempArr;
          if (data?.book?.language?.name === languageEnum.urdu) {
            startPageNumberRef.current = data?.book?.total_pages;
          } else {
            startPageNumberRef.current = 0;
          }
          setRenderCount(Math.random());
          pageNumber.current = 1;
          lastReadPageNumber.current = 0;
          totalPagesRef.current = data?.book?.total_pages;
          setIsAccess(data?.access);
          setSlider(0);
          handleCloseConfirmationModal();
          handleShowSuccessModal();
        } else {
          toastMessage("error", message);
          router.back();
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        router.back();
      })
      .finally(() => setPurchaseLoader(false));
  }

  /* -------------------------------------Modals Functions------------------------------------- */

  function handleClose() {
    setShowQuiz(false);
  }

  function handleShowQuiz() {
    setShowQuiz(true);
  }

  function handleShowConfirmationModal(type: number) {
    handleGetWallet();
    setShowConfirmationModal(true);
    setType(type);
  }

  function handleCloseConfirmationModal() {
    setShowConfirmationModal(false);
  }

  function handleShowCoinModal() {
    setShowCoinModal(true);
  }

  function handleCloseCoinModal() {
    setShowCoinModal(false);
  }

  function handleShowSuccessModal() {
    setShowSuccessModal(true);
  }

  function handleCloseSuccessModal() {
    setShowSuccessModal(false);
  }

  function handleShowReportModal() {
    setShowReportModal(true);
  }

  function handleCloseReportModal() {
    setShowReportModal(false);
  }

  function handleShowRatingModal() {
    setShowRatingModal(true);
  }

  function handleCloseRatingModal() {
    setShowRatingModal(false);
  }

  function handleShowAssignModal() {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowAssignModal(true);
    }
  }

  function handleCloseAssignModal() {
    setShowAssignModal(false);
  }

  /* -------------------------------------Event Listners Functions------------------------------------- */

  function handleResizeObserver(closeLoading: boolean) {
    let topElem: any = document.getElementById("book-preview-top-level");
    let leftBookPage: any = document.getElementById("left-book-page");
    let rightBookPage: any = document.getElementById("right-book-page");
    let height = topElem?.offsetHeight - 20;
    let width = Number(2 * Math.trunc(topElem?.offsetHeight * 0.688));
    if (width > topElem?.offsetWidth) {
      width = Math.trunc(topElem?.offsetWidth - 40);
      height = Number(Math.trunc(width / 2));
      height = Math.trunc(height / 0.688);
    }
    setHeight(height);
    setWidth(width / 2);
    setRenderCount(Math.random());
    if (closeLoading) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }

    if (leftBookPage) {
      //@ts-ignore
      leftBookPage.style.height = `${height}px`;
    }
    if (rightBookPage) {
      //@ts-ignore
      rightBookPage.style.height = `${height}px`;
    }
  }

  const registerKeyPress = useCallback((e: any) => {
    if (e.key == "ArrowLeft") {
      handleLeftRotate();
    } else if (e.key == "ArrowRight") {
      handleRightRotate();
    }
  }, []);

  /* -------------------------------------Initial Render Functions------------------------------------- */

  function handleBookPreviewResponse() {
    let { data, status, message } = bookResponse;
    if (status) {
      let tempArr = [];

      if (data?.book?.language?.name === languageEnum.urdu) {
        tempArr = data?.pages.reverse();
        setBookArr(tempArr);
      } else {
        tempArr = data?.pages;
        setBookArr(data?.pages);
      }

      bookArrRef.current = tempArr;

      handleResizeObserver(false);

      if (data?.access) {
        if (data?.book?.book_progress) {
          if (
            !data?.book?.book_progress?.is_complete &&
            data?.book?.book_progress?.page_no !== 0
          ) {
            let page = data?.book?.book_progress?.page_no;

            if (page % 2 === 0) {
              pageNumber.current = page + 1;
            } else {
              pageNumber.current = page;
            }

            if (data?.book?.language?.name === languageEnum.urdu) {
              startPageNumberRef.current = data?.book?.total_pages - page;
            } else {
              startPageNumberRef.current = page;
            }
            setSlider(pageNumber.current);
          } else {
            if (data?.book?.language?.name === languageEnum.urdu) {
              startPageNumberRef.current = data?.book?.total_pages;
            } else {
              startPageNumberRef.current = 0;
            }
          }
        } else {
          if (data?.book?.language?.name === languageEnum.urdu) {
            startPageNumberRef.current = data?.book?.total_pages;
          } else {
            startPageNumberRef.current = 0;
          }
        }
      } else {
        if (data?.book?.language?.name === languageEnum.urdu) {
          startPageNumberRef.current = data?.pages?.length;
        } else {
          startPageNumberRef.current = 0;
        }
      }
    } else {
      toastMessage("error", message);
      router.back();
    }
  }

  /* -------------------------------------Helper Functions------------------------------------- */

  function throttle(f: () => void, delay: number) {
    let timer: any = 0;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(() => f(), delay);
    };
  }

  /* -------------------------------------UseEffect Hooks------------------------------------- */

  useEffect(() => {
    handleBookPreviewResponse();
  }, []);

  useEffect(() => {
    let topElem: any = document.getElementById("book-preview-top-level");
    const observer: any = new ResizeObserver(
      throttle(() => {
        setLoading(true);
        handleResizeObserver(true);
      }, 600)
    ).observe(topElem);
    return () => {
      observer?.unobserve(topElem);
    };
  }, []);

  useEffect(() => {
    if (pageNumber.current > lastReadPageNumber.current) {
      lastReadPageNumber.current = pageNumber.current;

      if (!isPublic) {
        handleTrackBook(pageNumber.current);
      }
    }
  }, [pageNumber.current]);

  useEffect(() => {
    if (!isPublic) {
      finishBook({ is_viewed: 1, book_id: bookID }) //increase view count
        .then(({ data: { data, status, message } }) => {})
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", registerKeyPress);
    return () => {
      window.removeEventListener("keydown", registerKeyPress);
    };
  }, [registerKeyPress]);

  useEffect(() => {
    const handleContextmenu = (e: any) => {
        e.preventDefault()
    }
    document.addEventListener('contextmenu', handleContextmenu)
    return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
    }
}, [ ])

  return (
    <FullScreen handle={handle}>
      {loading ? <div className={classNames(styles.whiteContainer)} /> : null}

      <div
        className={classNames(styles.topContainer)}
        onClick={() => {
          setShowActions(!showActions);
        }}
      >
        {/* ---------------------------------------Header Section--------------------------------------- */}
        <div
          className={classNames(
            styles.headerContainer,
            showActions ? styles.titleShown : styles.titleHidden
          )}
        >
          <div className={classNames(styles.titleContainer)}>
            <div
              className={classNames(
                " d-flex align-items-center justify-content-between w-100 px-3",
                styles.h100
              )}
            >
              <div />
              <label className={classNames(styles.titleLabel)}>
                {bookDetail?.title}
              </label>
              <BookCloseIcon
                className={classNames(styles.closeIcon2)}
                role="button"
                onClick={(e: any) => {
                  e.stopPropagation();
                  if (handle.active) {
                    setShowActions(false);
                    handle.exit();
                  } else {
                    router.back();
                  }
                }}
              />
            </div>
          </div>
        </div>
        {!showActions && (
          <div
            className={classNames(
              "d-flex align-items-center justify-content-end ",
              styles.actionContainer
            )}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className={classNames(styles.closeContainer)}
              onClick={(e) => {
                e.stopPropagation();
                if (handle.active) {
                  setShowActions(false);
                  handle.exit();
                } else {
                  router.back();
                }
              }}
            >
              <BookCloseIcon className={classNames(styles.closeIcon)} />
            </div>
          </div>
        )}

        {/* ---------------------------------------Pages Section--------------------------------------- */}
        <div
          className={classNames(styles.customContainer, styles.scrollHide)}
          id="book-preview-top-level"
          style={{ height: "100%" }}
        >
          <div
            className={classNames(styles.bookWrapper, "position-relative")}
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(false);
            }}
          >
            <div
              className={classNames(styles.leftbookPages)}
              onClick={handleLeftRotate}
              id="left-book-page"
            />
            {((selectedLang == languageEnum.english && slider !== 0) ||
              (selectedLang == languageEnum.urdu &&
                slider !== bookArr?.length)) && (
              <div
                className={classNames(styles.leftArrowContainer)}
                onClick={handleLeftRotate}
              />
            )}
            <HTMLFlipBook
              key={renderCount}
              ref={bookRef}
              width={bookWidth}
              height={bookHeight}
              className={classNames(styles.bookPages)}
              style={{ zIndex: 1 }}
              startPage={startPageNumberRef.current}
              size={"fixed"}
              minWidth={bookWidth}
              maxWidth={bookWidth}
              minHeight={bookHeight}
              maxHeight={bookHeight}
              drawShadow={true}
              flippingTime={600}
              usePortrait={false}
              startZIndex={0}
              autoSize={false}
              maxShadowOpacity={1}
              showCover={false}
              mobileScrollSupport={false}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={false}
              disableFlipByClick={false}
            >
              {selectedLang === languageEnum.english ||
              (bookArr?.length % 2 === 0 &&
                selectedLang === languageEnum.urdu) ? (
                <Page>
                  {selectedLang == languageEnum.english ? (
                    <div className={classNames(styles.startPage, "gap-4")}>
                      <StartPage
                        kid_role={kid_role}
                        showAssign={showAssign}
                        bookDetail={bookDetail}
                        handleShowConfirmationModal={
                          handleShowConfirmationModal
                        }
                        handleShowReportModal={handleShowReportModal}
                        handleShowAssignModal={handleShowAssignModal}
                        handleBuyHardCopy={handleBuyHardCopy}
                        viewQuiz={viewQuiz}
                        showBuyActions={isPublic ? !isPublic : showBuyActions}
                      />
                    </div>
                  ) : (
                    <div
                      className={classNames(styles.endPage, "gap-3")}
                      role="button"
                      onClick={() => {
                        handleLastPage();
                      }}
                    >
                      <LogoIcon className={classNames(styles.endLogo)} />
                      <div
                        className={classNames(
                          "d-flex flex-column align-items-center justify-content-center"
                        )}
                      >
                        <label className={classNames(styles.endText)}>
                          You have finished, well done!
                        </label>
                        <label className={classNames(styles.endText2)}>
                          Continue reading from our diverse collection.
                        </label>
                      </div>
                    </div>
                  )}
                </Page>
              ) : (
                <></>
              )}
              {bookArr?.map((itm: any, inx: number) => {
                return (
                  <Page key={inx + 1}>
                    <img
                      src={itm?.page_path}
                      className={classNames(
                        styles.imgStyle,
                        !isAccess && itm?.page_no === bookArr?.length
                          ? styles.blurImg
                          : null
                      )}
                      onClick={(e) => {
                        if (bookArr?.length % 2 !== 0) {
                          if (selectedLang === languageEnum.urdu && inx === 0) {
                            handleLastPage();
                          } else if (
                            selectedLang === languageEnum.english &&
                            inx === bookArr?.length - 1
                          ) {
                            handleLastPage();
                          } else {
                            handleClick(itm?.page_no);
                          }
                        } else {
                          handleClick(itm?.page_no);
                        }
                      }}
                    />
                    {!isAccess && itm?.page_no === bookArr?.length ? (
                      <NoAccessPage
                        kid_role={kid_role}
                        bookDetail={bookDetail}
                        key={inx}
                        handleShowConfirmationModal={
                          handleShowConfirmationModal
                        }
                        handleShowAssignModal={handleShowAssignModal}
                        showAssign={showAssign}
                        isPublic={isPublic}
                      />
                    ) : null}
                  </Page>
                );
              })}
              {selectedLang === languageEnum.urdu ||
              (bookArr?.length % 2 === 0 &&
                selectedLang === languageEnum.english) ? (
                <Page>
                  {selectedLang == languageEnum.urdu ? (
                    <div className={classNames(styles.startPage, "gap-4")}>
                      <StartPage
                        kid_role={kid_role}
                        showAssign={showAssign}
                        bookDetail={bookDetail}
                        handleShowConfirmationModal={
                          handleShowConfirmationModal
                        }
                        handleShowReportModal={handleShowReportModal}
                        handleShowAssignModal={handleShowAssignModal}
                        handleBuyHardCopy={handleBuyHardCopy}
                        viewQuiz={viewQuiz}
                        showBuyActions={showBuyActions}
                      />
                    </div>
                  ) : (
                    <div
                      className={classNames(styles.endPage, "gap-3")}
                      role="button"
                      onClick={() => {
                        handleLastPage();
                      }}
                    >
                      <LogoIcon className={classNames(styles.endLogo)} />
                      <div
                        className={classNames(
                          "d-flex flex-column align-items-center justify-content-center"
                        )}
                      >
                        <label className={classNames(styles.endText)}>
                          You have finished, well done!
                        </label>
                        <label className={classNames(styles.endText2)}>
                          Continue reading from our diverse collection.
                        </label>
                      </div>
                    </div>
                  )}
                </Page>
              ) : (
                <></>
              )}
            </HTMLFlipBook>

            {((selectedLang === languageEnum.urdu && slider !== 0) ||
              (selectedLang === languageEnum.english &&
                slider !== bookArr?.length)) && (
              <div
                className={classNames(styles.rightArrowContainer)}
                onClick={handleRightRotate}
              />
            )}

            <div
              className={classNames(styles.rightbookPages)}
              id="right-book-page"
              onClick={handleRightRotate}
            />
          </div>
        </div>

        {/* ---------------------------------------Bottom Section--------------------------------------- */}
        <div
          className={classNames(
            styles.bottomContainer,
            showActions ? styles.sliderShown : styles.sliderHidden
          )}
        >
          <div
            className={classNames(
              styles.arrowContainer,
              showActions ? styles.sliderUpSlide : styles.sliderDownSlide
            )}
          >
            <ChevUpIcon
              className={classNames(
                styles.arrowIcon,
                showActions && styles.rotateVertical
              )}
            />
          </div>
          <div className={classNames(styles.sliderContainer)}>
            <div
              className={classNames(
                styles.sliderSubContainer,
                "d-flex align-items-center px-5 gap-4",
                styles.h100
              )}
            >
              {selectedLang == languageEnum.urdu ? (
                handle?.active ? (
                  <div className={classNames(styles.tooltip)}>
                    <MinimizeIcon
                      className={classNames(styles.fullScreenIcon)}
                      role="button"
                      onClick={() => {
                        setLoading(true);
                        handle.exit();
                      }}
                    />
                    <span className={classNames(styles.tooltiptext)}>
                      Minimize
                    </span>
                  </div>
                ) : (
                  <>
                    <div className={classNames(styles.tooltip)}>
                      <MaximizeIcon
                        className={classNames(
                          styles.fullScreenIcon,
                          styles.tooltip
                        )}
                        role="button"
                        onClick={() => {
                          setLoading(true);
                          handle.enter();
                        }}
                      />
                      <span className={classNames(styles.tooltiptext)}>
                        Full Screen
                      </span>
                    </div>
                  </>
                )
              ) : null}
              <Slider
                progress={slider}
                onChange={(e) => {
                  document.getElementById("myinput")?.blur();
                  if (!isAccess) {
                    if (Number(e.currentTarget.value) < 5) {
                      setSlider(Number(e.currentTarget.value));
                      rotateToPage(Number(e.currentTarget.value));
                    }
                  } else {
                    setSlider(Number(e.currentTarget.value));
                    rotateToPage(Number(e.currentTarget.value));
                  }
                }}
                onInput={(e) => {
                  if (!isAccess) {
                    if (Number(e.currentTarget.value) < 5) {
                      setSlider(Number(e.currentTarget.value));
                    }
                  } else {
                    setSlider(Number(e.currentTarget.value));
                  }
                }}
                max={bookDetail?.total_pages}
                isRightOriented={selectedLang == languageEnum.urdu}
              />
              {selectedLang == languageEnum.english ? (
                handle?.active ? (
                  <div className={classNames(styles.tooltip)}>
                    <MinimizeIcon
                      className={classNames(styles.fullScreenIcon)}
                      role="button"
                      onClick={() => {
                        setLoading(true);
                        handle.exit();
                      }}
                    />
                    <span className={classNames(styles.tooltiptext)}>
                      Minimize
                    </span>
                  </div>
                ) : (
                  <>
                    <div className={classNames(styles.tooltip)}>
                      <MaximizeIcon
                        className={classNames(
                          styles.fullScreenIcon,
                          styles.tooltip
                        )}
                        role="button"
                        onClick={() => {
                          setLoading(true);
                          handle.enter();
                        }}
                      />
                      <span className={classNames(styles.tooltiptext)}>
                        Full Screen
                      </span>
                    </div>
                  </>
                )
              ) : null}
            </div>
            <label className={classNames(styles.pageLabel)}>
              PAGE {slider ? slider : "1"} of {bookDetail?.total_pages}
            </label>
          </div>
        </div>
      </div>
      <Quiz bookDetail={bookDetail} open={showQuiz} handleClose={handleClose} />
      <PurchaseConfirmationModal
        open={confirmationModal}
        handleClose={handleCloseConfirmationModal}
        type={type}
        bookDetail={bookDetail}
        purchaseLoader={purchaseLoader}
        handleBookPurchase={handleBookPurchase}
        wallet={wallet}
        loading={walletloading}
      />
      <InsufficentCoin open={coinModal} handleClose={handleCloseCoinModal} />
      <PurchaseSuccessModal
        show={successModal}
        handleClose={handleCloseSuccessModal}
        purchaseId={bookDetail?.book_access?.purchase_id}
      />
      <ReportModal
        showModal={showReportModal}
        handleClose={handleCloseReportModal}
        type={1}
      />
      <AuthModal show={auth.showModal} activeModal={auth.activeModal} />
      <RatingModal
        show={showRatingModal}
        handleClose={handleCloseRatingModal}
        handleShowQuiz={handleShowQuiz}
      />
      <SelectKids
        show={assignModal}
        handleClose={handleCloseAssignModal}
        book_id={bookDetail?.id}
      />
      <SelectPlanModal show={showModal} />
    </FullScreen>
  );
};

const Page = forwardRef<any, any>((props, ref) => {
  return (
    <div className={classNames(styles.demoPage)} ref={ref}>
      {props.children}
    </div>
  );
});

export default BookView;
