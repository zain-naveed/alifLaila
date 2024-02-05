import { CopyIcon } from "assets";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import ShareSocialMediaLink from "shared/components/common/shareLinks";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import { routeConstant } from "shared/routes/routeConstant";
import styles from "./style.module.scss";

interface BadgeInfoModalProps {
  show: boolean;
  handleClose: () => void;
  item: any;
  shareId: any;
  isAchieved?: boolean;
}

const BadgeInfoModal = ({
  show,
  handleClose,
  item,
  shareId,
  isAchieved,
}: BadgeInfoModalProps) => {
  const [showShare, setShowShareOptions] = useState<boolean>(false);
  const handleCopyToClipboard = () => {
    const textToCopy =
      window.location.protocol +
      "//" +
      window.location.host +
      routeConstant.share.path.replace(":id", shareId);
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toastMessage("success", "Link copied");
      })
      .catch((error) => {});
  };
  const onClose = () => {
    handleClose();
    setShowShareOptions(false);
  };
  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader close={onClose} isFirst={true} headerStyle={styles.header} />
      <div
        className={classNames(
          "d-flex flex-column align-items-center justify-content-center px-4 pb-4"
        )}
      >
        <img
          src={item?.image}
          alt=""
          className={classNames(
            styles.badgeIcon,
            !isAchieved && styles.grayScale
          )}
          height={276}
          width={276}
        />
        <label className={classNames(styles.levelstyle)}>
          Level {item?.level}
        </label>
        <label className={classNames(styles.badgeName)}>{item?.name}</label>
        <label className={classNames(styles.badgeDesc, "mt-2")}>
          {item?.description}
        </label>
        {shareId ? (
          <>
            {!showShare ? (
              <CustomButton
                title="Share Now"
                containerStyle={classNames(styles.btnStyle, "mt-3")}
                onClick={() => {
                  setShowShareOptions(true);
                }}
              />
            ) : null}
            {showShare ? (
              <>
                <div
                  className={classNames(
                    "d-flex align-items-start flex-column w-100 mt-3"
                  )}
                >
                  <label className={classNames(styles.copyLabel)}>
                    Copy Share link
                  </label>
                  <div
                    className={classNames(
                      styles.shareInputContainer,
                      "px-2 mt-2"
                    )}
                  >
                    <input
                      disabled
                      value={
                        window.location.protocol +
                        "//" +
                        window.location.host +
                        routeConstant.share.path.replace(":id", shareId)
                      }
                      className={classNames(styles.inputContainer)}
                    />
                    <CopyIcon
                      className={classNames(styles.copyIcon, "pointer")}
                      onClick={handleCopyToClipboard}
                    />
                  </div>
                </div>
                <div
                  className={classNames(
                    "d-flex  align-items-center justify-content-between w-100 mt-3"
                  )}
                >
                  <label className={classNames(styles.copyLabel)}>Share</label>
                  <ShareSocialMediaLink
                    link={
                      window.location.protocol +
                      "//" +
                      window.location.host +
                      routeConstant.share.path.replace(":id", shareId)
                    }
                  />
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </Modal>
  );
};

export default dynamic(() => Promise.resolve(BadgeInfoModal), {
  ssr: false,
});
