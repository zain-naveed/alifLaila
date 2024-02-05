import {
  AwardIcon,
  GradeIcon,
  PencilIcon,
  SchoolOutline,
  UserPolygonIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddKidModal from "shared/modal/addKid";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import styles from "./style.module.scss";

interface ProfileInfoProps {
  profileData: any;
  showBottomBorder?: any;
}

const ProfileInfo = ({
  profileData,
  showBottomBorder = true,
}: ProfileInfoProps) => {
  const {
    login: { currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState<any>(profileData?.data);
  const [showAddKidModal, setShowAddKidModal] = useState<boolean>(false);

  const handleShowAddKidModal = () => {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowAddKidModal(true);
    }
  };

  const handleCloseAddKidModal = () => {
    setShowAddKidModal(false);
  };

  const handleAction = (val: any) => {
    setProfile(val);
    handleCloseAddKidModal();
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column flex-md-row align-items-center justify-content-start gap-3 mt-4 mb-4 mb-sm-5"
        )}
      >
        <img
          src={
            profile?.reader?.profile_picture
              ? profile?.reader?.profile_picture
              : defaultAvatar.src
          }
          alt="kid-profile-pic"
          height={80}
          width={80}
          className={classNames(styles.avtStyle)}
        />
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-start gap-2"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <label className={classNames(styles.name)}>
              {profile?.reader?.full_name}
            </label>
            <PencilIcon
              className={classNames(styles.editIcon)}
              onClick={handleShowAddKidModal}
            />
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-4 flex-wrap"
            )}
          >
            <StatCard
              title="Age"
              Icon={UserPolygonIcon}
              label={`${profile?.reader?.age} Year${
                profile?.reader?.age > 1 || profile?.reader?.age === 0
                  ? "s"
                  : ""
              }`}
            />
            <StatCard
              title="Grade"
              Icon={GradeIcon}
              label={
                profile?.reader?.grade ? `${profile?.reader?.grade} Grade` : ""
              }
            />
            <StatCard
              title="Level"
              Icon={AwardIcon}
              label={`Level ${profile?.current_level}`}
            />
            <StatCard
              title="School Name"
              Icon={SchoolOutline}
              label={profile?.reader?.school}
            />
          </div>
        </div>
      </div>
      {showBottomBorder ? (
        <div className={classNames(styles.seperator)} />
      ) : null}

      <AddKidModal
        showModal={showAddKidModal}
        handleClose={handleCloseAddKidModal}
        isEdit
        user={profile}
        handleAction={handleAction}
      />
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

export default ProfileInfo;
