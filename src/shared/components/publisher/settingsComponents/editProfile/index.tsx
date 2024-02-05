import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomTextArea from "shared/components/common/customTextArea";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import UploadBanner from "shared/components/publisher/uploadBanner";
import UploadProfile from "shared/components/uploadProfile";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import {
  ChangePassword,
  UpdateProfile,
} from "shared/services/publisher/settingService";
import { roles } from "shared/utils/enum";
import {
  AddAddressVs,
  changePasswordVS,
  updateProfileVS,
} from "shared/utils/validations";
import styles from "./style.module.scss";
import dynamic from "next/dynamic";
import { UpdateAddress, getUserAddress } from "shared/services/kid/userService";

interface UpdateProfileInitialValues {
  isPublisher: boolean;
  profilePicture: string;
  publishingHouseLogo: string;
  banner: string;
  fName: string;
  lName: string;
  email: string;
  contactNumb: string;
  publisherHouse: string;
  publisherRole: string;
  aboutPublisher: string;
  webUrl: string;
  address: string;
}
function EditProfile() {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [logo, setLogo] = useState(null);

  const initialValues: UpdateProfileInitialValues = {
    isPublisher: user?.role === roles.publisher ? true : false,
    fName:
      user?.role === roles.publisher
        ? user?.publisher?.first_name
        : user?.author?.first_name || "",
    lName:
      user?.role === roles.publisher
        ? user?.publisher?.last_name
        : user?.author?.last_name || "",
    email: user?.email || "",
    contactNumb:
      user?.role === roles.publisher
        ? user?.publisher?.phone
        : user?.author?.phone || "",
    publisherHouse: user?.publisher?.publishing_house || "",
    publisherRole: user?.publisher?.publisher_role || "",
    aboutPublisher:
      user?.role === roles.publisher
        ? user?.publisher?.about
        : user?.author?.about || "",
    webUrl:
      user?.role === roles.publisher
        ? user?.publisher?.website
        : user?.author?.website || "",
    address:
      user?.role === roles.publisher
        ? user?.publisher?.address
        : user?.author?.address || "",
    profilePicture: "",
    publishingHouseLogo: "",
    banner:
      user?.role === roles.publisher
        ? user?.publisher?.banner
          ? user?.publisher?.banner
          : user?.author?.banner
          ? user?.author?.banner
          : ""
        : "",
  };

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

  const handleBannerChange = (attachment: any) => {
    if (attachment !== null && attachment !== undefined) {
      setFieldValue("banner", attachment);
    } else {
      setFieldValue("banner", "");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: updateProfileVS,
    onSubmit: (value) => {
      const formData = new FormData();

      formData.append("first_name", value.fName);
      formData.append("last_name", value.lName);
      formData.append("phone", value.contactNumb);
      formData.append("website", value.webUrl);
      formData.append("address", value.address);
      if (user?.role === roles.publisher) {
        formData.append("publishing_house", value.publisherHouse);
        formData.append("publisher_role", value.publisherRole);
        formData.append("publishing_logo", value.publishingHouseLogo);
        if (value.banner !== user?.publisher?.banner) {
          formData.append("banner", value.banner);
        }
      } else if (user?.role === roles.author) {
        if (value.banner !== user?.author?.banner) {
          formData.append("banner", value.banner);
        }
      }
      formData.append("profile_picture", value.profilePicture);
      formData.append("about", value.aboutPublisher);

      setLoading(true);
      UpdateProfile(formData)
        .then(({ data: { status, data, message } }) => {
          if (status) {
            toastMessage("success", message);
            dispatch(setLoginUser({ user: data }));
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          const errors = err.response.data.errors;
          for (const key in errors) {
            toastMessage("error", errors[key][0]);
          }
        })
        .finally(() => setLoading(false));
    },
  });

  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  useEffect(() => {
    if (user?.role === roles.publisher) {
      setProfile(user?.publisher?.profile_picture);
      setLogo(user?.publisher?.publishing_logo);
    } else if (user?.role === roles.author) {
      setProfile(user?.author?.profile_picture);
    }
  });

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Edit Profile",
          },
        ],
      })
    );
  }, []);

  return (
    <>
      <div className={classNames(styles.editProfileContainer)}>
        <div className="d-flex w-100 align-items-center justify-content-center gap-5 mb-5">
          <UploadProfile
            onFileChange={handleProfileChange}
            label="Profile Picture"
            preview={profile}
            error={
              touched.profilePicture && errors.profilePicture
                ? errors.profilePicture
                : ""
            }
            id={1}
          />
          {user?.role === roles.publisher ? (
            <UploadProfile
              onFileChange={handleLogo}
              label="Publication House Logo"
              preview={logo}
              error={
                touched.publishingHouseLogo && errors.publishingHouseLogo
                  ? errors.publishingHouseLogo
                  : ""
              }
              id={2}
            />
          ) : null}
        </div>
        <UploadBanner
          value={values.banner}
          fileCover={banner}
          setFileCover={setBanner}
          label="Banner"
          required={false}
          onBannerChange={handleBannerChange}
        />
        <div className="row">
          <div className="col-6">
            <CustomInput
              type="text"
              label="First Name"
              required={true}
              value={values.fName}
              error={touched.fName && errors.fName ? errors.fName : ""}
              onChange={handleChange("fName")}
            />
          </div>
          <div className="col-6">
            <CustomInput
              type="text"
              label="Last Name"
              required={true}
              value={values.lName}
              error={touched.lName && errors.lName ? errors.lName : ""}
              onChange={handleChange("lName")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <CustomInput
              type="email"
              label="Email"
              readOnly={true}
              value={values.email}
              error={touched.email && errors.email ? errors.email : ""}
              onChange={handleChange("email")}
            />
          </div>
          <div className="col-6">
            <CustomInput
              type="text"
              label="Contact Number"
              required={true}
              value={values.contactNumb}
              placeholder="Enter your Contact number"
              error={
                touched.contactNumb && errors.contactNumb
                  ? errors.contactNumb
                  : ""
              }
              onChange={handleChange("contactNumb")}
            />
          </div>
        </div>
        {user?.role === roles.publisher ? (
          <div className="row">
            <div className="col-6">
              <CustomInput
                type="text"
                label="Publishing House"
                placeholder="Enter your Publishing House"
                required={true}
                value={values.publisherHouse}
                error={
                  touched.publisherHouse && errors.publisherHouse
                    ? errors.publisherHouse
                    : ""
                }
                onChange={handleChange("publisherHouse")}
              />
            </div>
            <div className="col-6">
              <CustomInput
                required
                label="Role"
                placeholder="Enter your role at publishing house"
                type="text"
                value={values.publisherRole}
                error={
                  touched.publisherRole && errors.publisherRole
                    ? errors.publisherRole
                    : ""
                }
                onChange={handleChange("publisherRole")}
              />
            </div>
          </div>
        ) : null}

        <div className="row">
          <div className="col-6">
            <CustomInput
              type="text"
              label="Address"
              required={true}
              value={values.address}
              error={touched.address && errors.address ? errors.address : ""}
              onChange={handleChange("address")}
            />
          </div>
          <div className="col-6">
            <CustomInput
              type="text"
              label="Website URL"
              required={true}
              value={values.webUrl}
              error={touched.webUrl && errors.webUrl ? errors.webUrl : ""}
              onChange={handleChange("webUrl")}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <CustomTextArea
              label={
                user?.role === roles.publisher
                  ? "About Publisher"
                  : "About Author"
              }
              placeholder="Enter some details about your profile including work history, publication house etc."
              value={values.aboutPublisher}
              error={
                touched.aboutPublisher && errors.aboutPublisher
                  ? errors.aboutPublisher
                  : ""
              }
              onChange={handleChange("aboutPublisher")}
            />
          </div>
        </div>
        <CustomButton
          title="Update"
          loading={loading}
          containerStyle={styles.customButton}
          onClick={() => {
            handleSubmit();
          }}
        />
        <hr />
        <UpdatePassword />
        <hr />
        <AddHomeAddress />
      </div>
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
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: changePasswordVS,
    onSubmit: (value) => {
      setLoading(true);
      ChangePassword({
        current_password: value.currentPassword,
        password: value.newPassword,
        password_confirmation: value.confirmPassword,
      })
        .then(({ data: { status, data, message } }) => {
          if (status) {
            formik.resetForm();
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          const errors = err.response.data.errors;
          for (const key in errors) {
            toastMessage("error", errors[key][0]);
          }
        })
        .finally(() => setLoading(false));
    },
  });
  const { handleChange, handleSubmit, handleReset, values, touched, errors } =
    formik;
  return (
    <>
      <div className="row mt-5">
        <Heading />
      </div>
      <CustomInput
        label="Current Password"
        placeholder="Enter Current Password"
        required={true}
        type="password"
        value={values.currentPassword}
        error={
          touched.currentPassword && errors.currentPassword
            ? errors.currentPassword
            : ""
        }
        onChange={handleChange("currentPassword")}
      />
      <div className="row">
        <div className="col-6">
          <CustomInput
            label="New Password"
            placeholder="Enter New Password"
            type="password"
            required={true}
            value={values.newPassword}
            error={
              touched.newPassword && errors.newPassword
                ? errors.newPassword
                : ""
            }
            onChange={handleChange("newPassword")}
          />
        </div>
        <div className="col-6">
          <CustomInput
            label="Confirm New Password"
            placeholder="Re-enter New Password"
            type="password"
            required={true}
            value={values.confirmPassword}
            error={
              touched.confirmPassword && errors.confirmPassword
                ? errors.confirmPassword
                : ""
            }
            onChange={handleChange("confirmPassword")}
          />
        </div>
      </div>
      <CustomButton
        title="Update"
        containerStyle={styles.customButton}
        loading={loading}
        onClick={() => {
          handleSubmit();
        }}
      />
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
const AddHomeAddress = () => {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);

  const [userAddress, setUserAddress] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const initialValues: AddHomeAddressInitialValues = {
    firstname: userAddress?.first_name
      ? userAddress?.first_name
      : user?.role === roles?.publisher
      ? user?.publisher?.first_name
      : user?.partner?.first_name
      ? user?.partner?.first_name
      : "",
    lastname: userAddress?.last_name
      ? userAddress?.last_name
      : user?.role === roles?.publisher
      ? user?.publisher?.last_name
      : user?.partner?.last_name
      ? user?.partner?.last_name
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

  const handleGetAddress = () => {
    getUserAddress()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setUserAddress(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetAddress();
  }, []);

  return (
    <>
      <div className="row mt-5">
        <Heading />
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
          type="text"
          value={values.firstname}
          error={touched.firstname && errors.firstname ? errors.firstname : ""}
          onChange={handleChange("firstname")}
        />
        <CustomInput
          label="Last Name"
          required
          placeholder="Enter your last name"
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
        type="email"
        value={values.email}
        error={touched.email && errors.email ? errors.email : ""}
        onChange={handleChange("email")}
      />
      <CustomInput
        label="Street Address "
        required
        placeholder="Enter your Street Address"
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
          type="text"
          value={values.province}
          error={touched.province && errors.province ? errors.province : ""}
          onChange={handleChange("province")}
        />

        <CustomInput
          label="City"
          required
          placeholder="Enter your city name"
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
          type="number"
          value={values.zip}
          error={touched.zip && errors.zip ? errors.zip : ""}
          onChange={handleChange("zip")}
        />
        <CustomInput
          label="Phone"
          required
          placeholder="Enter your phone number"
          type="text"
          value={values.phone}
          error={touched.phone && errors.phone ? errors.phone : ""}
          onChange={handleChange("phone")}
        />
      </div>
      <CustomButton
        title="Update"
        containerStyle={styles.customButton}
        loading={isSubmitting}
        disabled={isSubmitting || loading}
        onClick={() => {
          handleSubmit();
        }}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(EditProfile), {
  ssr: false,
});
