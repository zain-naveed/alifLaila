import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import Rating from "shared/components/common/rating";
import { toastMessage } from "shared/components/common/toast";
import { addRating } from "shared/services/kid/bookService";
import { classNames } from "shared/utils/helper";
import { WriteReviewVS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface Props {
  show: boolean;
  handleClose: () => void;
  handleShowQuiz: () => void;
}
interface WriteReviewInterface {
  rating: number;
}

function RatingModal(props: Props) {
  const initialValues: WriteReviewInterface = {
    rating: 0,
  };
  const { handleClose, show, handleShowQuiz } = props;

  const router = useRouter();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: WriteReviewVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleReview(value, action);
    },
  });

  const {
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
    isSubmitting,
    resetForm,
  } = formik;

  const handleReview = (value: WriteReviewInterface, action: any) => {
    let rating = {
      book_id: router.query.id,
      type: 2, // 1 = hard_copy, 2 = soft_copy
      rating: value.rating,
    };
    addRating(rating)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
          resetForm();
          handleClose();
          handleShowQuiz();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  const handleCloseModal = () => {
    resetForm();
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <Modal.Body
        className={classNames(
          " d-flex flex-column align-items-center justify-content-between w-100 py-5 px-0"
        )}
      >
        <label className={classNames(styles.ratingHeading)}>
          How many Stars Would you like to give them
        </label>
        <label className={classNames(styles.description, "px-4 mt-3")}>
          Its not too late to continue. Read amazing book continuously by
          selecting a plan
        </label>
        <div className={classNames(styles.ratingContainer, "py-3 w-100 mt-4")}>
          <div className={classNames("d-flex gap-2")}>
            <Rating
              ratingHover={true}
              active={values.rating}
              setSelect={(rating: number) => {
                setFieldValue("rating", rating);
              }}
              ratingStyle={styles.ratingSize}
              changeColor={true}
            />
          </div>
          <div className={classNames("error mt-2")}>
            {touched.rating && errors.rating ? errors.rating : ""}
          </div>
        </div>
        <div
          className={classNames(
            "d-flex gap-2 align-items-center justify-content-center px-4 w-100 mt-4"
          )}
        >
          <CustomButton
            title="Submit"
            containerStyle={classNames(styles.buttonContainer)}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
          <CustomButton
            title="Not Now"
            containerStyle={classNames(styles.buttonContainer, styles.btn2)}
            onClick={() => {
              handleClose();
              handleShowQuiz();
            }}
            disabled={isSubmitting}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RatingModal;
