import { DefaultBookImg, closeImg } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import styles from "./style.module.scss";
import CustomInput from "shared/components/common/customInput";
import { useFormik } from "formik";
import { AssignBookVS } from "shared/utils/validations";
import { assignBook } from "shared/services/parent/kidService";
import { toastMessage } from "shared/components/common/toast";

interface Props {
  show: boolean;
  handleClose: () => void;
  book: any;
  kid_id?: any;
  setIsAssigned: (val: boolean) => void;
}

interface InitialValues {
  due: string;
}

const initialValues: InitialValues = {
  due: "",
};

function AssignBookModal({
  show,
  handleClose,
  book,
  kid_id,
  setIsAssigned,
}: Props) {
  const handleOnSubmit = () => {
    let obj = {
      assign: [
        {
          kid_id: kid_id,
        },
      ],
      book_id: book?.id,
      due_at: values.due,
    };
    assignBook(obj)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setIsAssigned(true);
          toastMessage("success", message);
          resetForm();
          handleClose();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.repsonse?.data?.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AssignBookVS,
    onSubmit: () => {
      handleOnSubmit();
    },
  });

  const closeModal = () => {
    handleClose();
    resetForm();
  };
  return (
    <Modal
      show={show}
      onHide={closeModal}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <div className={classNames("py-4")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-end px-3"
          )}
        >
          <div
            onClick={closeModal}
            role={"button"}
            className={classNames(styles.closeImageContainer)}
          >
            <Image src={closeImg} alt="close" />
          </div>
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row align-items-center justify-content-start gap-3 w-100 px-3"
          )}
        >
          <object
            data={book?.thumbnail ? book?.thumbnail : book?.cover_photo}
            type="image/png"
            className={classNames(styles.bookCover, "pointer")}
          >
            <Image
              src={DefaultBookImg}
              alt="assign-book-cover"
              style={{ objectFit: "cover" }}
              className={classNames(styles.bookCover, "pointer")}
              width={218}
              height={318}
              priority
            />
          </object>

          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between w-100"
            )}
          >
            <label className={classNames(styles.bookTitle)}>
              {book?.title}
            </label>
            <label className={classNames(styles.authoName, "mb-2")}>
              by {book?.book_author?.name}
            </label>
            <CustomInput
              label="Due Date"
              placeholder="Select Due Date"
              type="date"
              customLabelStyle={classNames(styles.inputLabel)}
              customInputStyle={classNames(styles.inputStyle)}
              customInputContainer={classNames(styles.inputContainer)}
              isDate
              min={new Date().toISOString().split("T")[0]}
              value={values.due}
              onChange={handleChange("due")}
              error={touched.due && errors.due ? errors.due : ""}
            />
            <CustomButton
              title="Assign Book"
              containerStyle={classNames(styles.btn, "mt-2")}
              onClick={() => {
                handleSubmit();
              }}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AssignBookModal;
