import classNames from "classnames";
import React from "react";
import CustomButton from "shared/components/common/customButton";
import styles from "./style.module.scss";
import { InsufficientCoinIcon, PromotionIcon } from "assets";
import { useRouter } from "next/router";
import { parentPanelConstant } from "shared/routes/routeConstant";
import Image from "next/image";

interface Props {
  handleClose: () => void;
}

const ParentSelectPlan = ({ handleClose }: Props) => {
  const router = useRouter();
  return (
    <div
      className={classNames(
        "px-4 pb-4 pt-3 d-flex flex-column align-items-center justify-content-center gap-2"
      )}
    >
      <Image
        src={InsufficientCoinIcon}
        className={styles.insufficientIcon}
        alt=""
      />
      <div
        className={classNames(
          "d-flex flex-column align-items-center justify-content-center gap-2 mt-3"
        )}
      >
        <label className={classNames(styles.heading)}>
          Select A Plan to Continue
        </label>
        <p className={styles.paragraph}>
          Its not too late to continue. Read amazing book continuously by
          selecting a plan
        </p>
      </div>
      <CustomButton
        title="Select Plan"
        containerStyle={styles.buttonContainer}
        onClick={() => {
          handleClose();
          router.push(parentPanelConstant.plans.path);
        }}
      />
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2 mt-2"
        )}
      >
        <PromotionIcon className={classNames(styles.iconStyle)} />
        {/* <label className={styles.paragraph}>
          New Promotion offer Available{" "}
          <span
            onClick={() => {
              handleClose();
              router.push(parentPanelConstant.plans.path);
            }}
          >
            View Now
          </span>
        </label> */}
      </div>
    </div>
  );
};

export default ParentSelectPlan;
