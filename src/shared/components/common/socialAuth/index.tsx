import { FacebookIcon, GoogleIcon } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
import Image from "next/image";
import {
  IResolveParams,
  LoginSocialFacebook,
  LoginSocialGoogle,
} from "reactjs-social-login";
import { FacebookAppId, GoogleAPI } from "shared/utils/endpoints";
import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { kidAccountRole, roles } from "shared/utils/enum";
import { SocialLogin, SocialRegister } from "shared/services/authService";
import { toastMessage } from "../toast";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "shared/modal/auth/constants";
import { useCookies } from "react-cookie";
import {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
  routeConstant,
} from "shared/routes/routeConstant";
import { useRouter } from "next/router";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";

function SocialAuth({ handleClose }: any) {
  const { login } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const router = useRouter();
  const [cookie, setCookie] = useCookies();
  const [gloading, setGloading] = useState<boolean>(false);
  const [fbloading, setFBloading] = useState<boolean>(false);

  const onSuccess = async (data: any, provider: string) => {
    let payload1: any = {};
    let payload2: any = {};

    if (provider === "google") {
      setGloading(true);
      payload2["first_name"] = data?.given_name;
      payload2["last_name"] = data?.family_name;
      payload2["email"] = data?.email;
      payload1["social_platform"] = 1;
      payload2["social_platform"] = 1;
      payload1["social_login_id"] = data.sub;
      payload2["social_login_id"] = data.sub;
      if (data.picture) {
        payload2["profile_picture"] = data.picture;
      }
    } else if (provider === "facebook") {
      setFBloading(true);
      payload2["first_name"] = data?.first_name;
      payload2["last_name"] = data?.last_name;
      if (data?.email) {
        payload2["email"] = data?.email;
      }
      payload1["social_platform"] = 2;
      payload2["social_platform"] = 2;
      payload1["social_login_id"] = data.userID;
      payload2["social_login_id"] = data.userID;
      if (data.picture) {
        payload2["profile_picture"] = data.picture.data.url;
      }
    }
    payload2["role"] = login?.user?.role;
    SocialLogin(payload1)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data?.token) {
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
          } else if (data?.social_exist === false) {
            if (login?.user?.role === roles.reader) {
              dispatch(
                setLoginUser({
                  user: {
                    ...payload2,
                  },
                  token: null,
                  isLoggedIn: false,
                })
              );
              handleNavigate(forms.verifyAge);
            } else {
              handleSocialRegister(payload2);
            }
          }
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setFBloading(false);
        setGloading(false);
      });
  };

  const handleSocialRegister = (payload: any) => {
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
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setFBloading(false);
        setGloading(false);
      });
  };

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path, prevModal: forms?.login }));
  };

  return (
    <div className={classNames("d-flex flex-column gap-0")}>
      {!gloading && !fbloading ? (
        <LoginSocialGoogle
          client_id={GoogleAPI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          cookie_policy="single_host_origin"
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          className="mb-3"
          onReject={(err) => {
            setFBloading(false);
            setGloading(false);
          }}
        >
          <div
            className={classNames(styles.socialIconContainer)}
            role={"button"}
          >
            <Image
              src={GoogleIcon}
              className={classNames(styles.iconStyle)}
              alt="google-logo"
            />
            <span className={classNames("mx-auto", styles.socialText)}>
              Continue with Google
            </span>
          </div>
        </LoginSocialGoogle>
      ) : gloading ? (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Spinner size="sm" animation="border" style={{ color: "#0f1106" }} />
        </div>
      ) : (
        <div className={classNames(styles.socialIconContainer)} role={"button"}>
          <Image
            src={GoogleIcon}
            className={classNames(styles.iconStyle)}
            alt="google-logo"
          />
          <span className={classNames("mx-auto", styles.socialText)}>
            Continue with Google
          </span>
        </div>
      )}

      {!fbloading && !gloading ? (
        <LoginSocialFacebook
          appId={FacebookAppId}
          className="mb-3"
          fieldsProfile={
            "id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
          }
          onResolve={({ provider, data }: IResolveParams) => {
            onSuccess(data, provider);
          }}
          onReject={(err) => {
            setFBloading(false);
            setGloading(false);
          }}
        >
          <div
            className={classNames(styles.socialIconContainer)}
            role={"button"}
          >
            <FacebookIcon className={classNames(styles.iconStyle)} />
            <span className={classNames("mx-auto", styles.socialText)}>
              Continue with Facebook
            </span>
          </div>
        </LoginSocialFacebook>
      ) : fbloading ? (
        <div
          className={classNames(styles.socialIconContainer, "mb-3")}
          role={"button"}
        >
          <Spinner size="sm" animation="border" style={{ color: "#0f1106" }} />
        </div>
      ) : (
        <div className={classNames(styles.socialIconContainer)} role={"button"}>
          <FacebookIcon className={classNames(styles.iconStyle)} />
          <span className={classNames("mx-auto", styles.socialText)}>
            Continue with Facebook
          </span>
        </div>
      )}
    </div>
  );
}

export default SocialAuth;
