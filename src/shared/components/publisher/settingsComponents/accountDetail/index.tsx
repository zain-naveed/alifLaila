import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import {
  GetBankDetails,
  UpdateBankAccount,
} from "shared/services/publisher/settingService";
import { classNames, isNumberCheck } from "shared/utils/helper";
import { publishserAccountDetail } from "shared/utils/validations";
import styles from "./style.module.scss";

interface UpdateProfileInitialValues {
  accountTitle: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
}

function AccountDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [keyPress, setKeyPress] = useState("");
  const [isNumber, setIsNumber] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: UpdateProfileInitialValues = {
    accountTitle: "",
    bankName: "",
    accountNumber: "",
    confirmAccountNumber: "",
  };

  useEffect(() => {
    getAccountDetail();
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Account Details",
          },
        ],
      })
    );
  }, []);

  const getAccountDetail = () => {
    GetBankDetails()
      .then(({ data: { status, data, message } }) => {
        if (data !== null) {
          formik.setValues({
            accountTitle: data.account_title || initialValues.accountTitle,
            bankName: data.bank_name || initialValues.bankName,
            accountNumber: data.account_number || initialValues.accountNumber,
            confirmAccountNumber: "",
          });
        }
      })
      .catch((err) => {
        toastMessage("error", err.response.data.message);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: publishserAccountDetail,
    onSubmit: (value) => {
      setLoading(true);
      UpdateBankAccount({
        bank_name: value.bankName,
        account_title: value.accountTitle,
        account_number: value.accountNumber,
      })
        .then(({ data: { status, data, message } }) => {
          if (status) {
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          var errors = err.response.data.errors;
          if (errors) {
            for (var key in errors) {
              toastMessage("error", errors[key][0]);
            }
          }
        })
        .finally(() => setLoading(false));
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;
  const cardInputHandler = (text: string, field: string) => {
    if (isNumber) {
      if (text.length < 20) {
        let formattedNumber = text;
        if (keyPress !== "Backspace") {
          if (text.length === 4 || text.length === 9) {
            formattedNumber = formattedNumber + "-";
          } else if (text.length === 5 && text[4] !== "-") {
            formattedNumber = text.slice(0, 4) + "-" + text.slice(4);
          } else if (text.length === 10 && text[9] !== "-") {
            formattedNumber = text.slice(0, 9) + "-" + text.slice(9);
          } else if (text.length === 15 && text[14] !== "-") {
            formattedNumber = text.slice(0, 14) + "-" + text.slice(14);
          }
        }
        setFieldValue?.(field, formattedNumber);
      }
    }
  };

  function myKeyPress(e: any) {
    setKeyPress(e.code);
    if (e.code === "Backspace") {
      setIsNumber(true);
    } else {
      setIsNumber(isNumberCheck(e));
    }
  }

  return (
    <>
      <div className={classNames(styles.accountDetailContainer)}>
        <Heading
          heading="Update Information"
          headingStyle={styles.accountHeading}
        />
        <div className={classNames("mt-5")}>
          <CustomInput
            label="Account Title"
            placeholder="Enter your account tittle here"
            required={true}
            value={values.accountTitle}
            error={
              touched.accountTitle && errors.accountTitle
                ? errors.accountTitle
                : ""
            }
            onChange={handleChange("accountTitle")}
          />
          <CustomInput
            label="Bank Name"
            placeholder="Enter your bank name"
            required={true}
            value={values.bankName}
            error={touched.bankName && errors.bankName ? errors.bankName : ""}
            onChange={handleChange("bankName")}
          />
          <CustomInput
            label="Account Number"
            placeholder="Add your bank account number"
            type="text"
            value={values.accountNumber}
            error={
              touched.accountNumber && errors.accountNumber
                ? errors.accountNumber
                : ""
            }
            onChange={(e: any) =>
              cardInputHandler(e.target.value, "accountNumber")
            }
            onKeyDown={myKeyPress}
            required={true}
          />
          <CustomInput
            label="Re-type Account Number"
            placeholder="Re-type your bank account number"
            type="text"
            value={values.confirmAccountNumber}
            error={
              touched.confirmAccountNumber && errors.confirmAccountNumber
                ? errors.confirmAccountNumber
                : ""
            }
            onChange={(e: any) =>
              cardInputHandler(e.target.value, "confirmAccountNumber")
            }
            onKeyDown={myKeyPress}
            required={true}
          />
        </div>
        <CustomButton
          title="Update"
          loading={loading}
          containerStyle={styles.customButton}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </>
  );
}

export default AccountDetail;
