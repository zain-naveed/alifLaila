import { EditIcon, PlusIcon, RemoveConfirmationIcon, TrashIcon } from "assets";
import { InferGetServerSidePropsType } from "next";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import ConfirmationModal from "shared/modal/confimation";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import {
  DeleteQuestion,
  DeleteQuiz,
  GetQuiz,
  publishQuiz,
} from "shared/services/publisher/quizService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import { roles } from "shared/utils/enum";

function AllQuiz({
  user,
  quizRes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const searchParams = useSearchParams();
  let quizId: string | any = searchParams.get("id");
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;

  const [quizDetail, setQuizDetail] = useState<any | null>(quizRes?.data);
  const [deleteId, setDeleteId] = useState<any>(-1);
  const [deleteType, setDeleteType] = useState<any>(-1);
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [pulishLoading, setPublishLoading] = useState<boolean>(false);
  const handleClose = () => setOpen(!open);

  const getQuizDetails = () => {
    if (quizId) {
      GetQuiz(quizId)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            setQuizDetail(data);
          }
        })
        .catch((err) => {});
    }
  };

  const editQuestion = (id: string) => {
    router.push(
      partnersPanelConstant.quiz.updateQuestion.path.replace(":id", id)
    );
  };
  const addQuestion = (id: string) => {
    router.push(partnersPanelConstant.quiz.question.path.replace(":id", id));
  };

  const editQuiz = (id: string) => {
    router.push(partnersPanelConstant.quiz.update.path.replace(":id", id));
  };

  const handleDelete = () => {
    if (deleteType == "quiz") {
      deleteQuiz(deleteId);
    } else if (deleteType == "question") {
      deleteQuestion(deleteId);
    }
  };

  const deleteQuestion = (id: string) => {
    setDelLoading(true);
    DeleteQuestion({
      quiz_id: quizId,
      question_id: id,
    })
      .then(({ data: { status, data, message } }) => {
        if (status) {
          toastMessage("success", message);
          getQuizDetails();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.message);
      })
      .finally(() => {
        handleClose();
        setDelLoading(false);
      });
  };

  const deleteQuiz = (id: string) => {
    setDelLoading(true);
    DeleteQuiz(id)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          toastMessage("success", message);
          router.push(partnersPanelConstant.book.path);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.message);
      })
      .finally(() => {
        handleClose();
        setDelLoading(false);
      });
  };

  const publishQuizQus = () => {
    setPublishLoading(true);
    publishQuiz(quizId)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          toastMessage("success", message);
          router.push(partnersPanelConstant.book.path);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.message);
      })
      .finally(() => setPublishLoading(false));
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
  }, []);

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
      <div className={classNames(styles.quizWraper)}>
        <div
          className={classNames(
            "d-flex justify-content-between",
            styles.quizheader
          )}
        >
          <Heading
            heading="Quiz Title"
            headingStyle={classNames(styles.quizHeading)}
          />
          <div
            className={classNames(styles.trashContainer, "pointer")}
            onClick={() => {
              setDeleteId(quizDetail?.id);
              setDeleteType("quiz");
              setOpen(!open);
            }}
          >
            <TrashIcon />
            <span>Delete This Quiz</span>
          </div>
        </div>
        <div className={classNames(styles.quizMain)}>
          <CustomInput
            label="Title"
            required={true}
            defaultValue={quizDetail?.title}
            readOnly
          />
          <div className="d-flex justify-content-end">
            <EditIcon
              className="d-flex ms-auto pointer"
              onClick={() => editQuiz(quizDetail?.id)}
            />
          </div>
        </div>
      </div>
      {/* Edit Questions */}
      <div className={classNames(styles.quizWraper, styles.quizTopMargin)}>
        <div className={styles.quizheader}>
          <Heading heading="Test Question" headingStyle={styles.quizHeading} />
          <div className={classNames(styles.addQuestionWrapper)}>
            <div
              className={classNames(styles.addQuestion, "pointer")}
              onClick={() => {
                addQuestion(quizId);
              }}
            >
              <PlusIcon />

              <span>Add More Question</span>
            </div>
          </div>
        </div>
        {quizDetail?.questions?.map(
          (
            item: {
              id: string;
              content: string;
            },
            inx: number
          ) => {
            return (
              <div
                className={classNames(styles.quizMain, inx ? "mt-3" : "")}
                key={`${item.id}-question-${inx}`}
              >
                <CustomInput
                  label="Title"
                  defaultValue={item?.content}
                  required={true}
                />
                <div className="d-flex justify-content-end">
                  <EditIcon
                    className="me-2 pointer"
                    onClick={() => editQuestion(item?.id)}
                  />
                  <TrashIcon
                    className="pointer"
                    onClick={() => {
                      setDeleteId(item?.id);
                      setDeleteType("question");
                      setOpen(!open);
                    }}
                  />
                </div>
              </div>
            );
          }
        )}

        <CustomButton
          title="Publish"
          loading={pulishLoading}
          containerStyle={styles.publishButton}
          onClick={publishQuizQus}
        />

        {open ? (
          <ConfirmationModal
            ImageSrc={RemoveConfirmationIcon}
            heading={
              deleteType == "question"
                ? "Are you sure you want to delete question?"
                : "Are you sure you want to quiz?"
            }
            open={open}
            handleClose={handleClose}
            handleSubmit={handleDelete}
            loading={delLoading}
          />
        ) : (
          ""
        )}
      </div>
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const resp = await fetch(
    BaseURL + endpoint + Endpoint.partner.quiz.getQuiz + params?.id,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const quizRes = await resp.json();

  return { props: { user: req?.cookies?.user, quizRes } };
});

export default AllQuiz;
