import { CorrectAnsIcon, IncorrectAnsIcon } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import {
  GetQuiz,
  UpdateQuestion,
  getQuestion,
} from "shared/services/publisher/quizService";
import { roles } from "shared/utils/enum";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import { updateQuestionVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { withError } from "shared/utils/helper";
import { InferGetServerSidePropsType } from "next";

interface InitialValues {
  quiz_id: string;
  question: string;
  correctAns: string;
  incorrectAns1: string;
  incorrectAns2: string;
  incorrectAns3: string;
}

function AddQuestion({
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const initialValues: InitialValues = {
    quiz_id: "",
    question: "",
    correctAns: "",
    incorrectAns1: "",
    incorrectAns2: "",
    incorrectAns3: "",
  };
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  let questionId: string | any = searchParams.get("id");
  const [questionDetail, setQuestionDetail] = useState<any | null>({});
  const [loading, setLoading] = useState(false);
  const [quizDetail, setQuizDetail] = useState<any | null>({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: updateQuestionVS,
    onSubmit: (value) => {
      setLoading(true);

      var formData = new FormData();
      formData.append("quiz_id", value.quiz_id);
      formData.append("question_id", questionId);
      formData.append("question", value.question);
      formData.append("answers[]", value.correctAns);
      formData.append("answers[]", value.incorrectAns1);
      if (value.incorrectAns2) {
        formData.append("answers[]", value.incorrectAns2);
      }
      if (value.incorrectAns2 && value.incorrectAns3) {
        formData.append("answers[]", value.incorrectAns3);
      }

      UpdateQuestion(formData)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            toastMessage("success", message);
            formik.resetForm();

            router.push(
              partnersPanelConstant.quiz.list.path.replace(":id", value.quiz_id)
            );
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          var errors = err.response.data.errors;
          if (errors) {
            for (var key in errors) {
              toastMessage("error", errors[key][0]);
            }
          }
        })
        .finally(() => setLoading(false));
    },
  });
  const {
    handleChange,
    handleSubmit,
    handleReset,
    values,
    touched,
    errors,
    setFieldValue,
  } = formik;

  const fetchQuestion = () => {
    getQuestion(questionId)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setFieldValue("quiz_id", data?.quiz_id);
          setFieldValue("question", data?.content);
          setFieldValue("correctAns", data?.answers?.[0]?.content);
          setFieldValue("incorrectAns1", data?.answers?.[1]?.content);
          setFieldValue("incorrectAns2", data?.answers?.[2]?.content);
          setFieldValue("incorrectAns3", data?.answers?.[3]?.content);
          setQuestionDetail(data);
          fetchQuiz(data?.quiz_id);
        }
      })
      .catch((err) => {
        var errors = err.response.data.errors;
        if (errors) {
          for (var key in errors) {
            toastMessage("error", errors[key][0]);
          }
        }
      });
  };

  const fetchQuiz = (id: any) => {
    GetQuiz(id)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setQuizDetail(data);
        }
      })
      .catch((err) => {
        var errors = err.response.data.errors;
        if (errors) {
          for (var key in errors) {
            toastMessage("error", errors[key][0]);
          }
        }
      });
  };

  useEffect(() => {
    if (questionDetail.id == undefined && questionId) {
      fetchQuestion();
    }
  }, [fetchQuestion]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "MY BOOKS",
            action: () => {
              router.push(partnersPanelConstant.book.path);
            },
          },
          {
            title: "Add New",
            action: () => {
              router.push(
                partnersPanelConstant.bookPreview.path.replace(
                  ":id",
                  quizDetail?.book_id
                )
              );
            },
          },
          {
            title: "Add Quiz",
          },
        ],
      })
    );
  }, [quizDetail]);

  return (
    <DashboardWraper
      navigationItems={
        role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      <div className={classNames(styles.quizContainer)}>
        <Heading
          heading="Question"
          headingStyle={classNames(styles.bookHeading, "mb-3")}
        />
        <div className={styles.quizMain}>
          <CustomInput
            label="Question"
            required={true}
            value={values.question}
            error={touched.question && errors.question ? errors.question : ""}
            onChange={handleChange("question")}
            placeholder={"What are the names of the main characters?"}
          />
          <Answer
            Icon={CorrectAnsIcon}
            value={values.correctAns}
            error={
              touched.correctAns && errors.correctAns ? errors.correctAns : ""
            }
            onChange={handleChange("correctAns")}
            placeholder="Correct Answer"
          />
          <Answer
            Icon={IncorrectAnsIcon}
            value={values.incorrectAns1}
            error={
              touched.incorrectAns1 && errors.incorrectAns1
                ? errors.incorrectAns1
                : ""
            }
            onChange={handleChange("incorrectAns1")}
            placeholder="Incorrect Answer"
          />
          <Answer
            Icon={IncorrectAnsIcon}
            value={values.incorrectAns2}
            error={
              touched.incorrectAns2 && errors.incorrectAns2
                ? errors.incorrectAns2
                : ""
            }
            onChange={handleChange("incorrectAns2")}
            placeholder="Incorrect Answer (Optional)"
            iconStyle={styles.iconDfault}
          />
          <Answer
            Icon={IncorrectAnsIcon}
            value={values.incorrectAns3}
            error={
              touched.incorrectAns3 && errors.incorrectAns3
                ? errors.incorrectAns3
                : ""
            }
            onChange={handleChange("incorrectAns3")}
            placeholder="Incorrect Answer (Optional)"
            iconStyle={styles.iconDfault}
          />
        </div>

        <CustomButton
          title="Save"
          loading={loading}
          containerStyle={styles.customButton}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </DashboardWraper>
  );
}
interface AnswerProps extends React.HTMLProps<HTMLInputElement> {
  error: string;
  Icon: any;
  iconStyle: string;
}
const Answer = ({
  value,
  error,
  onChange,
  placeholder,
  Icon,
  iconStyle,
}: Partial<AnswerProps>) => {
  return (
    <div className="d-flex align-items-center mb-3 ">
      <Icon className={`me-3 ${iconStyle ? iconStyle : ""}`} />
      <CustomInput
        value={value}
        error={error}
        notRequiredMargin={true}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      user: req?.cookies?.user,
    },
  };
});

export default AddQuestion;
