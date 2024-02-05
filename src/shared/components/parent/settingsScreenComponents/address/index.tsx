import classNames from "classnames";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toastMessage } from "shared/components/common/toast";
import { UpdateAddress, getUserAddress } from "shared/services/kid/userService";
import { AddAddressVs } from "shared/utils/validations";
import styles from "./style.module.scss";
import CustomInput from "shared/components/common/customInput";
import CustomButton from "shared/components/common/customButton";
import Animation from "shared/components/common/animation";
import { LoadingAnimation } from "assets";
import { useSelector } from "react-redux";

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
  const [loading, setLoading] = useState<boolean>(false);
  const initialValues: AddHomeAddressInitialValues = {
    firstname: userAddress?.first_name
      ? userAddress?.first_name
      : user?.parent?.first_name
      ? user?.parent?.first_name
      : "",
    lastname: userAddress?.last_name
      ? userAddress?.last_name
      : user?.parent?.last_name
      ? user?.parent?.last_name
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
    phone: userAddress?.phone
      ? userAddress?.phone
      : user?.parent?.phone
      ? user?.parent?.phone
      : "",
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

  const handleGetUserAddress = () => {
    setLoading(true);
    getUserAddress()
      .then(({ data: { data, status, message } }) => {
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
    handleGetUserAddress();
  }, []);

  return (
    <>
      {loading ? <Animation animaton={LoadingAnimation} /> : null}
      <div
        className={classNames(
          styles.editProfileContainer,
          "p-4 d-flex flex-column gap-2 mt-sm-5"
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
        </div>

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

export default AddHomeAddress;
