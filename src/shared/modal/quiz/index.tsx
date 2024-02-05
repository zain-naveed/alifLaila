import { useState } from "react";
import { Modal } from "react-bootstrap";
import { classNames } from "shared/utils/helper";
import { quiz } from "./constant";
import Question from "./question";
import QuizResult from "./result";
import styles from "./style.module.scss";
import WelcomeQuiz from "./welcome";

interface Props {
  open: boolean;
  handleClose: () => void;
  bookDetail: any;
}
function Quiz(props: Props) {
  const { open, handleClose, bookDetail } = props;
  const [activeForm, setActiveForm] = useState(quiz.welcome);
  const [quizDetail, setQuizDetail] = useState<any>(null);

  const close = () => {
    handleClose();
    setActiveForm(quiz.welcome);
  };

  return (
    <Modal
      show={open}
      onHide={close}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={classNames(
        activeForm === quiz.welcome
          ? styles.dailogContent
          : styles.dailogContent2
      )}
      className="maxZindex"
    >
      <div
        className={
          activeForm == quiz.question
            ? styles.questionBackground
            : styles.quizBackground
        }
      >
        <Modal.Body className="p-0">
          <FormSwtich
            handleClose={close}
            activeForm={activeForm}
            setActiveForm={setActiveForm}
            quizDetail={quizDetail}
            bookDetail={bookDetail}
            setQuizDetail={setQuizDetail}
          />
        </Modal.Body>
      </div>
    </Modal>
  );
}
interface FormSwtichProps {
  handleClose: () => void;
  activeForm: number;
  setActiveForm: any;
  quizDetail: any;
  bookDetail: any;
  setQuizDetail: (val: any) => void;
}
const FormSwtich = ({
  handleClose,
  activeForm,
  setActiveForm,
  quizDetail,
  bookDetail,
  setQuizDetail,
}: FormSwtichProps) => {
  const [result, setResult] = useState<any>(null);
  const handleSwitchForm = (form: number) => {
    setActiveForm(form);
  };

  switch (activeForm) {
    case quiz.welcome:
      return (
        <WelcomeQuiz
          handleClose={handleClose}
          handleSwitchForm={handleSwitchForm}
          bookDetail={bookDetail}
          setQuizDetail={setQuizDetail}
        />
      );
    case quiz.question:
      return (
        <Question
          bookDetail={bookDetail}
          handleClose={handleClose}
          handleSwitchForm={handleSwitchForm}
          quizDetail={quizDetail}
          setResult={setResult}
        />
      );
    case quiz.result:
      return (
        <QuizResult
          bookDetail={bookDetail}
          result={result}
          handleClose={handleClose}
          handleSwitchForm={handleSwitchForm}
          setQuizDetail={setQuizDetail}
        />
      );
    default:
      return (
        <WelcomeQuiz
          handleClose={handleClose}
          handleSwitchForm={handleSwitchForm}
          bookDetail={bookDetail}
          setQuizDetail={setQuizDetail}
        />
      );
  }
};

export default Quiz;
