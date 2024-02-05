import classNames from "classnames";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import ModalHeader from "shared/components/modalHeader";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { AgeVS } from "shared/utils/validations";
import { forms } from "../../constants";
import styles from "./style.module.scss";
import { ClearIcon } from "assets";
import { useEffect, useState } from "react";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { SocialRegister } from "shared/services/authService";
import { toastMessage } from "shared/components/common/toast";
import { useCookies } from "react-cookie";
import { kidAccountRole, roles } from "shared/utils/enum";
import {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
  routeConstant,
} from "shared/routes/routeConstant";
import { useRouter } from "next/router";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";

interface VerifyAgeModalProps {
  handleClose: () => void;
}

interface InitialValues {
  age: string;
}

const VerifyAgeModal = ({ handleClose }: VerifyAgeModalProps) => {
  const { auth, login } = useSelector((state: any) => state.root);

  const initialValues: InitialValues = {
    age: "",
  };

  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [age, setAge] = useState<any>({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AgeVS,
    onSubmit: (value, action) => {
      if (auth?.prevModal === forms?.login) {
        action?.setSubmitting(true);
        handleSocialRegister(value, action);
      } else {
        dispatch(
          setLoginUser({
            user: {
              email: login?.user?.email,
              role: login?.user?.role,
              age: value?.age,
            },
            token: null,
            isLoggedIn: false,
          })
        );
        handleNavigate(forms.signup);
      }
    },
  });

  const { setFieldValue, handleSubmit, values, touched, errors, isSubmitting } =
    formik;

  const handleSocialRegister = (value: InitialValues, action: any) => {
    let payload = { ...login?.user, birth_year: value?.age };
    SocialRegister(payload)
      .then(({ data: { data, status, message } }) => {
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
          toastMessage("success", "Logged In Successfully");
          handleClose();
        } else {
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
      .finally(() => {
        action?.setSubmitting(false);
      });
  };

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };

  const handleBackSpace = () => {
    let input: any = document.getElementById(`age-input-${selectedIndex}`);
    if (input.value === "") {
      if (selectedIndex !== 0) {
        document?.getElementById(`age-input-${selectedIndex - 1}`)?.focus();
        setSelectedIndex(selectedIndex - 1);
      } else if (selectedIndex === 0) {
        input.focus();
      }
    } else {
      input.focus();
    }
    if (selectedIndex > -1 && selectedIndex < 4) {
      let temp = { ...age };
      temp[selectedIndex] = "";
      setAge(temp);
      input.value = "";
    }
  };

  useEffect(() => {
    let temp = "";
    Object.values(age).map((itm, inx) => {
      temp += itm;
    });
    setFieldValue("age", temp);
  }, [age]);

  return (
    <>
      <ModalHeader
        close={handleClose}
        headerStyle={styles.header}
        back={() => handleNavigate(auth?.prevModal)}
      />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center  pb-3 pt-3"
        )}
      >
        <div
          className={classNames(
            styles.formContainer,
            "d-flex flex-column align-items-center"
          )}
        >
          <label className={classNames(styles.heading, "mb-2")}>
            Kids, verify age to continue
          </label>
          <label className={classNames(styles.subTitle, "mb-4")}>
            Please enter your birth year{" "}
            <label className={classNames(styles.highlighted)}>*</label>
          </label>

          <div
            className={classNames(
              "d-flex align-items-center justify-content-between gap-3 mb-4 mb-xxl-5 position-relative"
            )}
          >
            <>
              {Array.from(Array(4).keys()).map((itm, inx) => {
                return (
                  <AgeInput
                    setAge={setAge}
                    age={age}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    index={inx}
                    key={inx}
                    handleBackSpace={handleBackSpace}
                  />
                );
              })}
            </>
            {touched.age && errors.age ? (
              <label className={classNames(styles.error)}> {errors.age}</label>
            ) : (
              ""
            )}
          </div>

          <div
            className={classNames(
              "d-flex align-items-center justify-content-center flex-wrap gap-2 position-relative"
            )}
          >
            {Array.from(Array(10).keys()).map((itm, inx) => {
              return (
                <div
                  className={classNames(styles.number)}
                  key={inx}
                  onClick={() => {
                    let input: any = document.getElementById(
                      `age-input-${selectedIndex}`
                    );
                    if (selectedIndex !== 3) {
                      document
                        ?.getElementById(`age-input-${selectedIndex + 1}`)
                        ?.focus();
                      setSelectedIndex(selectedIndex + 1);
                    } else if (selectedIndex === 3) {
                      input?.focus();
                    }
                    let temp = { ...age };

                    if (inx === 9) {
                      input.value = 0;
                      temp[selectedIndex] = 0;
                    } else {
                      input.value = inx + 1;
                      temp[selectedIndex] = inx + 1;
                    }
                    setAge(temp);
                  }}
                >
                  {inx === 9 ? 0 : inx + 1}
                </div>
              );
            })}
            <div
              className={classNames(styles.crossIcon)}
              onClick={handleBackSpace}
              role="button"
            >
              <ClearIcon className={classNames(styles.iconStyle)} />
            </div>
          </div>

          <CustomButton
            title="Next"
            containerStyle={classNames(styles.btn, "mt-4")}
            onClick={() => handleSubmit()}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

const AgeInput = ({
  setSelectedIndex,
  index,
  age,
  setAge,
  selectedIndex,
  handleBackSpace,
}: any) => {
  return (
    <input
      id={`age-input-${index}`}
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
          if (age[index]) {
            e.target.value = age[index];
          } else {
            e.target.value = 0;
            let temp = { ...age };
            temp[index] = 0;
            setAge(temp);
          }
        }
        if (selectedIndex !== 3) {
          document?.getElementById(`age-input-${selectedIndex + 1}`)?.focus();
          setSelectedIndex(selectedIndex + 1);
        }
      }}
      onChange={(e) => {
        let temp = { ...age };
        temp[index] = Number(e.target.value);
        setAge(temp);
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
            document?.getElementById(`age-input-${selectedIndex + 1}`)?.focus();
            setSelectedIndex(selectedIndex + 1);
          }
        }
      }}
    />
  );
};

export default VerifyAgeModal;
