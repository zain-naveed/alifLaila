import { LoadingAnimation, MailIcon } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import UploadProfile from "shared/components/uploadProfile";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { getUser } from "shared/services/kid/userService";
import Address from "shared/components/parent/settingsScreenComponents/address";

import Animation from "shared/components/common/animation";
import {
  ChangePassword,
  UpdateProfile,
} from "shared/services/publisher/settingService";
import { changePasswordVS, ParentEditVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface UpdateProfileInitialValues {
  firstname: string;
  lastname: string;
  email: string;
  number: string;
}
const Profile = () => {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const { login } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(
    user?.parent?.profile_picture ? user?.parent?.profile_picture : null
  );
  const [profileFile, setProfileFile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: UpdateProfileInitialValues = {
    firstname: userData?.parent?.first_name || "",
    lastname: userData?.parent?.last_name || "",
    email: userData?.email || "",
    number: userData?.parent?.phone || "",
  };

  const handleProfileChange = (attachment: any) => {
    if (attachment !== null && attachment !== undefined) {
      setProfileFile(attachment);
    } else {
      setProfileFile(null);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ParentEditVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleUpdateProfile(value, action);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleGetProfileInfo = () => {
    getUser()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setUserData(data);
          setProfile(data?.parent?.profile_picture);
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateProfile = (
    value: UpdateProfileInitialValues,
    action: any
  ) => {
    let formData = new FormData();
    formData.append("first_name", value.firstname);
    formData.append("last_name", value.lastname);
    formData.append("phone", value.number);
    if (profileFile) {
      formData.append("profile_picture", profileFile);
    }

    UpdateProfile(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          toastMessage("success", "Profile Updated Successfully");
          setUserData(data);
          setProfile(data?.parent?.profile_picture);
          dispatch(
            setLoginUser({
              user: { token: login?.token, ...data },
            })
          );
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    handleGetProfileInfo();
  }, []);

  return (
    <>
      {loading ? <Animation animaton={LoadingAnimation} /> : null}

      <div
        className={classNames(
          styles.editProfileContainer,
          "p-4 d-flex flex-column gap-2"
        )}
      >
        <div className="d-flex mb-4 align-items-center justify-content-center">
          <UploadProfile
            onFileChange={handleProfileChange}
            preview={profile}
            id={1}
          />
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-4"
          )}
        >
          <CustomInput
            label="First Name"
            required
            placeholder="Enter your first name"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
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
            type="text"
            value={values.lastname}
            error={touched.lastname && errors.lastname ? errors.lastname : ""}
            onChange={handleChange("lastname")}
          />
        </div>

        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-4"
          )}
        >
          <CustomInput
            Icon={MailIcon}
            label="Email Address"
            required
            placeholder="abc@email.com"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="email"
            value={values.email}
            error={touched.email && errors.email ? errors.email : ""}
            onChange={handleChange("email")}
            readOnly
          />
          <CustomInput
            label="Contact Number"
            required
            placeholder="Enter your Contact Number"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="text"
            value={values.number}
            error={touched.number && errors.number ? errors.number : ""}
            onChange={handleChange("number")}
          />
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-end"
          )}
        >
          <CustomButton
            title="Save Changes"
            loading={isSubmitting}
            containerStyle={styles.btnStyle}
            onClick={() => {
              handleSubmit();
            }}
          />
        </div>
      </div>
      {!user?.social_platform ? <UpdatePassword /> : null}
      <Address />
    </>
  );
};
interface UpdatePasswordInitialValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const UpdatePassword = () => {
  const initialValues: UpdatePasswordInitialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: changePasswordVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleUpdatePassword(value, action);
    },
  });
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
    touched,
    errors,
    resetForm,
  } = formik;
  const handleUpdatePassword = (
    value: UpdatePasswordInitialValues,
    action: any
  ) => {
    let formData = new FormData();
    formData.append("current_password", value.currentPassword);
    formData.append("password", value.newPassword);
    formData.append("password_confirmation", value.confirmPassword);

    ChangePassword(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          toastMessage("success", "Password Updated Successfully");
          resetForm();
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        action.setSubmitting(false);
      });
  };
  return (
    <>
      <div
        className={classNames(
          styles.editProfileContainer,
          "p-4 d-flex flex-column gap-2 mt-4 mt-sm-5"
        )}
      >
        <label className={classNames(styles.title, "mb-3")}>
          Change Password
        </label>
        <CustomInput
          label="Current Password"
          required={true}
          type="password"
          placeholder="••••••••"
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          value={values.currentPassword}
          error={
            touched.currentPassword && errors.currentPassword
              ? errors.currentPassword
              : ""
          }
          onChange={handleChange("currentPassword")}
          isPassword
        />

        <CustomInput
          label="New Password"
          type="password"
          placeholder="••••••••"
          required={true}
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          value={values.newPassword}
          error={
            touched.newPassword && errors.newPassword ? errors.newPassword : ""
          }
          onChange={handleChange("newPassword")}
          isPassword
        />

        <CustomInput
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          required={true}
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          value={values.confirmPassword}
          error={
            touched.confirmPassword && errors.confirmPassword
              ? errors.confirmPassword
              : ""
          }
          onChange={handleChange("confirmPassword")}
          isPassword
        />

        <div
          className={classNames(
            "d-flex align-items-center justify-content-end"
          )}
        >
          <CustomButton
            title="Save Changes"
            loading={isSubmitting}
            containerStyle={styles.btnStyle}
            onClick={() => {
              handleSubmit();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
