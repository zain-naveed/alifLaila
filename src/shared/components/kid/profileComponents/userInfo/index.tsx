import {
  GradeIcon,
  MailFilledIcon,
  SchoolOutline,
  UserPolygonIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import { kidAccountRole } from "shared/utils/enum";

const UserInfo = () => {
  const {
    login: { user, kidRole },
  } = useSelector((state: any) => state.root);
  return (
    <div
      className={classNames(
        "d-flex flex-column flex-md-row align-items-center justify-content-start mb-4 gap-3"
      )}
    >
      <img
        src={
          user?.reader?.profile_picture
            ? user?.reader?.profile_picture
            : defaultAvatar.src
        }
        alt="profile-pic"
        className={classNames(styles.userAvatar)}
        height={80}
        width={80}
      />
      <div
        className={classNames(
          "d-flex flex-column align-items-center align-items-sm-start justify-content-between gap-4 "
        )}
      >
        <label className={classNames(styles.name)}>
          {user?.reader?.full_name}
        </label>

        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-4 flex-wrap"
          )}
        >
          <StatCard
            title="Age:"
            Icon={UserPolygonIcon}
            label={`${user?.reader?.age} Years`}
          />
          <StatCard
            title="Grade:"
            Icon={GradeIcon}
            label={user?.reader?.grade ? `${user?.reader?.grade} Grade` : ""}
          />
          <StatCard
            title={
              kidRole === kidAccountRole.individual ? "Email:" : "Username:"
            }
            Icon={MailFilledIcon}
            label={
              kidRole === kidAccountRole.individual
                ? user?.email
                : user?.username
            }
          />
          <StatCard
            title="School Name"
            Icon={SchoolOutline}
            label={user?.reader?.school}
          />
        </div>
      </div>
    </div>
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
        "d-flex flex-column align-items-start justify-content-start gap-1"
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

export default UserInfo;
