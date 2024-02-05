import {
  GoodJobIcon,
  HardWorkIcon,
  KeepReadIcon,
  WellDoneIcon,
  reviewCloseImage,
} from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import ModalHeader from "shared/components/modalHeader";
import { quiz } from "../constant";
import styles from "./style.module.scss";
import { getQuiz } from "shared/services/kid/quizService";
import { useState } from "react";
import { toastMessage } from "shared/components/common/toast";
import { useRouter } from "next/router";

interface Props {
  handleClose: () => void;
  handleSwitchForm: (form: number) => void;
  result: any;
  bookDetail: any;
  setQuizDetail: (val: any) => void;
}

function QuizResult(props: Props) {
  const { handleClose, handleSwitchForm, result, bookDetail, setQuizDetail } =
    props;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <>
      <div className={classNames(styles.quizResultCont)}>
        <ModalHeader
          close={() => {
            handleClose();
            router.back();
          }}
          isFirst={true}
          headerStyle={styles.header}
          image={reviewCloseImage}
          closeImageStyle={styles.closeImage}
        />
        <div className={classNames("d-flex flex-column align-items-center")}>
          {Number(result?.score) <= 33 ? (
            <HardWorkIcon className={styles.Icon} />
          ) : Number(result?.score) <= 60 ? (
            <KeepReadIcon className={styles.Icon} />
          ) : Number(result?.score) <= 80 ? (
            <WellDoneIcon className={styles.Icon} />
          ) : (
            <GoodJobIcon className={styles.Icon} />
          )}
          <label className={classNames(styles.percentage)}>
            {String(Math.ceil(Number(result?.score))) + "%"}
          </label>
        </div>
      </div>
      <div className={classNames(styles.cotentContainer)}>
        <div className={classNames(styles.correct, "mt-2")}>
          {result?.correct_answers} of {result?.total_questions} correct
        </div>
        <span className={classNames(styles.para, "mb-3")}>
          {result?.message}
        </span>
        <div className={classNames("d-flex align-items-center gap-3 mb-4")}>
          <CustomButton
            onClick={getQuizs}
            title="Retake Quiz"
            containerStyle={styles.retake}
            loading={loading}
            disabled={loading}
          />
          <CustomButton
            title="Done"
            containerStyle={styles.done}
            onClick={handleClose}
          />
        </div>
      </div>
    </>
  );
}

export default QuizResult;
