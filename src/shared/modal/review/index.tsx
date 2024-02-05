import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import CustomTextArea from "shared/components/common/customTextArea";
import Rating from "shared/components/common/rating";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import { addRating } from "shared/services/kid/bookService";
import { classNames } from "shared/utils/helper";
import { WriteReviewVS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface Props {
  open: boolean;
  handleClose: () => void;
  ratings: any;
  setRatings: (val: any) => void;
  handleGetReviewStats: () => void;
}
interface WriteReviewInterface {
  rating: number;
  description: string;
}
function WriteReview({
  ratings,
  setRatings,
  handleClose,
  open,
  handleGetReviewStats,
}: Props) {
  const initialValues: WriteReviewInterface = {
    rating: 0,
    description: "",
  };

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
    handleChange,
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
      type: 1, // 1 = hard_copy, 2 = soft_copy
      rating: value.rating,
      review: value.description,
    };
    addRating(rating)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          handleGetReviewStats();
          let tempData = [...ratings];
          tempData.unshift(data);
          setRatings(tempData);
          toastMessage("success", message);
          resetForm();
          handleClose();
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
      show={open}
      onHide={handleCloseModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <Modal.Body>
        <ModalHeader close={handleCloseModal} isFirst={true} />
        <div className={classNames("px-4")}>
          <label className={classNames(styles.ratingHeading)}>
            Give Ratings <span>*</span>
          </label>

          <div className={classNames("mt-3 mb-3")}>
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
          <CustomTextArea
            label="Your Review"
            customInputContainer={classNames(styles.inputContainer)}
            customLabelStyle={classNames(styles.inputLabel, "mb-2")}
            customInputStyle={classNames(styles.inputStyle)}
            placeholder="Enter your review"
            value={values.description}
            error={
              touched.description && errors.description
                ? errors.description
                : ""
            }
            onChange={handleChange("description")}
          />
          <CustomButton
            title="Submit"
            containerStyle={classNames(styles.buttonContainer, "mt-3 mb-2")}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default WriteReview;
