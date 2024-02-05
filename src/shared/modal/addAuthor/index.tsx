import { CameraIcon, closeImg, defaultAvatar } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import {
  addAuthors,
  updateAuthors,
} from "shared/services/publisher/authorsService";
import { isNumberCheck } from "shared/utils/helper";
import { AddAuthorVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface AddAuthorModalProps {
  showModal: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  handleAction: (val: any) => void;
  user?: any;
}

interface InitialValues {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  websitelink: string;
  percentage: string;
}

const AddAuthorModal = ({
  showModal,
  handleClose,
  isEdit,
  handleAction,
  user,
}: AddAuthorModalProps) => {
  const initialValues: InitialValues = {
    firstname: user?.author?.first_name,
    lastname: user?.author?.last_name,
    phone: user?.author?.phone,
    email: user?.email,
    websitelink: user?.author?.website,
    percentage: user?.author?.platform_commission,
  };

  const [file, setFile] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const onClose = () => {
    handleClose?.();
    formik.resetForm();
    setFile(null);
    setFilePreview("");
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AddAuthorVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleRegistration(value);
    },
  });

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    setSubmitting,
    resetForm,
  } = formik;

  const handleRegistration = (value: InitialValues) => {
    const formData = new FormData();
    //@ts-ignore
    formData.append("first_name", value.firstname);
    formData.append("last_name", value.lastname);
    formData.append("email", value.email);
    formData.append("phone", value.phone);
    formData.append("website", value.websitelink);
    formData.append("platform_commission", value.percentage);

    if (isEdit) {
      formData.append("author_id", user?.id);
    }

    if (file) {
      formData.append("profile_picture", file);
    }

    if (isEdit) {
      updateAuthors(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            handleAction?.(data);
            resetForm();
            setFile(null);
            setFilePreview("");
            toastMessage("success", message);
            onClose();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("error", err?.response?.data?.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      addAuthors(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            handleAction?.(data);
            resetForm();
            setFile(null);
            setFilePreview("");
            toastMessage("success", message);
            onClose();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("error", err?.response?.data?.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.code !== "Backspace") {
      if (!isNumberCheck(e)) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleOnChange = (value: string) => {
    const text = value.replace(/[^\d\S]/g, "");
    if (text.length === 0) {
      setFieldValue("phone", "");
      return;
    }
    setFieldValue("phone", value);
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName={styles.reportDialog}
    >
      <Modal.Body className={classNames("px-4 py-4 d-flex flex-column gap-0")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100 mb-3"
          )}
        >
          <label className={styles.labelText}>
            {isEdit ? `Edit ${user?.author?.full_name}` : "Add New Author"}
          </label>
          <div
            onClick={onClose}
            role={"button"}
            className={classNames(styles.closeImageContainer, "pointer")}
          >
            <Image src={closeImg} alt="close" />
          </div>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center mb-3"
          )}
        >
          <div
            className={classNames(styles.profileContainer, "position-relative")}
            role="button"
          >
            <label htmlFor="kid-profile-avatar" role="button">
              <img
                src={
                  filePreview
                    ? filePreview
                    : user?.author?.profile_picture
                    ? user?.author?.profile_picture
                    : defaultAvatar.src
                }
                alt="avatar"
                height={114}
                width={114}
                className={classNames(styles.imgStyle)}
              />
              <input
                type="file"
                id="kid-profile-avatar"
                style={{ display: "none" }}
                onChange={(e: any) => {
                  let url = URL.createObjectURL(e.target.files[0]);
                  setFilePreview(url);
                  setFile(e.target.files[0]);
                }}
              />
              <div className={classNames(styles.cameraContainer)}>
                <CameraIcon />
              </div>
            </label>
          </div>
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-3"
          )}
        >
          <CustomInput
            label="First Name"
            required
            placeholder="Enter your first name"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="text"
            value={values.firstname}
            error={
              touched.firstname && errors.firstname ? errors.firstname : ""
            }
            onChange={handleChange("firstname")}
          />
          <CustomInput
            label="Last Name"
            required
            placeholder="Enter your last name"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="text"
            value={values.lastname}
            error={touched.lastname && errors.lastname ? errors.lastname : ""}
            onChange={handleChange("lastname")}
          />
        </div>

        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-3"
          )}
        >
          <CustomInput
            type="text"
            label="Phone"
            required
            placeholder="Enter your number"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.phone}
            error={touched.phone && errors.phone ? errors.phone : ""}
            onKeyDown={handleKeyPress}
            onChange={(e) => handleOnChange(e.currentTarget.value)}
          />
          <CustomInput
            label="Email"
            required
            placeholder="Enter your email"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="email"
            value={values.email}
            error={touched.email && errors.email ? errors.email : ""}
            onChange={handleChange("email")}
            readOnly={isEdit}
          />
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-3"
          )}
        >
          {/* <CustomInput
            type="text"
            label="Website Link"
            placeholder="Enter website Link"
            required
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.websitelink}
            error={
              touched.websitelink && errors.websitelink
                ? errors.websitelink
                : ""
            }
            onChange={handleChange("websitelink")}
          /> */}
          <CustomInput
            type="text"
            label="Earning Percentage"
            placeholder="0%"
            required
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(classNames(styles.inputContainer, styles.emailContainer))}
            value={values.percentage}
            error={
              touched.percentage && errors.percentage ? errors.percentage : ""
            }
            formikKey="percentage"
            setFieldValue={setFieldValue}
            isNumber
          />
        </div>

        <div className={classNames("d-flex w-100 justify-content-end mt-4")}>
          <CustomButton
            title={isEdit ? "Save" : "Create Profile"}
            containerStyle={styles.reportButton}
            onClick={() => {
              handleSubmit();
            }}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddAuthorModal;
