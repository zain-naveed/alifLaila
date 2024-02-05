import classNames from "classnames";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import CountDown from "shared/customHook/countDown";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import {
  kidPanelConstant,
  partnersPanelConstant,
} from "shared/routes/routeConstant";
import { SendEmailOtp, VerifyEmailOtp } from "shared/services/authService";
import { roles } from "shared/utils/enum";
import { otpVS } from "shared/utils/validations";
import { forms } from "../../constants";
import styles from "./style.module.scss";

interface OtpModalProps {
  handleClose: () => void;
}

interface InitialValues {
  otp: string;
}

const OtpModal = ({ handleClose }: OtpModalProps) => {
  const { auth, login } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    otp: "",
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie, setCookie] = useCookies();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [otp, setOtp] = useState<any>({});
  const [runTimer, setRunTimer] = useState(true);
  const [resendLoading, setLResendLoading] = useState<boolean>(false);

  const counter = CountDown(1, runTimer, setRunTimer, [runTimer]);

  //@ts-ignore
  const seconds = String(counter % 60).padStart(2, 0);
  //@ts-ignore
  const minutes = String(Math.floor(counter / 60)).padStart(2, 0);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: otpVS,
    onSubmit: (value, action) => {
      action?.setSubmitting(true);
      handleOtp(value, action);
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
  } = formik;

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  const togglerTimer = () => {
    if (!runTimer) {
      setRunTimer((t) => !t);
    }
    resedOTP();
  };

  const handleOtp = (value: InitialValues, action: any) => {
    var payload = {
      email: login?.user?.email,
      otp: value.otp,
      isPasswordReset:
        auth?.prevModal === forms.emailVerification ? true : false,
    };

    VerifyEmailOtp(payload)
      .then(({ data: { status, data, message } }) => {
        if (status === true) {
          toastMessage("success", "Email verified successfully");
          if (auth?.prevModal === forms.emailVerification) {
            handleNavigate(forms.resetpassword);
            dispatch(
              setLoginUser({
                user: {
                  email: login?.user?.email,
                  otp: value?.otp,
                  role: login?.user?.role,
                },
                token: null,
                isLoggedIn: false,
              })
            );
          } else if (data !== null) {
            setCookie("user", JSON.stringify({ role: login?.user?.role }), {
              path: "/",
              sameSite: true,
            });
            if (login?.role === roles.publisher) {
              dispatch(
                setBreadCrumb({
                  crumbs: [
                    {
                      title: "Dashboard",
                    },
                  ],
                })
              );
              router.push(partnersPanelConstant.stats.path);
            } else if (login?.user?.role === roles.reader) {
              router.push(kidPanelConstant.home.path);
            }
            dispatch(
              setLoginUser({
                user: data,
                token: data?.token,
                isLoggedIn: true,
              })
            );
            handleClose();
            if (login?.user?.role === roles.parent) {
              dispatch(setShowPlanModal({ showModal: true }));
            }
          } else {
            dispatch(
              setLoginUser({
                user: {
                  email: login?.user?.email,
                  role: login?.user?.role,
                },
                token: null,
                isLoggedIn: false,
              })
            );
            handleNavigate(forms.login);
          }
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        const errors = err?.response?.data?.errors;
        for (const key in errors) {
          toastMessage("error", errors[key][0]);
        }
      })
      .finally(() => action?.setSubmitting(false));
  };

  const resedOTP = () => {
    setLResendLoading(true);
    SendEmailOtp({
      email: login?.user?.email,
    })
      .then((res) => {
        if (res.data.status === true) {
          toastMessage("success", "OTP resent successfully");
        } else {
          toastMessage("error", res.data.message);
        }
      })
      .catch((err) => {
        const errors = err.response.data.errors;
        for (const key in errors) {
          toastMessage("error", errors[key][0]);
        }
      })
      .finally(() => {
        setLResendLoading(false);
      });
  };

  const handleBackSpace = () => {
    let input: any = document.getElementById(`otp-input-${selectedIndex}`);

    if (selectedIndex !== 0) {
      document?.getElementById(`otp-input-${selectedIndex - 1}`)?.focus();
      setSelectedIndex(selectedIndex - 1);
    } else if (selectedIndex === 0) {
      input.focus();
    }

    if (selectedIndex > -1 && selectedIndex < 4) {
      let temp = { ...otp };
      temp[selectedIndex] = "";
      setOtp(temp);
      input.value = "";
    }
  };

  useEffect(() => {
    let temp = "";
    Object.values(otp).map((itm, inx) => {
      temp += itm;
    });
    setFieldValue("otp", temp);
  }, [otp]);

  return (
    <>
      <ModalHeader isFirst close={handleClose} headerStyle={styles.header} />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center  px-3 pb-4 pt-3"
        )}
      >
        <div
          className={classNames(
            styles.formContainer,
            "d-flex flex-column align-items-center"
          )}
        >
          <label className={classNames(styles.heading, "mb-2")}>
            OTP Verification Code
          </label>
          <label className={classNames(styles.subTitle, "mb-4")}>
            We have sent the code to your email.
          </label>

          <div
            className={classNames(
              "d-flex flex-column align-items-center justify-content-between gap-3 w-100 position-relative mb-3"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between gap-3 mb-3 position-relative"
              )}
            >
              {Array.from(Array(4).keys()).map((itm, inx) => {
                return (
                  <OTPInput
                    setOtp={setOtp}
                    otp={otp}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    index={inx}
                    key={inx}
                    handleBackSpace={handleBackSpace}
                  />
                );
              })}
            </div>
            {/* <OtpInput
              containerStyle={"w-100 justify-content-between mb-0 w-100"}
              inputStyle={styles.inputStyle}
              value={values.otp}
              onChange={(value: any) => {
                handleOnChange(value);
              }}
              renderInput={(props) => <input {...props} />}
              numInputs={4}
            /> */}

            {touched.otp && errors.otp ? (
              <label className={classNames(styles.error)}> {errors.otp}</label>
            ) : null}
            {minutes !== "00" || seconds !== "00" ? (
              <div className={styles.resendOtp}>
                You can resend code after:
                <span>
                  {minutes}:{seconds}
                </span>
              </div>
            ) : null}
          </div>

          <div className="d-flex justify-content-between w-100 gap-3">
            <CustomButton
              title="Resend"
              disabled={runTimer || resendLoading}
              containerStyle={runTimer ? styles.disableReset : styles.reset}
              onClick={() => togglerTimer()}
              loading={resendLoading}
            />
            <CustomButton
              title="Confirm"
              containerStyle={styles.confirmBtn}
              onClick={() => handleSubmit()}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const OTPInput = ({
  setSelectedIndex,
  index,
  otp,
  setOtp,
  selectedIndex,
  handleBackSpace,
}: any) => {
  return (
    <input
      id={`otp-input-${index}`}
      type="number"
      className={classNames(
        styles.inputStyle,
        selectedIndex === index && styles.selected
      )}
      max={9}
      min={1}
      onInput={(e: any) => {
        if (e.target.value.length === 2) {
          e.target.value = e.target.value.slice(1, 2);
        }
        if (e.target.value == "") {
          if (otp[index]) {
            e.target.value = otp[index];
          } else {
            e.target.value = 0;
            let temp = { ...otp };
            temp[index] = 0;
            setOtp(temp);
          }
        }
        if (selectedIndex !== 3) {
          document?.getElementById(`otp-input-${selectedIndex + 1}`)?.focus();
          setSelectedIndex(selectedIndex + 1);
        }
      }}
      onChange={(e) => {
        let temp = { ...otp };
        temp[index] = Number(e.target.value);
        setOtp(temp);
      }}
      onClick={() => {
        setSelectedIndex(index);
      }}
      autoFocus={selectedIndex === index}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          e.preventDefault();
          handleBackSpace();
        } else if (e.key === "Tab") {
          e.preventDefault();
          if (selectedIndex !== 3) {
            document?.getElementById(`otp-input-${selectedIndex + 1}`)?.focus();
            setSelectedIndex(selectedIndex + 1);
          }
        }
      }}
    />
  );
};

export default OtpModal;
