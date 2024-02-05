import { Badges, QuizFinishIcon, QuizStartIcon } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import { getQuiz } from "shared/services/kid/quizService";
import { languageEnum } from "shared/utils/enum";
import { quiz } from "../constant";
import styles from "./style.module.scss";
interface Props {
  handleClose: () => void;
  handleSwitchForm: (form: number) => void;
  bookDetail: any;
  setQuizDetail: (val: any) => void;
}

function WelcomeQuiz(props: Props) {
  const router = useRouter();
  const { handleClose, handleSwitchForm, bookDetail, setQuizDetail } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const badges = [1, 2, 3];
  const [randomIndex, setRandomIndex] = useState<number>(0);

  const getQuizs = () => {
    setLoading(true);
    getQuiz(bookDetail?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setQuizDetail(data);
          handleSwitchForm(quiz.question);
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * badges.length));
  }, []);
  return (
    <>
      <ModalHeader
        close={() => {
          handleClose();
          router.back();
        }}
        isFirst={true}
        headerStyle={styles.headerStyle}
      />
      <div className={classNames("d-flex flex-column align-items-center mt-2")}>
        <div className={classNames("position-relative w-100 px-3 d-flex")}>
          <img
            src={bookDetail?.cover_photo}
            alt="quizImage"
            className={styles.quizImage}
            height={1120}
            width={1200}
          />

          {randomIndex === 0 ? (
            <Badges.GreatJob className={classNames(styles.badgeIcon)} />
          ) : randomIndex === 1 ? (
            <Badges.WellDone className={classNames(styles.badgeIcon2)} />
          ) : (
            <Badges.GoodJob className={classNames(styles.badgeIcon3)} />
          )}
        </div>

        <div
          className={classNames(
            "d-flex flex-column align-items-start px-3 mt-3 w-100"
          )}
        >
          <label className={classNames(styles.quizHeading)}>
            {bookDetail?.quiz?.title
              ? bookDetail?.quiz?.title
              : bookDetail?.title}
          </label>

          <p
            className={classNames(
              !bookDetail?.quiz?.description &&
                bookDetail?.language?.name === languageEnum.urdu
                ? styles.urduDesc
                : styles.quizParagraph,
              "mt-2"
            )}
          >
            {bookDetail?.quiz?.description
              ? bookDetail?.quiz?.description
              : bookDetail?.description}
          </p>
          <div
            className={classNames(
              "d-flex flex-column align-items-center gap-2 w-100 mb-4"
            )}
          >
            {bookDetail?.is_quiz ? (
              <CustomButton
                onClick={getQuizs}
                title="Start Quiz"
                IconDirction="left"
                iconStyle={styles.quizBtnIcon}
                Icon={QuizStartIcon}
                containerStyle={classNames(styles.quizStart, "gap-2")}
                loading={loading}
                disabled={loading}
              />
            ) : null}
            <CustomButton
              title="Finish Book"
              IconDirction="left"
              iconStyle={styles.quizBtnIcon}
              Icon={QuizFinishIcon}
              containerStyle={classNames(styles.quizFinish, "gap-2")}
              onClick={() => {
                handleClose();
                router.back();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomeQuiz;
