import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import {
  FifthBadgeIcon,
  FirstBadgeIcon,
  ForthBadgeIcon,
  LeaderShipBoardAvatar2,
  LeaderShipBoardAvatar3,
  LeaderShipBoardAvatar4,
  LeaderShipBoardAvatar5,
  LeaderShipBoardAvatar6,
  SecondBadgeIcon,
  ThirdBadgeIcon,
} from "assets";

interface LeaderShipCardProps {
  index: number;
  noBg?: boolean;
  itm: any;
}

const LeaderShipCard = ({ index, noBg, itm }: LeaderShipCardProps) => {
  return (
    <div
      className={classNames(styles.leaderShipContainer)}
      style={
        Number(index) % 2 == 0
          ? { backgroundColor: "white" }
          : { backgroundColor: noBg ? "transparent" : "#FFFBF3" }
      }
    >
      <div
        className={classNames(
          styles.leadherShipSubContainer,
          index === 0 && styles.content1,
          index === 4 && styles.content2
        )}
        style={
          index === 0
            ? { backgroundColor: "#f9a11b" }
            : index === 1
            ? { backgroundColor: "#1897A6" }
            : index === 2
            ? { backgroundColor: "#9A469B" }
            : index === 3
            ? { backgroundColor: "#C2D52E" }
            : index === 4
            ? { backgroundColor: "#58C0BF" }
            : {}
        }
      >
        <img
          src={
            itm?.user?.profile_picture
              ? itm?.user?.profile_picture
              : index === 0
              ? LeaderShipBoardAvatar2
              : index === 1
              ? LeaderShipBoardAvatar3
              : index === 2
              ? LeaderShipBoardAvatar4
              : index === 3
              ? LeaderShipBoardAvatar5
              : LeaderShipBoardAvatar6
          }
          className={classNames(styles.avatarStyle)}
          alt="profile-pic"
          height={103}
          width={103}
        />
        <div
          className={classNames(
            "w-100 d-flex align-items-center justify-content-around"
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-center"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-1"
              )}
            >
              <label className={classNames(styles.winnerName)}>
                {itm?.user?.full_name}
              </label>
              <label className={classNames(styles.winnerGrade)}>
                - {itm?.user?.grade} Grade
              </label>
            </div>
            <label className={classNames(styles.winnerAge)}>
              {itm?.user?.age} years
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-center"
            )}
          >
            <label className={classNames(styles.winnerStatCount)}>
              {itm?.badges_count}
            </label>
            <label className={classNames(styles.winnerGrade)}>
              Total Badges
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-center"
            )}
          >
            <label className={classNames(styles.winnerStatCount)}>
              {itm?.books_read}
            </label>
            <label className={classNames(styles.winnerGrade)}>
              Books Completed
            </label>
          </div>
        </div>
        <Image
          src={
            index === 0
              ? FirstBadgeIcon
              : index === 1
              ? SecondBadgeIcon
              : index === 2
              ? ThirdBadgeIcon
              : index === 3
              ? ForthBadgeIcon
              : index === 4
              ? FifthBadgeIcon
              : FirstBadgeIcon
          }
          alt="badge-pic"
          className={classNames(styles.iconStyle)}
        />
      </div>
    </div>
  );
};

export default LeaderShipCard;
