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
import { CreateQuestion, GetQuiz } from "shared/services/publisher/quizService";
import { roles } from "shared/utils/enum";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import { addQuestionVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { withError } from "shared/utils/helper";
import { InferGetServerSidePropsType } from "next";

interface InitialValues {
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
    question: "",
    correctAns: "",
    incorrectAns1: "",
    incorrectAns2: "",
    incorrectAns3: "",
  };
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const searchParams = useSearchParams();
  let quizId: string | any = searchParams.get("id");
  const [quizDetail, setQuizDetail] = useState<any | null>({});
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const fetchQuiz = () => {
    GetQuiz(quizId)
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addQuestionVS,
    onSubmit: (value) => {
      setLoading(true);

      var formData = new FormData();
      formData.append("quiz_id", quizId);
      formData.append("question", value.question);
      formData.append("answers[]", value.correctAns);
      formData.append("answers[]", value.incorrectAns1);
      if (value.incorrectAns2) {
        formData.append("answers[]", value.incorrectAns2);
      }
      if (value.incorrectAns2 && value.incorrectAns3) {
        formData.append("answers[]", value.incorrectAns3);
      }

      CreateQuestion(formData)
        .then(({ data: { status, message } }) => {
          if (status) {
            toastMessage("success", message);
            formik.resetForm();
            router.push(
              partnersPanelConstant.quiz.list.path.replace(":id", quizId)
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
  const { handleChange, handleSubmit, values, touched, errors } = formik;

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

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

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
        <Heading heading="Question" headingStyle={styles.bookHeading} />
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
