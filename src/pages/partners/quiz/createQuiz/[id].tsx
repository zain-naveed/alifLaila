import classNames from "classnames";
import { useFormik } from "formik";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomTextArea from "shared/components/common/customTextArea";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { getPubliserBookDetail } from "shared/services/publisher/bookService";
import { CreateQuiz } from "shared/services/publisher/quizService";
import { roles } from "shared/utils/enum";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import { crateQuizVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { withError } from "shared/utils/helper";
import { InferGetServerSidePropsType } from "next";

interface InitialValues {
  quizTitle: string;
  quizDescr: string;
}
function QuizCreate({
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const initialValues: InitialValues = {
    quizTitle: "",
    quizDescr: "",
  };
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const searchParams = useSearchParams();
  let bookId: string | any = searchParams.get("id");
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [bookDetail, setBookDetail] = useState<any | null>({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: crateQuizVS,
    onSubmit: (value) => {
      setLoading(true);

      CreateQuiz({
        book_id: bookId,
        title: value.quizTitle,
        description: value.quizDescr,
      })
        .then(({ data: { status, data, message } }) => {
          if (status) {
            toastMessage("success", message);

            router.push(
              partnersPanelConstant.quiz.question.path.replace(":id", data.id)
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
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  const getBookDetail = () => {
    if (bookId) {
      getPubliserBookDetail(bookId)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            setFieldValue("quizTitle", data.title);
            setBookDetail(data);
          }
        })
        .catch((err) => {});
    }
  };

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
                  bookDetail?.id
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
  }, [bookDetail]);

  useEffect(() => {
    if (bookId) {
      getBookDetail();
    }
  }, [bookId]);

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
          heading="Quiz Title"
          headingStyle={classNames(styles.bookHeading, "mb-3")}
        />
        <div className={styles.quizMain}>
          <CustomInput
            label="Title"
            required={true}
            value={values.quizTitle}
            error={
              touched.quizTitle && errors.quizTitle ? errors.quizTitle : ""
            }
            onChange={handleChange("quizTitle")}
            placeholder={"What are the names of the main characters"}
          />
          <CustomTextArea
            label="Decription"
            required={false}
            value={values.quizDescr}
            error={
              touched.quizDescr && errors.quizDescr ? errors.quizDescr : ""
            }
            onChange={handleChange("quizDescr")}
            placeholder={"Enter description here"}
          />
        </div>

        <CustomButton
          title="Create Quiz"
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

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      user: req?.cookies?.user,
    },
  };
});

export default QuizCreate;
