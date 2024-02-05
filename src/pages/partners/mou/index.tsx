import { NoFavBookIcon } from "assets";
import { useFormik } from "formik";
import moment from "moment";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import Agreement from "shared/components/publisher/mouComponents/agreement";
import Signature from "shared/components/publisher/mouComponents/signature";
import SupportHeader from "shared/components/supportHeader";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { getUser } from "shared/services/kid/userService";
import { DeclineMou, SignMou } from "shared/services/publisher/mouService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { accountStatus, mouStatus, roles } from "shared/utils/enum";
import { classNames, withError } from "shared/utils/helper";
import {
  publisherPathConstants,
  partnerPendingPathConstants,
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import { signMouVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface InitialValues {
  signature: string;
  isDrawn: boolean;
}
function MOU({
  mous,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const account_status = JSON.parse(user ? user : "{}")?.status;
  const isParentEnabled = JSON.parse(user ?? "{}")?.is_partner_enabled_server;
  const { login } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();
  const [mouData, setMouData] = useState<any[]>(mous?.data);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: InitialValues = {
    signature: "",
    isDrawn: true,
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: signMouVS,
    onSubmit: (value) => {
      handleAgreement(value);
    },
  });
  const {
    handleSubmit,
    values,
    touched,
    errors,
    resetForm,
    setFieldValue,
    isSubmitting,
    setSubmitting,
  } = formik;

  function handleAgreement(value: InitialValues) {
    let formData = new FormData();
    formData.append("mou_id", mouData[selectedIndex]?.id);
    if (value.isDrawn) {
      formData.append("signature_type", "1");
      formData.append("signature", value.signature);
    } else {
      formData.append("signature_type", "2");
      formData.append("signature_file", value.signature);
    }
    SignMou(formData)
      .then(({ data: { status, data, message } }) => {
        if (status == true) {
          let filterArr = mouData?.filter(
            (itm, inx) => itm?.id !== mouData[selectedIndex]?.id
          );
          filterArr.unshift(data);
          setMouData(filterArr);
          toastMessage("success", message);
          resetForm();
          if (login?.user?.status !== accountStatus.approved) {
            //this for first mou signed, we need to sync account status of user with backend
            handleGetProfileInfo();
          }
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.response.data.message);
      })
      .finally(() => setSubmitting(false));
  }

  const handleDecline = () => {
    setLoading(true);
    DeclineMou(mouData[selectedIndex]?.id)
      .then(({ data: { status, data, message } }) => {
        if (status == true) {
          let filterArr = mouData?.filter(
            (itm, inx) => itm?.id !== mouData[selectedIndex]?.id
          );
          filterArr.unshift(data);
          setMouData(filterArr);
          toastMessage("success", message);
          resetForm();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  const handleGetProfileInfo = () => {
    getUser()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(
            setLoginUser({
              user: data,
              endpoint:
                data?.role === roles.author && data?.associate_with
                  ? "partner-author"
                  : "partner",
            })
          );
          if (data?.role === roles.author) {
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
          window.location.reload();
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "MOU",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper
      navigationItems={
        account_status === accountStatus.pending
          ? partnerPendingPathConstants
          : login?.user?.role === roles.publisher
          ? isParentEnabled
            ? publisherPartnerEnabledPathConstants
            : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      {mouData?.length > 0 ? (
        <>
          <div className={classNames("d-flex row m-0 p-0")}>
            <div
              className={classNames(
                "gap-3 col-12 col-lg-4 p-0 d-flex flex-column",
                styles.leftContainer
              )}
            >
              {mouData?.map((itm, inx) => {
                return (
                  <>
                    <div
                      className={classNames(
                        styles.mouItemContainer,
                        "px-3 py-2",
                        inx === selectedIndex && styles.active
                      )}
                      key={inx}
                      onClick={() => {
                        setSelectedIndex(inx);
                      }}
                    >
                      <div
                        className={classNames(
                          styles.statusContainer,
                          itm?.status === mouStatus.declined && styles.decline,
                          itm?.status === mouStatus.pending && styles.pending
                        )}
                      >
                        <span>
                          {itm?.status === mouStatus.declined
                            ? "Declined"
                            : itm?.status === mouStatus.pending
                            ? "Pending"
                            : "Agreed"}
                        </span>
                      </div>
                      <div
                        className={classNames(
                          "d-flex align-items-center justify-content-between w-100"
                        )}
                      >
                        <label className={classNames(styles.mouTitle)}>
                          {itm?.title}
                        </label>
                        <label className={classNames(styles.mouDate)}>
                          {moment(itm?.created_at).format("DD-MM-YYYY")}
                        </label>
                      </div>
                      <label className={classNames(styles.mouDesc)}>
                        {itm?.agreement}
                      </label>
                    </div>
                    {selectedIndex === inx ? (
                      <div
                        className={classNames(
                          "col-12 d-flex d-lg-none flex-column mb-3 p-0 m-0 mt-2"
                        )}
                      >
                        <SupportHeader
                          heading={
                            mouData[selectedIndex]?.status === mouStatus.pending
                              ? "Sign MOU Contract"
                              : mouData[selectedIndex]?.status ===
                                mouStatus.accepted
                              ? "Signed MOU Contract"
                              : mouData[selectedIndex]?.status ===
                                mouStatus.declined
                              ? "Declined MOU Contract"
                              : ""
                          }
                          title={"Sign this contract to publish books."}
                          status={mouData[selectedIndex]?.status}
                        />
                        <div
                          className={classNames(
                            styles.contentContainer,
                            "px-4"
                          )}
                          style={
                            mouData[selectedIndex]?.status !== mouStatus.pending
                              ? { border: "0px" }
                              : {}
                          }
                        >
                          <Agreement mouData={mouData[selectedIndex]} />
                          {mouData[selectedIndex]?.status ===
                          mouStatus.pending ? (
                            <>
                              <Signature
                                setFieldValue={setFieldValue}
                                errorMsg={
                                  errors.signature && touched.signature
                                    ? errors.signature
                                    : ""
                                }
                              />
                              <div
                                className={classNames(
                                  "d-flex align-items-center justify-content-end gap-2 my-4"
                                )}
                              >
                                <CustomButton
                                  title="Decline MOU"
                                  containerStyle={classNames(styles.declineBtn)}
                                  onClick={handleDecline}
                                  loading={loading}
                                  disabled={loading}
                                />
                                <CustomButton
                                  title="Agree & Continue"
                                  containerStyle={classNames(styles.agreeBtn)}
                                  onClick={() => handleSubmit()}
                                  loading={isSubmitting}
                                  disabled={isSubmitting}
                                />
                              </div>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })}
            </div>
            <div
              className={classNames(
                "col-12 col-lg-8 d-none d-lg-flex flex-column mb-3"
              )}
            >
              <SupportHeader
                heading={
                  mouData[selectedIndex]?.status === mouStatus.pending
                    ? "Sign MOU Contract"
                    : mouData[selectedIndex]?.status === mouStatus.accepted
                    ? "Signed MOU Contract"
                    : mouData[selectedIndex]?.status === mouStatus.declined
                    ? "Declined MOU Contract"
                    : ""
                }
                title={"Sign this contract to publish books."}
                status={mouData[selectedIndex]?.status}
              />
              <div
                className={classNames(styles.contentContainer, "px-4")}
                style={
                  mouData[selectedIndex]?.status !== mouStatus.pending
                    ? { border: "0px" }
                    : {}
                }
              >
                <Agreement mouData={mouData[selectedIndex]} />
                {mouData[selectedIndex]?.status === mouStatus.pending ? (
                  <>
                    <Signature
                      setFieldValue={setFieldValue}
                      errorMsg={
                        errors.signature && touched.signature
                          ? errors.signature
                          : ""
                      }
                    />
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-end gap-2 my-4"
                      )}
                    >
                      <CustomButton
                        title="Decline MOU"
                        containerStyle={classNames(styles.declineBtn)}
                        onClick={handleDecline}
                        loading={loading}
                        disabled={loading}
                      />
                      <CustomButton
                        title="Agree & Continue"
                        containerStyle={classNames(styles.agreeBtn)}
                        onClick={() => handleSubmit()}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={classNames(styles.notContentFoundContnr)}>
          <NoContentCard
            label1="No MOU's Found"
            label2="This page is initially left blank. Check back later for updates."
            customContainer={classNames("gap-0")}
            Icon={NoFavBookIcon}
          />
        </div>
      )}
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const mouRes = await fetch(BaseURL + endpoint + Endpoint.partner.mou.get, {
    headers: {
      Authorization: "Bearer " + req.cookies.token,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    next: { revalidate: 3600 },
  });
  const mous = await mouRes.json();

  return { props: { mous, user: req?.cookies?.user } };
});

export default MOU;
