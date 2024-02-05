import {
  AssignBookWhitekIcon,
  BorrowBookWhiteIcon,
  BuyBookWhiteIcon,
  FlagIcon,
  HeartEmpty,
  HeartFill,
  RatingStar2Icon,
  ShopBagIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
} from "shared/routes/routeConstant";
import { addBookFav, removeBookFav } from "shared/services/kid/bookService";
import { GetQuizByBook } from "shared/services/publisher/quizService";
import { kidAccountRole, languageEnum, roles } from "shared/utils/enum";
import styles from "./style.module.scss";
import PublishingHouse from "../publishingHouse";

interface StartPage {
  bookDetail: any;
  handleShowConfirmationModal: (val: any) => void;
  handleShowReportModal: () => void;
  showAssign?: boolean;
  handleShowAssignModal?: () => void;
  handleBuyHardCopy?: () => void;
  viewQuiz?: boolean;
  showBuyActions: boolean;
  kid_role: any;
}

const StartPage = ({
  bookDetail,
  handleShowConfirmationModal,
  handleShowReportModal,
  showAssign,
  handleShowAssignModal,
  handleBuyHardCopy,
  viewQuiz,
  showBuyActions,
  kid_role,
}: StartPage) => {
  const router = useRouter();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const [isFavourite, setIsFavourite] = useState<boolean>(
    bookDetail?.is_favourite || false
  );
  const [quizLoading, setQuizLoading] = useState<boolean>(false);

  const handleAddFavourite = () => {
    setIsFavourite(true);
    let obj = {
      book_id: bookDetail?.id,
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

  const handleRemoveFavourite = () => {
    setIsFavourite(false);
    let obj = {
      book_id: bookDetail?.id,
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

  const getQuizDetails = () => {
    setQuizLoading(true);
    GetQuizByBook(bookDetail?.id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data.id) {
            router.push(
              partnersPanelConstant.quiz.list.path.replace(":id", data.id)
            );
          } else {
            router.push(
              partnersPanelConstant.quiz.create.path.replace(
                ":id",
                bookDetail?.id
              )
            );
          }
        } else {
          router.push(
            partnersPanelConstant.quiz.create.path.replace(
              ":id",
              bookDetail?.id
            )
          );
        }
      })
      .catch((err) => {})
      .finally(() => setQuizLoading(false));
  };

  return (
    <>
      <div className={classNames(styles.bookDetailWrapper)}>
        <div className={classNames(styles.bookDetailContainer, "pe-2")}>
          <div
            className={classNames(
              "d-flex align-items-start justify-content-between w-100 gap-2"
            )}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-start"
              )}
            >
              <label className={classNames(styles.bookTitle)}>
                {bookDetail?.title}
              </label>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between gap-2"
                )}
              >
                <label className={classNames(styles.authorName)}>
                  {bookDetail?.book_author?.name}
                </label>
              </div>
            </div>

            {showBuyActions ? (
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between gap-2 mt-2"
                )}
              >
                <FlagIcon
                  className={classNames(styles.flagIcon)}
                  role="button"
                  onClick={handleShowReportModal}
                />
                {isFavourite ? (
                  <Image
                    src={HeartFill}
                    alt="favourite-icon"
                    className={classNames(styles.heartIcon)}
                    role="button"
                    onClick={handleRemoveFavourite}
                  />
                ) : (
                  <Image
                    src={HeartEmpty}
                    alt="favourite-icon"
                    className={classNames(styles.heartIcon)}
                    role="button"
                    onClick={handleAddFavourite}
                  />
                )}
              </div>
            ) : null}
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justufy-content-start gap-2"
            )}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-start"
              )}
            >
              <label
                className={classNames(
                  styles.authorName,
                  styles.primary,
                  styles.ratingTitle
                )}
              >
                Experts Ratings
              </label>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between gap-2"
                )}
              >
                <RatingStar2Icon className={classNames(styles.starIcon)} />
                <label className={classNames(styles.ratingLabel)}>
                  {bookDetail?.rating
                    ? Number(bookDetail?.rating).toFixed(1)
                    : 0}{" "}
                  out of 10
                </label>
              </div>
            </div>
          </div>
          <label className={classNames(styles.descriptionContainer)}>
            {bookDetail?.description
              ?.split("\n")
              .map((i: string, ii: number) => {
                return (
                  <div
                    key={ii}
                    className={classNames(
                      languageEnum.urdu === bookDetail?.language?.name
                        ? styles.urduDesc
                        : styles.descriptionLabel
                    )}
                  >
                    {i}
                  </div>
                );
              })}
          </label>
        </div>
      </div>
      <div className={classNames(styles.bookStatsInfoContainer)}>
        <div
          className={classNames(
            "d-flex  align-items-start  justify-content-start gap-4 gap-lg-5"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between gap-1"
            )}
          >
            <label className={classNames(styles.stateTitle)}>Age Range</label>
            <label className={classNames(styles.descriptionLabel)}>
              {bookDetail?.age_range?.min}-{bookDetail?.age_range?.max}
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between gap-1"
            )}
          >
            <label className={classNames(styles.stateTitle, styles.secondary)}>
              No. of Pages
            </label>
            <label className={classNames(styles.descriptionLabel)}>
              {bookDetail?.total_pages}
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between gap-1"
            )}
          >
            <label className={classNames(styles.stateTitle, styles.yellow)}>
              Quiz
            </label>
            <label className={classNames(styles.descriptionLabel)}>
              {bookDetail?.is_quiz ? "Yes" : "No"}
            </label>
          </div>
        </div>
        <div
          className={classNames(
            "d-flex  align-items-start justify-content-start gap-4 gap-lg-5"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between gap-1"
            )}
          >
            <label className={classNames(styles.stateTitle, styles.green)}>
              Language
            </label>
            <label className={classNames(styles.descriptionLabel)}>
              {bookDetail?.language?.name}
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between gap-1"
            )}
          >
            <label className={classNames(styles.stateTitle)}>Genre</label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-1 flex-wrap"
              )}
            >
              {bookDetail?.genres?.map((itm: any, inx: any) => {
                return (
                  <label
                    className={classNames(styles.descriptionLabel)}
                    key={inx}
                  >
                    {itm?.name}
                    {inx !== bookDetail?.genres?.length - 1 ? `,` : ""}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className={classNames(styles.publisherInfoContainer)}>
        <img
          src={
            bookDetail?.partner?.role === roles.author
              ? bookDetail?.partner?.profile_picture
              : bookDetail?.partner?.publishing_logo
              ? bookDetail?.partner?.publishing_logo
              : defaultAvatar.src
          }
          alt="publishing-house-pic"
          className={classNames(styles.avatar)}
          height={40}
          width={40}
          role="button"
          onClick={(e) => {
            if (role === roles.reader) {
              router.push(
                kidPanelConstant.publisher.path.replace(
                  ":id",
                  bookDetail?.publisher?.id
                )
              );
            } else if (role === roles.parent) {
              router.push(
                parentPanelConstant.publisher.path.replace(
                  ":id",
                  bookDetail?.publisher?.id
                )
              );
            }
          }}
        />
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-start "
          )}
        >
          <label
            className={classNames(styles.publisherName)}
            role="button"
            onClick={() => {
              if (role === roles.reader) {
                if (bookDetail?.partner?.role === roles.author) {
                  router.push(
                    kidPanelConstant.author.path.replace(
                      ":id",
                      bookDetail?.partner?.id
                    )
                  );
                } else {
                  router.push(
                    kidPanelConstant.publisher.path.replace(
                      ":id",
                      bookDetail?.partner?.id
                    )
                  );
                }
              } else if (role === roles.parent) {
                if (bookDetail?.partner?.role === roles.author) {
                  router.push(
                    parentPanelConstant.author.path.replace(
                      ":id",
                      bookDetail?.partner?.id
                    )
                  );
                } else {
                  router.push(
                    parentPanelConstant.publisher.path.replace(
                      ":id",
                      bookDetail?.partner?.id
                    )
                  );
                }
              }
            }}
          >
            <PublishingHouse item={bookDetail} />
          </label>
          <label className={classNames(styles.publisherTag)}>
            {bookDetail?.partner?.role === roles.author
              ? "Author"
              : "Publication house"}
          </label>
        </div>
      </div>
      {showBuyActions ? (
        <>
          {!bookDetail?.book_access ? (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-center gap-2 w-100"
              )}
            >
              {bookDetail?.buy_coins && kid_role !== kidAccountRole.family && (
                <CustomButton
                  title={`Buy For ${
                    bookDetail?.buy_coins ? bookDetail?.buy_coins : 0
                  } Coins`}
                  Icon={BuyBookWhiteIcon}
                  iconStyle={classNames(styles.btnIcon)}
                  IconDirction="left"
                  containerStyle={classNames(styles.btnContainer)}
                  onClick={() => {
                    handleShowConfirmationModal(2);
                  }}
                />
              )}
              {bookDetail?.borrow_coins && (
                <CustomButton
                  title={`Borrow For ${
                    bookDetail?.borrow_coins ? bookDetail?.borrow_coins : 0
                  } Coins`}
                  Icon={BorrowBookWhiteIcon}
                  IconDirction="left"
                  iconStyle={classNames(styles.btnIcon)}
                  containerStyle={classNames(
                    styles.btnContainer,
                    styles.greenBtn
                  )}
                  onClick={() => {
                    handleShowConfirmationModal(1);
                  }}
                />
              )}
            </div>
          ) : bookDetail?.book_access?.type !== 2 &&
            kid_role !== kidAccountRole.family ? (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-center gap-2 w-100"
              )}
            >
              <CustomButton
                title={`Buy For ${
                  bookDetail?.buy_coins ? bookDetail?.buy_coins : 0
                } Coins`}
                Icon={BuyBookWhiteIcon}
                iconStyle={classNames(styles.btnIcon)}
                IconDirction="left"
                containerStyle={classNames(styles.btnContainer)}
                onClick={() => {
                  handleShowConfirmationModal(2);
                }}
              />
            </div>
          ) : null}
        </>
      ) : null}

      {showAssign ? (
        <CustomButton
          title={`Assign Book`}
          Icon={AssignBookWhitekIcon}
          iconStyle={classNames(styles.btnIcon)}
          IconDirction="left"
          containerStyle={classNames(styles.assignBtnContainer)}
          onClick={handleShowAssignModal}
        />
      ) : null}

      {viewQuiz ? (
        <CustomButton
          title={`View Quiz`}
          containerStyle={classNames(styles.assignBtnContainer)}
          loading={quizLoading}
          onClick={() => getQuizDetails()}
        />
      ) : null}

      {bookDetail?.is_hard_copy && showBuyActions ? (
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center gap-2"
          )}
          role="button"
          onClick={handleBuyHardCopy}
        >
          <ShopBagIcon className={classNames(styles.btnIcon)} />
          <label className={classNames(styles.hardCopyLabel)} role="button">
            Get Printed Book
          </label>
        </div>
      ) : null}
    </>
  );
};

export default StartPage;
