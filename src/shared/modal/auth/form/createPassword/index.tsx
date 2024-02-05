import classNames from "classnames";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import ModalHeader from "shared/components/modalHeader";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { resetPasswordVS } from "shared/utils/validations";
import { forms } from "../../constants";
import styles from "./style.module.scss";
import { SetResetPassword } from "shared/services/authService";
import { toastMessage } from "shared/components/common/toast";

interface CreatePasswordModalProps {
  handleClose: () => void;
}

interface InitialValues {
  password: string;
  confirmPassword: string;
}
const CreatePasswordModal = ({ handleClose }: CreatePasswordModalProps) => {
  const { login } = useSelector((state: any) => state.root);

  const initialValues: InitialValues = {
    password: "",
    confirmPassword: "",
  };

  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: resetPasswordVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleResetPassword(value, action);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleResetPassword = (value: InitialValues, action: any) => {
    SetResetPassword({
      email: login?.user?.email,
      otp: login?.user?.otp,
      password: value.password,
      password_confirmation: value.confirmPassword,
    })
      .then((res) => {
        if (res.data.status === true) {
          toastMessage("success", res.data.message);
          handleNavigate(forms?.login);
        } else {
          toastMessage("error", res.data.message);
        }
      })
      .catch((err) => {
        const errors = err?.response?.data?.errors;
        for (const key in errors) {
          toastMessage("error", errors[key][0]);
        }
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  return (
    <>
      <ModalHeader close={handleClose} headerStyle={styles.header} isFirst />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center pb-4 px-4 px-md-5 pt-3"
        )}
      >
        <div className={classNames("d-flex flex-column align-items-center")}>
          <label className={classNames(styles.heading, "mb-3")}>
            Create New Password
          </label>
          <CustomInput
            label="New Password "
            placeholder="**********"
            type="password"
            required
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.password}
            error={touched.password && errors.password ? errors.password : ""}
            onChange={handleChange("password")}
            isPassword
          />

          <CustomInput
            label="Confirm Password"
            placeholder="**********"
            type="password"
            required
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.confirmPassword}
            error={
              touched.confirmPassword && errors.confirmPassword
                ? errors.confirmPassword
                : ""
            }
            onChange={handleChange("confirmPassword")}
            isPassword
          />

          <CustomButton
            title="Update Password"
            containerStyle={classNames(styles.btnStyle, "mt-2")}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

export default CreatePasswordModal;
