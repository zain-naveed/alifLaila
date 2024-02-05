import classNames from "classnames";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import SocialAuthLoader from "shared/components/common/socialAuth/socialAuthLoader";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
  routeConstant,
} from "shared/routes/routeConstant";
import { LoginUser } from "shared/services/authService";
import { kidAccountRole, roles } from "shared/utils/enum";
import { LoginVS } from "shared/utils/validations";
import { forms } from "../../../constants";
import styles from "./style.module.scss";

const SocialAuth = dynamic(
  () => import("shared/components/common/socialAuth"),
  {
    ssr: false,
    loading: () => {
      return (
        <>
          <SocialAuthLoader />
        </>
      );
    },
  }
);
interface LoginModalProps {
  handleClose: () => void;
}

interface InitialValues {
  email: string;
  password: string;
}

const LoginModal = ({ handleClose }: LoginModalProps) => {
  const { login } = useSelector((state: any) => state.root);
  const initialValues: InitialValues = {
    email: login?.user?.email ? login?.user?.email : "",
    password: "",
  };

  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie, setCookie] = useCookies();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: LoginVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleLogin(value, action);
    },
  });

  const handleLogin = (value: InitialValues, action: any) => {
    let payload = {
      email: value.email,
      password: value.password,
    };
    LoginUser(payload)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          if (data?.role === roles.reader) {
            if (data?.parent_id) {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  kid_role: kidAccountRole.family,
                  status: data.status,
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            } else {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  kid_role: kidAccountRole.individual,
                  status: data.status,
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            }
          } else if (data?.role === roles.author) {
            if (data?.associate_with) {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  is_partner_enabled: 1,
                  status: data.status,
                  endpoint: "partner-author",
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            } else {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  status: data.status,
                  endpoint: "partner",
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            }
          } else {
            if (data?.is_partner_enabled) {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  status: data.status,
                  endpoint: "partner",
                  is_partner_enabled_server: 1,
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            } else {
              setCookie(
                "user",
                JSON.stringify({
                  role: data?.role,
                  status: data.status,
                  endpoint: "partner",
                  is_partner_enabled_server: 0,
                }),
                {
                  path: "/",
                  maxAge: 3600 * 24 * 30,
                  sameSite: true,
                }
              );
            }
          }

          setCookie("token", data.token, {
            path: "/",
            maxAge: 3600 * 24 * 30,
            sameSite: true,
          });
          dispatch(
            setLoginUser({
              user: data,
              token: data.token,
              isLoggedIn: true,
              kidRole: data?.parent_id
                ? kidAccountRole.family
                : kidAccountRole.individual,
              currentLevel: data?.current_level,
              currentPlan: data?.current_plan,
              remainingCoins: data?.parent_id
                ? data?.coins_limit
                : data?.current_wallet?.remaining_coins,
              endpoint:
                data?.role === roles.author && data?.associate_with
                  ? "partner-author"
                  : "partner",
            })
          );
          if (data?.role === roles.parent) {
            dispatch(
              setBreadCrumb({
                crumbs: [
                  {
                    title: "Dashboard",
                  },
                ],
              })
            );
            if (router?.pathname === routeConstant.plans.path) {
              router.push(parentPanelConstant.plans.path);
            } else {
              router.push(parentPanelConstant.dashboard.path);
            }
          } else if (data?.role === roles.reader) {
            if (router?.pathname === routeConstant.plans.path) {
              router.push(kidPanelConstant.plans.path);
            } else {
              router.push(kidPanelConstant.home.path);
            }
          } else {
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
          }
          handleClose();
        } else {
          if (data && !data.is_email_verified) {
            dispatch(
              setLoginUser({
                user: {
                  email: payload.email,
                  password: payload.password,
                  role: login?.user?.role,
                },
                token: null,
                isLoggedIn: false,
              })
            );
            handleNavigate(forms.otp);
          }
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        var errors = err?.response?.data?.errors;
        if (errors) {
          for (var key in errors) {
            toastMessage("error", errors[key][0]);
          }
        }
      })
      .finally(() => action.setSubmitting(false));
  };

  const { handleChange, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  const handleSignUp = () => {
    handleNavigate(forms.signup);
  };

  const handleEmailVerification = () => {
    dispatch(
      setLoginUser({
        user: { email: "", role: login?.user?.role },
        token: null,
        isLoggedIn: false,
      })
    );
    handleNavigate(forms.emailVerification);
  };

  return (
    <>
      <ModalHeader
        close={handleClose}
        headerStyle={styles.header}
        back={() => handleNavigate(forms.welcome)}
        isFirst={login?.user?.role === roles.publisher}
      />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center pb-5 pt-3"
        )}
      >
        <form
          className={classNames("d-flex flex-column align-items-center")}
          onSubmit={(e) => e.preventDefault()}
        >
          <label className={classNames(styles.heading, "mb-3")}>
            {login?.user?.role === roles.publisher
              ? "Welcome To Alif Laila ! "
              : "Welcome Back !"}
          </label>

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
            customInputContainer={styles.inputContainer}
          />
          <CustomInput
            label="Password"
            placeholder="**********"
            type="password"
            required
            customLabelStyle={classNames(styles.inputLabel)}
            customInputStyle={classNames(styles.inputStyle)}
            value={values.password}
            error={touched.password && errors.password ? errors.password : ""}
            onChange={handleChange("password")}
            customInputContainer={styles.inputContainer}
            isPassword
          />

          <div className={classNames("d-flex justify-content-end w-100")}>
            <div
              className={styles.forgot}
              onClick={() => handleEmailVerification()}
            >
              Forgot password?
            </div>
          </div>

          <CustomButton
            title="Login"
            containerStyle={classNames(styles.btnStyle, "my-3")}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />

          {login?.user?.role !== roles.publisher ? (
            <div className={classNames("d-flex flex-column gap-3 gap-xxl-4")}>
              <div className={styles.signupContnr}>
                <div className={classNames(styles.signupText)}>
                  Don’t have an account?
                  <span
                    onClick={() => handleSignUp()}
                    className={classNames("ms-2")}
                  >
                    Sign up now
                  </span>
                </div>
              </div>
              <div className={classNames(styles.divider)}>
                <label className={classNames(styles.dividerTxt)}>Or</label>
              </div>
              <SocialAuth handleClose={handleClose} />
            </div>
          ) : null}
        </form>
      </div>
    </>
  );
};

export default LoginModal;
