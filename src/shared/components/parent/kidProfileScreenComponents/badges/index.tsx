import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import BadgeInfoModal from "shared/modal/badgeInfo";
import { badgesTypes } from "shared/utils/enum";
import styles from "./style.module.scss";
import { DownloadIcon } from "assets";
import { downloadLink } from "shared/utils/helper";

interface Props {
  achivementData: any;
  badgesData: any;
}

const KidBadges = ({ achivementData, badgesData }: Props) => {
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [selectedAchivement, setSelectedAchivement] = useState<any>(null);

  const handleShowBadgeModal = () => {
    setShowBadgeModal(true);
  };

  const handleCloseBadgeModal = () => {
    setShowBadgeModal(false);
  };
  return (
    <div className={classNames(styles.wrapper)}>
      <div
        className={classNames(
          "d-flex flex-column align-items-start gap-1 px-4 pt-4 pb-3"
        )}
      >
        <Heading
          heading="Badges & Level Details"
          headingStyle={styles.bookMainHeading}
        />
        <Title
          title="Kid Level Progress & Achieved Badges"
          titleStyle={styles.bookMainTitle}
        />
      </div>
      <div className={classNames(styles.seperator)} />
      <div className={classNames(styles.wrapper, "pb-4 px-4")}>
        {badgesData
          ? Object?.values(badgesData)?.map((itm: any, inx: number) => {
              const achivement = achivementData?.level_results[inx + 1];
              return inx !== 4 ? (
                <ProgressLevelCard
                  key={inx}
                  index={inx}
                  item={itm}
                  achivement={achivement}
                />
              ) : (
                <div
                  className={classNames(
                    "d-flex flex-column align-items-center justify-content-center mt-5 gap-3"
                  )}
                >
                  <label className={classNames(styles.title)}>
                    Champion Level
                  </label>
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
                      height={130}
                      width={135}
                      className={classNames(
                        styles.championIcon,
                        !achivement?.is_completed && styles.grayScale
                      )}
                      alt="champion-badge"
                    />
                  </div>
                </div>
              );
            })
          : null}
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
    </div>
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
          "d-flex flex-column align-items-start justify-content-center mt-4 gap-3"
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
            "d-flex align-items-center justify-content-between flex-wrap w-100 gap-3"
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
        onClick={handleShowBadgeModal}
      >
        <img
          src={item?.image}
          alt=""
          height={100}
          width={100}
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

        <label className={classNames(styles.title)}>{item?.name}</label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100 gap-2"
          )}
        >
          <div className={classNames(styles.progressConntainer)}>
            <div
              className={classNames(styles.progress)}
              style={{ width: `${progress?.percentage}%` }}
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

export default KidBadges;
