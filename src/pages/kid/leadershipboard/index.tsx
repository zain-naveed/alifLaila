import {
  LeaderShipBoardAvatar1,
  NoReviewIcon,
  ReaderOfMonthBadge,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRef } from "react";
import NoContentCard from "shared/components/common/noContentCard";
import Footer from "shared/components/footer";
import KidHeaderSection from "shared/components/kid/headerSection";
import LeaderShipCard from "shared/components/kid/leaderShipCard";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import styles from "./style.module.scss";

const LeaderShipBoard = ({
  resp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const monthly = resp?.data?.month ? resp?.data?.month : null;
  const weekly = resp?.data?.week ? resp?.data?.week : null;
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <ReaderNavWrapper />

      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <KidHeaderSection
          title="Leadership Board"
          subTitle="Reader Spotlight: Acknowledging the outstanding readers of the month and week"
        />
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 d-flex  justify-content-center w-100"
          )}
        >
          {!monthly && !weekly ? (
            <div className={classNames("mt-5")}>
              <NoContentCard
                customContainer={"d-flex flex-column align-items-center gap-3"}
                Icon={NoReviewIcon}
                label1="No Kid Found"
                label2="There is no data available in the “Leadership Board” Page"
              />
            </div>
          ) : null}
          {monthly ? (
            <div
              className={classNames(
                styles.readerOfMonthContainer,
                "d-flex flex-column align-items-center"
              )}
            >
              <div
                className={classNames(
                  styles.readerOfMonthSubContainer,
                  "d-flex flex-column align-items-center justify-content-center px-4 gap-2 gap-sm-3 gap-lg-5"
                )}
              >
                <div
                  className={classNames(
                    "d-flex align-items-end justify-content-between w-100",
                    styles.userInfoContainer
                  )}
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-center gap-2"
                    )}
                  >
                    <img
                      src={
                        monthly?.user?.profile_picture
                          ? monthly?.user?.profile_picture
                          : LeaderShipBoardAvatar1
                      }
                      alt="profile-pic"
                      className={classNames(styles.avatarStyle)}
                    />
                    <label className={classNames(styles.winnerName)}>
                      {monthly?.user?.full_name}
                    </label>
                    <label className={classNames(styles.winnerAge)}>
                      {monthly?.user?.age} years
                    </label>
                  </div>
                  <ReaderOfMonthBadge
                    className={classNames(styles.badgeStyle)}
                  />
                </div>
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-start gap-3 w-100"
                  )}
                >
                  <div
                    className={classNames(
                      styles.statContainer,
                      "d-flex flex-column align-items-start justify-content-center px-3"
                    )}
                  >
                    <label className={classNames(styles.statCount)}>
                      {monthly?.badges_count}
                    </label>
                    <label className={classNames(styles.statLabel)}>
                      Total Badges
                    </label>
                  </div>
                  <div
                    className={classNames(
                      styles.statContainer,
                      "d-flex flex-column align-items-start justify-content-center px-3"
                    )}
                  >
                    <label className={classNames(styles.statCount)}>
                      {monthly?.books_read}
                    </label>
                    <label className={classNames(styles.statLabel)}>
                      Books Completed
                    </label>
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  styles.h100,
                  "d-flex flex-column align-items-center justify-content-center"
                )}
              >
                <label className={classNames(styles.title)}>
                  Reader Of the <span>month</span>
                </label>
                <label className={classNames(styles.timelabel)}>
                  {monthly?.period?.month}
                </label>
              </div>
            </div>
          ) : null}
        </div>
        {weekly ? (
          <>
            <div className={classNames(styles.weeklyTitleContainer, "mt-5")}>
              <div
                className={classNames(
                  styles.customContainer,
                  "px-3 px-sm-0 d-flex flex-column w-100"
                )}
              >
                <label className={classNames(styles.title)}>
                  Reader Of the <span>Week</span>
                </label>
                <label className={classNames(styles.timelabel)}>
                  {weekly[0]?.period?.start} to {weekly[0]?.period?.end}
                </label>
              </div>
            </div>
            {weekly?.map((itm: any, inx: number) => {
              return <LeaderShipCard key={inx} index={inx} itm={itm} />;
            })}
          </>
        ) : null}

        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const response = await fetch(
    BaseURL + Endpoint.kid.leadershipBoard.getStats,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const resp = await response.json();

  return { props: { resp } };
});

export default LeaderShipBoard;
