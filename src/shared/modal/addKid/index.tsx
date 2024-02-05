import classNames from "classnames";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import styles from "./style.module.scss";
import Image from "next/image";
import { CameraIcon, ChevDownIcon, closeImg, defaultAvatar } from "assets";
import CustomInput from "shared/components/common/customInput";
import { useFormik } from "formik";
import { AddkidVS } from "shared/utils/validations";
import { useEffect, useState } from "react";
import OptionsDropDown from "shared/dropDowns/options";
import { addKid } from "shared/services/parent/dashboardService";
import { toastMessage } from "shared/components/common/toast";
import { isNumberCheck } from "shared/utils/helper";
import { updateKid } from "shared/services/parent/kidService";

interface AddKidModalProps {
  showModal: boolean;
  handleClose: () => void;
  isEdit?: boolean;
  handleAction: (val: any) => void;
  user?: any;
}

interface InitialValues {
  firstname: string;
  lastname: string;
  username: string;
  grade: string;
  pin: string;
  year: string;
  confirmPin: string;
}

const AddKidModal = ({
  showModal,
  handleClose,
  isEdit,
  handleAction,
  user,
}: Partial<AddKidModalProps>) => {
  const initialValues: InitialValues = {
    username: user?.username,
    firstname: user?.reader?.first_name,
    lastname: user?.reader?.last_name,
    grade: user?.reader?.grade,
    pin: user?.pin_code,
    confirmPin: user?.pin_code,
    year: user?.reader?.birth_year.split("-")[0],
  };

  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const [file, setFile] = useState<any>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const onClose = () => {
    handleClose?.();
    formik.resetForm();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AddkidVS,
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
    if (!isEdit) {
      formData.append("username", value.username);
    }
    if (isEdit) {
      formData.append("kid_id", user?.id);
    }

    formData.append("grade", value.grade);
    formData.append("pin_code", value.pin);
    formData.append("birth_year", value?.year);
    if (file) {
      formData.append("profile_picture", file);
    }
    if (isEdit) {
      updateKid(formData)
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
      addKid(formData)
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

  const handleYears = () => {
    let year = new Date().getFullYear();
    year = year - 4;
    let opts = Array.from(new Array(14), (val, index) => {
      return {
        title: year - index,
        Icon: null,
        action: () => {
          setFieldValue("year", year - index);
          setOpen(false);
        },
      };
    });
    setOptions(opts);
  };

  const handleKeyPress = (e: any) => {
    if (e.code !== "Backspace") {
      if (!isNumberCheck(e)) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleOnChange = (value: string, confirmPin: boolean) => {
    const text = value.replace(/[^\d\S]/g, "");

    if (text.length === 0) {
      confirmPin ? setFieldValue("confirmPin", "") : setFieldValue("pin", "");
      return;
    }

    if (text.length < 5) {
      const fieldName = confirmPin ? "confirmPin" : "pin";
      setFieldValue(fieldName, value);
    }
  };

  useEffect(() => {
    handleYears();
  }, []);

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
            {isEdit ? `Edit ${user?.reader?.full_name}` : "Add New Kid"}
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
                    : user?.reader?.profile_picture
                    ? user?.reader?.profile_picture
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
            label="Username"
            required
            placeholder="Enter kid username"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="text"
            value={values.username}
            error={touched.username && errors.username ? errors.username : ""}
            onChange={handleChange("username")}
            readOnly={isEdit}
          />
          <CustomInput
            type="text"
            label="Set Pin Code"
            required
            placeholder="****"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.pin}
            error={touched.pin && errors.pin ? errors.pin : ""}
            onKeyDown={handleKeyPress}
            onChange={(e) => handleOnChange(e.currentTarget.value, false)}
          />
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-3"
          )}
        >
          <CustomInput
            type="text"
            label="Re-Type Pin Code"
            required
            placeholder="****"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.confirmPin}
            error={
              touched.confirmPin && errors.confirmPin ? errors.confirmPin : ""
            }
            onKeyDown={handleKeyPress}
            onChange={(e) => handleOnChange(e.currentTarget.value, true)}
          />
          <CustomInput
            label="Grade"
            required
            placeholder="Enter your grade"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            type="text"
            value={values.grade}
            error={touched.grade && errors.grade ? errors.grade : ""}
            onChange={handleChange("grade")}
          />
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center  gap-3"
          )}
        >
          <div
            className={classNames(
              "position-relative",
              styles.ageCategory,
              touched.year && errors.year ? "mb-0" : "mb-3"
            )}
          >
            <div
              className="d-flex flex-column"
              onClick={() => {
                setOpen(!open);
              }}
              role="button"
            >
              <label className={classNames(styles.dropDownLabel)} role="button">
                Age <label className={styles.asterik}>*</label>
              </label>
              <div className={classNames(styles.dropDownContainer, "gap-2")}>
                <label
                  className={classNames(
                    values?.year ? styles.inputLabel : styles.selectText
                  )}
                >
                  {values?.year ? values?.year : "Select Year"}
                </label>
                <ChevDownIcon
                  className={classNames(styles.iconStyle)}
                  role="button"
                />
              </div>
            </div>
            {!!touched.year && errors.year ? (
              <div className={styles.error}>{errors?.year}</div>
            ) : (
              ""
            )}
            <OptionsDropDown
              options={options}
              openSelection={open}
              setOpenSelection={setOpen}
              customContainer={styles.optionsContainer}
            />
          </div>
        </div>

        <div className={classNames("d-flex w-100 justify-content-end mt-4")}>
          <CustomButton
            title={isEdit ? "Save" : "Create Account"}
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

export default AddKidModal;
