import { DownloadIcon } from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Footer from "shared/components/footer";
import KidHeaderSection from "shared/components/kid/headerSection";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import BadgeInfoModal from "shared/modal/badgeInfo";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { badgesTypes } from "shared/utils/enum";
import { downloadLink, withError } from "shared/utils/helper";
import styles from "./style.module.scss";
import NoContentCard from "shared/components/common/noContentCard";
const ProgressLevel = ({
  achieveData,
  badgesData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [selectedAchivement, setSelectedAchivement] = useState<any>(null);

  const handleShowBadgeModal = () => {
    setShowBadgeModal(true);
  };

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);
  };

  useScroll(bodyRef);
  return (
    <>
      <ReaderNavWrapper />
      <div
        style={{ backgroundColor: "rgb(252,252,252)" }}
        className={classNames(styles.topLevelContainer)}
        ref={bodyRef}
      >
        <KidHeaderSection
          title="Badges"
          subTitle="Open up a world of imagination and wonder with our digital library"
          isBadges
        />
        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          {Object.values(badgesData?.data)?.length > 0 ? (
            <>
              {Object.values(badgesData?.data)?.map((itm: any, inx: any) => {
                const achivement = achieveData?.data?.level_results[inx + 1];
                return inx !== 4 ? (
                  <ProgressLevelCard
                    item={itm}
                    key={inx}
                    index={inx}
                    achivement={achivement}
                  />
                ) : (
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-center justify-content-center mt-4 gap-3"
                    )}
                    key={inx}
                  >
                    <div
                      className={classNames(
                        styles.championContainer,
                        "d-flex align-items-center justify-content-center"
                      )}
                      onClick={() => {
                        setSelectedBadge(itm[0]);
                        setSelectedAchivement(achivement);
                        handleShowBadgeModal();
                      }}
                      role="button"
                    >
                      <img
                        src={itm[0]?.image}
                        className={classNames(
                          styles.championIcon,
                          !achivement?.is_completed && styles.grayScale
                        )}
                        alt="champion-badge"
                      />
                    </div>
                    <label
                      className={classNames(styles.championLabel)}
                      onClick={() => {
                        setSelectedBadge(itm[0]);
                        setSelectedAchivement(achivement);
                        handleShowBadgeModal();
                      }}
                      role="button"
                    >
                      {itm[0]?.name}
                    </label>
                  </div>
                );
              })}
            </>
          ) : (
            <NoContentCard
              label1="No Data Found"
              label2="There are no badges available"
              customContainer={classNames("mt-5")}
            />
          )}
        </div>
        <Footer />
      </div>
      {showBadgeModal ? (
        <BadgeInfoModal
          show={showBadgeModal}
          handleClose={handleCloseBadgeModal}
          item={selectedBadge}
          shareId={null}
          isAchieved={selectedAchivement?.status}
        />
      ) : null}
    </>
  );
};

interface ProgressLevelCardProps {
  index: number;
  item: any;
  achivement: any;
}

const ProgressLevelCard = ({
  index,
  item,
  achivement,
}: ProgressLevelCardProps) => {
  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-center mt-4 gap-2 gap-xxl-3"
        )}
      >
        <label className={classNames(styles.title)}>
          {index === 0
            ? "Level 1"
            : index === 1
            ? "Level 2"
            : index === 2
            ? "Level 3"
            : "Level 4"}
        </label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between flex-wrap w-100 gap-1 gap-xxl-3"
          )}
        >
          {item?.map((itm: any, inx: number) => {
            return <Badge item={itm} key={inx} achivement={achivement} />;
          })}
        </div>
      </div>
    </>
  );
};

const Badge = ({ item, achivement }: any) => {
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [progress, setProgress] = useState<any>(null);

  const handleShowBadgeModal = () => {
    setShowBadgeModal(true);
  };

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);
  };

  useEffect(() => {
    if (item?.type === badgesTypes.reading_streak) {
      setProgress(achivement?.reading_streak);
    } else if (item?.type === badgesTypes.super_reader) {
      setProgress(achivement?.super_reader);
    } else if (item?.type === badgesTypes.quiz_whiz) {
      setProgress(achivement?.quiz_whiz);
    } else {
      setProgress({
        status: 1,
        percentage: 100,
        share_id: null,
      });
    }
  }, []);

  return (
    <>
      <div
        className={classNames(
          styles.badgeContainer,
          "px-4 gap-1 position-relative pointer"
        )}
        onClick={() => {
          handleShowBadgeModal();
        }}
      >
        <img
          src={item?.image}
          alt=""
          className={classNames(
            styles.badgeIcon,
            !progress?.status && styles.grayScale
          )}
        />
        {progress?.status ? (
          <DownloadIcon
            className={classNames(styles.shareIcon)}
            onClick={(e: any) => {
              e.stopPropagation();
              downloadLink(item?.image, "badge");
            }}
          />
        ) : null}

        <label className={classNames(styles.badgeLabel)}>{item?.name}</label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100 gap-2"
          )}
        >
          <div className={classNames(styles.progressConntainer)}>
            <div
              className={classNames(styles.progress)}
              style={{
                width: `${progress?.percentage}%`,
              }}
            />
          </div>
          <label className={classNames(styles.percentLabel)}>
            {progress?.percentage}%
          </label>
        </div>
      </div>
      {showBadgeModal ? (
        <BadgeInfoModal
          show={showBadgeModal}
          handleClose={handleCloseBadgeModal}
          item={item}
          shareId={progress?.share_id}
          isAchieved={progress?.status}
        />
      ) : null}
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const [achieveResp, badgesResp] = await Promise.all([
    fetch(BaseURL + Endpoint.kid.user.getAchievements, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + Endpoint.kid.badges.listAll, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
  ]);
  const [achieveData, badgesData] = await Promise.all([
    achieveResp.json(),
    badgesResp.json(),
  ]);

  return { props: { achieveData, badgesData } };
});

export default ProgressLevel;
