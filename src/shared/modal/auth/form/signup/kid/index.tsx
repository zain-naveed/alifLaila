import classNames from "classnames";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import CustomCheckBox from "shared/components/customCheckbox";
import ModalHeader from "shared/components/modalHeader";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { RegisterUser } from "shared/services/authService";
import { kidRegisterVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface LoginModalProps {
  handleClose: () => void;
}

interface InitialValues {
  firstname: string;
  lastname: string;
  email: string;
  grade: string;
  schoolname: string;
  password: string;
  confirmPassword: string;
}

const RegisterReader = ({ handleClose }: LoginModalProps) => {
  const { login } = useSelector((state: any) => state.root);

  const initialValues: InitialValues = {
    email: login?.user?.email ? login?.user?.email : "",
    firstname: "",
    lastname: "",
    grade: "",
    schoolname: "",
    password: "",
    confirmPassword: "",
  };

  const dispatch = useDispatch();
  const [accepted, setAccepted] = useState(true);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: kidRegisterVS,
    onSubmit: (value, action) => {
      if (accepted) {
        action.setSubmitting(true);
        handleRegistration(value, action);
      } else {
        action.setSubmitting(false);
        toastMessage("error", "Please Accept Terms & Conditions");
      }
    },
  });

  const handleRegistration = (value: InitialValues, action: any) => {
    const formData = new FormData();
    //@ts-ignore
    formData.append("role", login?.user?.role);
    formData.append("first_name", value.firstname);
    formData.append("last_name", value.lastname);
    formData.append("email", value.email);
    formData.append("password", value.password);
    formData.append("password_confirmation", value.confirmPassword);
    formData.append("grade", value.grade);
    formData.append("school", value.schoolname);
    formData.append("birth_year", login?.user?.age);

    RegisterUser(formData)
      .then((res) => {
        if (res.data.status === true) {
          formik.resetForm();
          dispatch(
            setLoginUser({
              user: { email: value?.email, role: login?.user?.role },
              token: null,
              isLoggedIn: false,
            })
          );
          dispatch(
            setAuthReducer({ activeModal: forms.otp, prevModal: forms.signup })
          );
          toastMessage("success", res.data.message);
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
      .finally(() => action.setSubmitting(false));
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
          "d-flex align-items-center flex-column justify-content-center px-3 pb-3 pt-3 w-100"
        )}
      >
        <label className={classNames(styles.heading, "mb-4")}>Sign Up</label>
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
          <CustomInput
            label="Grade"
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
        <CustomInput
          label="School Name"
          placeholder="Enter your school name"
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          customInputContainer={classNames(styles.inputContainer)}
          type="text"
          value={values.schoolname}
          error={
            touched.schoolname && errors.schoolname ? errors.schoolname : ""
          }
          onChange={handleChange("schoolname")}
        />

        <div className={classNames(styles.seperator, "mb-4 mt-3")} />
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-start justify-content-center gap-3"
          )}
        >
          <CustomInput
            label="Password"
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
        </div>

        <div className={classNames("d-flex justify-content-start w-100")}>
          <div className="d-flex align-items-center">
            <CustomCheckBox
              active={accepted}
              onClick={() => {
                setAccepted(!accepted);
              }}
            />

            <label className={classNames(styles.termsText, "ms-1")}>
              Accept to{" "}
              <label
                className={classNames(styles.highlighted)}
                onClick={() => {
                  window.open(
                    "https://aliflaila.netlify.app" +
                      routeConstant.privacy.path,
                    "_blank"
                  );
                }}
              >
                Privacy Policy
              </label>{" "}
              and{" "}
              <label
                className={classNames(styles.highlighted)}
                onClick={() => {
                  window.open(
                    "https://aliflaila.netlify.app" + routeConstant.terms.path,
                    "_blank"
                  );
                }}
              >
                Terms & conditions
              </label>
            </label>
          </div>
        </div>

        <CustomButton
          title="Sign Up"
          containerStyle={classNames(styles.btnStyle, "mt-4")}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        <div className={styles.signupContnr}>
          <div className={classNames(styles.signupText)}>
            Already have an account?
            <span
              onClick={() => handleNavigate(forms.login)}
              className={classNames("ms-1")}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterReader;
