import { LoadingAnimation, MailIcon, User2Icon, UserFillIcon } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import UploadProfile from "shared/components/uploadProfile";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { UpdateAddress, getUser } from "shared/services/kid/userService";

import Animation from "shared/components/common/animation";
import {
  ChangePassword,
  UpdateProfile,
} from "shared/services/publisher/settingService";
import {
  AddAddressVs,
  changePasswordVS,
  kidEditVS,
} from "shared/utils/validations";
import styles from "./style.module.scss";
import { kidAccountRole } from "shared/utils/enum";

interface UpdateProfileInitialValues {
  isIndividual: boolean;
  firstname: string;
  lastname: string;
  email: string;
  grade: string;
  schoolname: string;
  username: string;
}
function EditProfile({ kid_role }: any) {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const { login } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(null);
  const [profileFile, setProfileFile] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<any>(null);

  const initialValues: UpdateProfileInitialValues = {
    isIndividual: kid_role === kidAccountRole.individual ? true : false,
    firstname: userData?.reader?.first_name || "",
    lastname: userData?.reader?.last_name || "",
    email: userData?.email || "",
    grade: userData?.reader?.grade || "",
    schoolname: userData?.reader?.school || "",
    username: userData?.username || "",
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
    validationSchema: kidEditVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleUpdateProfile(value, action);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const [loading, setLoading] = useState<boolean>(false);

  const handleGetProfileInfo = () => {
    getUser()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setUserData(data);
          setUserAddress(data?.address);
          setProfile(data?.reader?.profile_picture);
          dispatch(
            setLoginUser({
              user: { token: login?.token, ...data },
            })
          );
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
    formData.append("grade", value.grade);
    formData.append("school", value.schoolname);
    if (profileFile) {
      formData.append("profile_picture", profileFile);
    }

    UpdateProfile(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          toastMessage("success", "Profile Updated Successfully");
          setUserData(data);
          setProfile(data?.reader?.profile_picture);
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
          "p-4 d-flex flex-column gap-2 mt-4"
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
          {kid_role === kidAccountRole.individual ? (
            <>
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
            </>
          ) : (
            <>
              <CustomInput
                Icon={User2Icon}
                label="Username"
                required
                placeholder="Enter your username"
                customLabelStyle={classNames(styles.inputLabel)}
                customInputStyle={classNames(styles.inputStyle)}
                type="text"
                value={values.username}
                error={
                  touched.username && errors.username ? errors.username : ""
                }
                onChange={handleChange("username")}
                readOnly
              />
            </>
          )}

          <CustomInput
            label="Grade"
            placeholder="Enter your grade"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
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
          type="text"
          value={values.schoolname}
          error={
            touched.schoolname && errors.schoolname ? errors.schoolname : ""
          }
          onChange={handleChange("schoolname")}
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
      {kid_role === kidAccountRole.individual ? (
        <>
          {!user?.social_platform ? <UpdatePassword /> : null}
          <AddHomeAddress
            userAddress={userAddress}
            setUserAddress={setUserAddress}
          />
        </>
      ) : null}
    </>
  );
}
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
          "p-4 d-flex flex-column gap-2 mt-4"
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

interface AddHomeAddressInitialValues {
  firstname: string;
  lastname: string;
  email: string;
  streetAddress: string;
  province: string;
  city: string;
  zip: string;
  phone: string;
}
const AddHomeAddress = ({ userAddress, setUserAddress }: any) => {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const initialValues: AddHomeAddressInitialValues = {
    firstname: userAddress?.first_name
      ? userAddress?.first_name
      : user?.reader?.first_name
      ? user?.reader?.first_name
      : "",
    lastname: userAddress?.last_name
      ? userAddress?.last_name
      : user?.reader?.last_name
      ? user?.reader?.last_name
      : "",
    email: userAddress?.email
      ? userAddress?.email
      : user?.email
      ? user?.email
      : "",
    streetAddress: userAddress?.street ? userAddress?.street : "",
    province: userAddress?.state ? userAddress?.state : "",
    city: userAddress?.city ? userAddress?.city : "",
    zip: userAddress?.zip_code ? userAddress?.zip_code : "",
    phone: userAddress?.phone ? userAddress?.phone : "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AddAddressVs,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleUpdateAddress(value, action);
    },
  });
  const { handleChange, handleSubmit, isSubmitting, values, touched, errors } =
    formik;

  const handleUpdateAddress = (
    value: AddHomeAddressInitialValues,
    action: any
  ) => {
    let formData = new FormData();
    formData.append("first_name", value.firstname);
    formData.append("last_name", value.lastname);
    formData.append("email", value.email);
    formData.append("phone", value.phone);
    formData.append("street", value.streetAddress);
    formData.append("city", value.city);
    formData.append("state", value.province);
    formData.append("zip_code", value.zip);

    UpdateAddress(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setUserAddress(data);
          toastMessage("success", "Address Updated Successfully");
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
          "p-4 d-flex flex-column gap-2 mt-4"
        )}
      >
        <label className={classNames(styles.title, "mb-3")}>
          Add Your Home Address
        </label>
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

        <CustomInput
          label="Email Address"
          required
          placeholder="abc@email.com"
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          type="email"
          value={values.email}
          error={touched.email && errors.email ? errors.email : ""}
          onChange={handleChange("email")}
        />
        <CustomInput
          label="Street Address "
          required
          placeholder="Enter your Street Address"
          customLabelStyle={classNames(styles.inputLabel)}
          customInputStyle={classNames(styles.inputStyle)}
          type="text"
          value={values.streetAddress}
          error={
            touched.streetAddress && errors.streetAddress
              ? errors.streetAddress
              : ""
          }
          onChange={handleChange("streetAddress")}
        />
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-4"
          )}
        >
          <CustomInput
            label="State/Province"
            required
            placeholder="Enter state"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="text"
            value={values.province}
            error={touched.province && errors.province ? errors.province : ""}
            onChange={handleChange("province")}
          />

          <CustomInput
            label="City"
            required
            placeholder="Enter your city name"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="text"
            value={values.city}
            error={touched.city && errors.city ? errors.city : ""}
            onChange={handleChange("city")}
          />
        </div>
        <div
          className={classNames(
            "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-4"
          )}
        >
          <CustomInput
            label="Zip/Postal Code"
            required
            placeholder="Enter Zip-Code"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="number"
            value={values.zip}
            error={touched.zip && errors.zip ? errors.zip : ""}
            onChange={handleChange("zip")}
          />
          <CustomInput
            label="Phone"
            required
            placeholder="Enter your phone number"
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            type="text"
            value={values.phone}
            error={touched.phone && errors.phone ? errors.phone : ""}
            onChange={handleChange("phone")}
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
    </>
  );
};

export default EditProfile;
