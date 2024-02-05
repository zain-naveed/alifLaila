import { InsufficientCoinIcon } from "assets";
import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { useRouter } from "next/router";
import Image from "next/image";

interface Props {
  handleClose: () => void;
}

const ReaderSelectPlan = ({ handleClose }: Props) => {
  const {
    plan: { reachLimit },
  } = useSelector((state: any) => state.root);
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
          "d-flex flex-column align-items-center justify-content-center gap-2"
        )}
      >
        <label className={classNames(styles.heading)}>
          keep getting the best of aliflaila
        </label>
        <p className={styles.paragraph}>
          {reachLimit
            ? "You have already read a free book today, you can read only one book per day."
            : "Its not too late to continue. Read amazing book continuously by selecting a plan"}
        </p>
      </div>
      <div
        className={classNames(
          "d-flex flex-column flex-md-row align-items-center justify-content-center w-100 gap-2"
        )}
      >
        <CustomButton
          title="Select A Plan"
          containerStyle={styles.buttonContainer}
          onClick={() => {
            handleClose();
            router.push(kidPanelConstant.plans.path);
          }}
        />
        {!reachLimit ? (
          <CustomButton
            title="Continue Free Reading"
            containerStyle={styles.button2Container}
            onClick={handleClose}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ReaderSelectPlan;
