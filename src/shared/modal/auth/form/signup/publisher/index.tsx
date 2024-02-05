import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomTextArea from "shared/components/common/customTextArea";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import UploadProfile from "shared/components/uploadProfile";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { RegisterUser } from "shared/services/authService";
import { classNames } from "shared/utils/helper";
import { publisherRegisterVs } from "shared/utils/validations";
import styles from "./style.module.scss";
import { routeConstant } from "shared/routes/routeConstant";
import { useRouter } from "next/router";
import CustomCheckBox from "shared/components/customCheckbox";

interface Props {
  handleClose: () => void;
}
interface InitialValues {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  confirmPassword: string;
  publishingHouseName: string;
  publisherRole: string;
  webUrl: string;
  pubAddress: string;
  profilePicture: any;
  publishingHouseLogo: any | string;
  aboutPublisher: string;
}

function RegisterPublisher({ handleClose }: Props) {
  const { login } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const [accepted, setAccepted] = useState(true);
  const initialValues: InitialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    publishingHouseName: "",
    publisherRole: "",
    webUrl: "",
    pubAddress: "",
    profilePicture: "",
    publishingHouseLogo: "",
    aboutPublisher: "",
  };
  const formik : any = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: publisherRegisterVs,
    onSubmit: (value, action) => {
      if (accepted) {
        const formData = new FormData();
        //@ts-ignore
        formData.append("role", login?.user?.role);
        formData.append("first_name", value.firstname);
        formData.append("last_name", value.lastname);
        formData.append("email", value.email);
        formData.append("password", value.password);
        formData.append("password_confirmation", value.confirmPassword);
        formData.append("phone", value.phonenumber);
        formData.append("publishing_house", value.publishingHouseName);
        formData.append("publisher_role", value.publisherRole);
        formData.append("website", value.webUrl);
        formData.append("address", value.pubAddress);
        //@ts-ignore
        formData.append("profile_picture", value.profilePicture);
        formData.append("publishing_logo", value.publishingHouseLogo);
        formData.append("about", value.aboutPublisher);

        action.setSubmitting(true);
        handleRegistration(formData, action);
      } else {
        action.setSubmitting(false);
        toastMessage("error", "Please Accept Terms & Conditions");
      }
    },
  });

  const handleRegistration = (payload: any, action: any) => {
    RegisterUser(payload)
      .then((res) => {
        if (res.data.status === true) {
          resetForm();
          toastMessage("success", res.data.message);
          dispatch(
            setLoginUser({
              user: { email: values?.email, role: login?.user?.role },
              token: null,
              isLoggedIn: false,
            })
          );
          dispatch(
            setAuthReducer({ activeModal: forms.otp, prevModal: forms.signup })
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
      .finally(() => action.setSubmitting(false));
  };
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

  const handleProfileChange = (attachment: any) => {
    if (attachment !== null && attachment !== undefined) {
      setFieldValue("profilePicture", attachment);
    } else {
      setFieldValue("profilePicture", "");
    }
  };

  const handleLogo = (attachment: any) => {
    if (attachment !== null && attachment !== undefined) {
      setFieldValue("publishingHouseLogo", attachment);
    } else {
      setFieldValue("publishingHouseLogo", "");
    }
  };

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  return (
    <>
      <ModalHeader
        isFirst
        back={() => handleNavigate(forms.login)}
        close={handleClose}
        headerStyle={styles.header}
      />
      <div className={classNames(" px-3 pb-3 pt-3")}>
        <label className={classNames(styles.heading, "mb-4")}>Sign Up</label>
        <div
          className={classNames(
            "d-flex  flex-row gap-3 align-items-start justify-content-center"
          )}
        >
          <div className="mb-0 mb-sm-4 w-50">
            <UploadProfile
              onFileChange={handleProfileChange}
              required={true}
              label="Profile Picture"
              error={
                touched.profilePicture && errors.profilePicture
                  ? errors.profilePicture
                  : ""
              }
              id={1}
              customLabelStyle={classNames(styles.inputLabel)}
              customContainer={classNames(styles.uploadContainer)}
              customIconStyle={classNames(styles.uploadIconStyle)}
            />
          </div>
          <div className="mb-4 w-50">
            <UploadProfile
              onFileChange={handleLogo}
              required={true}
              label="Publication House Logo"
              customLabelStyle={classNames(styles.inputLabel)}
              customContainer={classNames(styles.uploadContainer)}
              customIconStyle={classNames(styles.uploadIconStyle)}
              error={
                touched.publishingHouseLogo && errors.publishingHouseLogo
                  ? errors.publishingHouseLogo
                  : ""
              }
              id={2}
            />
          </div>
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row gap-3 align-items-start justify-content-center"
          )}
        >
          <CustomInput
            label="First Name"
            required
            placeholder="Enter your first name"
            type="text"
            value={values.firstname}
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            error={
              touched.firstname && errors.firstname ? errors.firstname : ""
            }
            onChange={handleChange("firstname")}
          />

          <CustomInput
            label="Last Name"
            placeholder="Enter your last name"
            required
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.lastname}
            error={touched.lastname && errors.lastname ? errors.lastname : ""}
            onChange={handleChange("lastname")}
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row gap-3 align-items-start justify-content-center"
          )}
        >
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            required
            type="email"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.email}
            error={touched.email && errors.email ? errors.email : ""}
            onChange={handleChange("email")}
          />

          <CustomInput
            label="Contact Number"
            required
            placeholder="Enter your number"
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.phonenumber}
            error={
              touched.phonenumber && errors.phonenumber
                ? errors.phonenumber
                : ""
            }
            onChange={handleChange("phonenumber")}
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row gap-3 align-items-start justify-content-center"
          )}
        >
          <CustomInput
            required
            label="Publishing House"
            placeholder="Enter your publish house name"
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.publishingHouseName}
            error={
              touched.publishingHouseName && errors.publishingHouseName
                ? errors.publishingHouseName
                : ""
            }
            onChange={handleChange("publishingHouseName")}
          />

          <CustomInput
            required
            label="Role"
            placeholder="Enter your role at publishing house"
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.publisherRole}
            error={
              touched.publisherRole && errors.publisherRole
                ? errors.publisherRole
                : ""
            }
            onChange={handleChange("publisherRole")}
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row gap-3 align-items-start justify-content-center"
          )}
        >
          <CustomInput
            label="Address"
            required
            placeholder="Enter your publish house address"
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.pubAddress}
            error={
              touched.pubAddress && errors.pubAddress ? errors.pubAddress : ""
            }
            onChange={handleChange("pubAddress")}
          />

          <CustomInput
            // required
            label="Website URL"
            placeholder="Enter a link to your portfolio/website"
            type="text"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.webUrl}
            error={touched.webUrl && errors.webUrl ? errors.webUrl : ""}
            onChange={handleChange("webUrl")}
          />
        </div>
        <CustomTextArea
          label="About Publisher"
          placeholder="Enter some details about your profile including work history, publication house etc."
          value={values.aboutPublisher}
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          customInputContainer={classNames(styles.inputTextAreaContainer)}
          error={
            touched.aboutPublisher && errors.aboutPublisher
              ? errors.aboutPublisher
              : ""
          }
          onChange={handleChange("aboutPublisher")}
        />
        <hr className={classNames(styles.hr, "mt-5")} />
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row gap-3 align-items-start justify-content-center"
          )}
        >
          <CustomInput
            required
            label="Password"
            placeholder="************"
            type="password"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            customInputContainer={classNames(styles.inputContainer)}
            value={values.password}
            error={touched.password && errors.password ? errors.password : ""}
            onChange={handleChange("password")}
            isPassword
          />

          <CustomInput
            required
            label="Confirm Password"
            placeholder="************"
            type="password"
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
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => handleSubmit()}
          containerStyle={classNames(styles.btnStyle, "mt-4")}
        />
      </div>
    </>
  );
}

export default RegisterPublisher;
