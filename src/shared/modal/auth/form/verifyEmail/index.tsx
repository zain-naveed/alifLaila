import classNames from "classnames";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import ModalHeader from "shared/components/modalHeader";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forgotPasswordVS } from "shared/utils/validations";
import { forms } from "../../constants";
import styles from "./style.module.scss";
import { SendEmailOtp } from "shared/services/authService";
import { toastMessage } from "shared/components/common/toast";
import { setLoginUser } from "shared/redux/reducers/loginSlice";

interface VerifyEmailModalProps {
  handleClose: () => void;
}

interface InitialValues {
  email: string;
}

const VerifyEmailModal = ({ handleClose }: VerifyEmailModalProps) => {
  const { login } = useSelector((state: any) => state.root);

  const initialValues: InitialValues = {
    email: "",
  };

  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: forgotPasswordVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleEmailVerification(value, action);
    },
  });

  const handleEmailVerification = (value: InitialValues, action: any) => {
    SendEmailOtp({
      email: value.email,
      is_forget: true
    })
      .then((res) => {
        if (res.data.status === true) {
          toastMessage("success", res.data.message);
          dispatch(
            setAuthReducer({
              activeModal: forms.otp,
              prevModal: forms.emailVerification,
            })
          );
          dispatch(
            setLoginUser({
              user: { email: value?.email, role: login?.user?.role },
              token: null,
              isLoggedIn: false,
            })
          );
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

  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  return (
    <>
      <ModalHeader
        close={handleClose}
        headerStyle={styles.header}
        back={() => handleNavigate(forms.login)}
      />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center pb-4 px-4 px-md-5 pt-3"
        )}
      >
        <div
          className={classNames(
            styles.formContainer,
            "d-flex flex-column align-items-center"
          )}
        >
          <label className={classNames(styles.heading, "mb-2")}>
            Reset Your Password
          </label>
          <label className={classNames(styles.subTitle, "mb-4")}>
            Enter your registered email address to receive the reset password
            link
          </label>
          <form
            className={classNames(" d-flex flex-column align-items-center")}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <CustomInput
              label="Email Address"
              required
              placeholder="abc@email.com"
              customLabelStyle={classNames(styles.inputLabel)}
              customInputStyle={classNames(styles.inputStyle)}
              customInputContainer={classNames(styles.inputContainer)}
              type="email"
              value={values.email}
              error={touched.email && errors.email ? errors.email : ""}
              onChange={handleChange("email")}
            />

            <CustomButton
              title="Send OTP To Email"
              containerStyle={classNames(styles.btnStyle, "mt-2")}
              onClick={() => handleSubmit()}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default VerifyEmailModal;
