import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import AnswerLoader from "shared/loader/pageLoader/kid/quiz/answer";
import QuestionLoader from "shared/loader/pageLoader/kid/quiz/question";
import {
  atemptedQuiz,
  getQuizQuestion,
  getQuizResult,
} from "shared/services/kid/quizService";
import { isEnglishString } from "shared/utils/helper";
import { quiz } from "../constant";
import styles from "./style.module.scss";

interface Props {
  handleClose: () => void;
  handleSwitchForm: (form: number) => void;
  quizDetail: any;
  setResult: (val: any) => void;
  bookDetail: any;
}

function Question(props: Props) {
  const { handleClose, handleSwitchForm, quizDetail, setResult, bookDetail } =
    props;
  const router = useRouter();
  const [allOption, setAllOption] = useState<any>([]);
  const [question, setQuestion] = useState<string>("");
  const [selectAns, setSelectAns] = useState<any>(null);
  const [saveQustnAns, setSaveQustnAns] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [totalQuestion, setTotalQuestion] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const handleSelectAns = (ans: any, selectedIndx: number) => {
    let cloneAns = { ...ans };
    cloneAns["index"] = selectedIndx;
    setSelectAns(cloneAns);
  };
  const handleAllQuestion = () => {
    setLoading(true);
    getQuizQuestion(quizDetail?.quiz_id, page)
      .then(
        ({
          data: {
            data: { total, data },
          },
        }) => {
          let option = data[0]?.answers
            .map((item: any, inx: number) => {
              if (inx === 0) {
                return { ...item, isCorrect: true };
              } else {
                return { ...item, isCorrect: false };
              }
            })
            .map((value: any) => ({ value, sort: Math.random() }))
            .sort((a: any, b: any) => a.sort - b.sort)
            .map(({ value }: any) => value);
          setQuestion(data[0]?.content);
          setAllOption(option);
          setTotalQuestion(total);
        }
      )
      .catch((err) => {})
      .finally(() => setLoading(false));
  };

  const saveQuizStats = (ansAll: any) => {
    setSubmitLoading(true);
    let quizAttempt = {
      quiz_id: quizDetail?.quiz_id,

      attempt: ansAll.map((item: any) => {
        return {
          answer_id: item.answer_id,
          question_id: item.question_id,
        };
      }),
    };
    atemptedQuiz(quizAttempt)
      .then(({ data: { data, message, status, statusCode } }) => {
        if (status) {
          handleGetResult();
        } else if (statusCode === 304) {
          // quiz score is not improved
          handleClose();
          router.back();
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleGetResult = () => {
    getQuizResult(bookDetail?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setResult(data);
          handleSwitchForm(quiz.result);
          setSelectAns(null);
          setSaveQustnAns([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setSubmitLoading(false);
      });
  };

  const handleSubmit = () => {
    if (selectAns) {
      let cloneSaveQustnAns = [...saveQustnAns];
      let obj = {
        question_id: selectAns?.question_id,
        isCorrect: selectAns?.isCorrect,
        answer_id: selectAns?.id,
      };
      cloneSaveQustnAns.push(obj);
      setSaveQustnAns(cloneSaveQustnAns);
      if (totalQuestion != page) {
        setPage(page + 1);
        setSelectAns(null);
      } else {
        saveQuizStats(cloneSaveQustnAns);
      }
    } else {
      toastMessage("error", "Please select an answer");
    }
  };

  useEffect(() => {
    if (quizDetail?.quiz_id) {
      handleAllQuestion();
    }
  }, [page, quizDetail?.quiz_id]);
  return (
    <div className={classNames(styles.questionHeaderContainer, "my-4")}>
      <div
        className={classNames(
          "d-flex align-items-start justify-content-between mb-4"
        )}
      >
        {loading ? (
          <QuestionLoader />
        ) : (
          <Heading
            heading={question}
            headingStyle={
              question === ""
                ? styles.question
                : isEnglishString(question)
                ? styles.question
                : styles.urduQuestion
            }
          />
        )}
        <ModalHeader
          close={() => {
            handleClose();
            router.back();
          }}
          isFirst={true}
          headerStyle={styles.headerStyle}
        />
      </div>
      {loading ? (
        <AnswerLoader iteration={4} />
      ) : (
        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-start w-100 gap-2"
          )}
        >
          {allOption?.map((item: any, index: number) => {
            return (
              <div
                key={`ans-item-${index}`}
                className={classNames(
                  styles.answerItem,
                  selectAns && selectAns?.index == index && styles.selectAns,
                  "pointer w-100",
                  isEnglishString(question)
                    ? "justify-content-start"
                    : "justify-content-end"
                )}
                onClick={() => handleSelectAns(item, index)}
              >
                <label className={classNames(styles.answerText)}>
                  {item.content}
                </label>
              </div>
            );
          })}
        </div>
      )}

      <div className={classNames(styles.footerContainer)}>
        <Dot totalQuestion={totalQuestion} isActive={page - 1} />
        <CustomButton
          disabled={submitLoading || loading}
          title="Submit"
          onClick={handleSubmit}
          loading={submitLoading}
          containerStyle={classNames(styles.customBtnStyle)}
        />
      </div>
    </div>
  );
}
interface DotProps {
  totalQuestion: number;
  isActive: number;
}
const Dot = (props: DotProps) => {
  const { isActive, totalQuestion } = props;
  return (
    <div className="d-flex">
      {Array.from(Array(totalQuestion).keys()).map((item, index) => {
        return (
          <div
            key={`dot-${index}`}
            className={classNames(
              styles.dot,
              isActive == index ? styles.isActive : ""
            )}
          ></div>
        );
      })}
    </div>
  );
};

export default Question;
