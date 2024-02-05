import { InfoIcon, MailIcon2, UsersGroupIcon, defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { getCurrentPlan } from "shared/services/kid/plansService";
import { getNumberOfDays } from "shared/utils/helper";
import styles from "./style.module.scss";

interface SettingsHeaderProps {
  showPackageDetail?: boolean;
}

const SettingsHeader = ({ showPackageDetail }: SettingsHeaderProps) => {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [wallet, setWallet] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetWallet = () => {
    setLoading(true);
    getCurrentPlan()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setCurrentPlan(data);
          setWallet(data?.current_wallet);
          dispatch(
            setLoginUser({
              currentPlan: data,
              remainingCoins: data?.current_wallet?.remaining_coins,
            })
          );
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetWallet();
  }, []);

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-md-row flex-column align-items-start align-items-md-center justify-content-between w-100  mb-4 mb-sm-5 gap-4 gap-md-0 mt-4"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column flex-md-row align-items-center justify-content-start gap-3"
          )}
        >
          <img
            src={
              user?.parent?.profile_picture
                ? user?.parent?.profile_picture
                : defaultAvatar.src
            }
            alt="parent-profile-pic"
            height={80}
            width={80}
            className={classNames(styles.avtStyle)}
          />
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-start gap-2"
            )}
          >
            <label className={classNames(styles.name)}>
              {user?.parent?.full_name}
            </label>

            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-4 flex-wrap"
              )}
            >
              <StatCard title="Email" Icon={MailIcon2} label={user?.email} />
              <StatCard
                title="Total Kids"
                Icon={UsersGroupIcon}
                label={user?.total_kids}
              />
            </div>
          </div>
        </div>
        {!loading ? (
          <div
            className={classNames(
              "d-flex flex-lg-row flex-column align-items-center justify-content-end gap-2"
            )}
          >
            {showPackageDetail && currentPlan ? (
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center gap-2"
                )}
              >
                <InfoIcon className={classNames(styles.infoIcon)} />
                <label className={classNames(styles.expireTitle)}>
                  {getNumberOfDays(wallet?.expiry_date)} Days Left -
                </label>
                <label className={classNames(styles.packageName)}>
                  {currentPlan?.plan?.name}
                </label>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
};

interface StatCardProps {
  title: string;
  Icon: any;
  label: string;
}

const StatCard = ({ title, Icon, label }: StatCardProps) => {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-start justify-content-start gap-2"
      )}
    >
      <label className={classNames(styles.statTitle)}>{title}</label>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2"
        )}
      >
        <Icon className={classNames(styles.statIcon)} />
        <label className={classNames(styles.statLabel)}>{label}</label>
      </div>
    </div>
  );
};

export default SettingsHeader;
