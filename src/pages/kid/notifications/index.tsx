import classNames from "classnames";
import React, { useRef, useState } from "react";
import Footer from "shared/components/footer";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import styles from "./style.module.scss";
import { BackArrow2Icon, DefaultBookImg, defaultAvatar } from "assets";
import { NotificationsTabs } from "shared/utils/pageConstant/kid/notificationsConstants";
import Image from "next/image";
import { useRouter } from "next/router";
import { useScroll } from "shared/customHook/useScoll";

const Notifications = () => {
  const router = useRouter();
  const bodyRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<string>(NotificationsTabs[0]);
  useScroll(bodyRef);

  return (
    <>
      <ReaderNavWrapper />
      <div
        style={{ backgroundColor: "rgb(252,252,252)" }}
        className={classNames(styles.topLevelContainer)}
        ref={bodyRef}
      >
        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          <div
            className={classNames(
              styles.notificationContainer,
              "my-5 px-4 py-3"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-between w-100"
              )}
            >
              <div className={classNames("d-flex align-items-center gap-3")}>
                <BackArrow2Icon
                  className={classNames(styles.arrowIcon)}
                  onClick={() => {
                    router.back();
                  }}
                  role="button"
                />
                <label className={classNames(styles.title)}>
                  All Notifications
                </label>
              </div>
              <div className={classNames(styles.toggleContainer)}>
                {NotificationsTabs.map((itm, inx) => {
                  return (
                    <label
                      className={classNames(
                        styles.toggleLabel,
                        activeTab === itm && styles.activeTabStyle
                      )}
                      role="button"
                      onClick={() => {
                        setActiveTab(itm);
                      }}
                      key={inx}
                    >
                      {itm}
                    </label>
                  );
                })}
              </div>
            </div>
            <label
              className={classNames(styles.clearNotificationsLabel, "py-2")}
              role="button"
            >
              Clear All Notifications
            </label>
            <div className={classNames(styles.notificationsListContainer)}>
              <NotifyCard />
              <NotifyCard />
              <NotifyCard isUser />
              <NotifyCard />
              <NotifyCard />
              <NotifyCard isUser />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

interface NotifyCardProps {
  isUser?: boolean;
}

const NotifyCard = ({ isUser }: NotifyCardProps) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center  justify-content-between py-3 w-100",
        styles.singleNotifyContainer
      )}
    >
      <div className={classNames("d-flex align-items-center gap-2 gap-md-3")}>
        {isUser ? (
          <Image
            src={defaultAvatar}
            className={classNames(styles.userAvatar)}
            alt="user-avatar"
          />
        ) : (
          <div className={classNames(styles.imgContainer)}>
            <Image
              src={DefaultBookImg}
              className={classNames(styles.bookStyle)}
              alt="book-cover"
            />
          </div>
        )}

        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-between gap-1 gap-md-2"
          )}
        >
          <label className={classNames(styles.bookTitle)}>
            Ghass ki Guriya
          </label>
          <label className={classNames(styles.message)}>
            New book Added by Ehya’s Publishers
          </label>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-1"
            )}
          >
            <Image
              src={defaultAvatar}
              className={classNames(styles.avatarStyle)}
              alt="avatar"
            />
            <label className={classNames(styles.assignee)}>
              From: <span>Parent</span>
            </label>
          </div>
        </div>
      </div>
      <label className={classNames(styles.timeLabel)}>2 hrs ago</label>
    </div>
  );
};

export default Notifications;
