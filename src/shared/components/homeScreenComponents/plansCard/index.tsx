import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import { plans } from "shared/utils/pageConstant/landingPageConstant";
import TrialCard from "shared/components/trialCard";
import Image from "next/image";
import { WaveUp2 } from "assets";

const PlansCard = () => {
  return (
    <>
      <Image
        src={WaveUp2}
        alt="wave-up-2-asset"
        height={130}
        width={1440}
        className={classNames(styles.waveStyle)}
      />

      <div className={classNames(styles.planTopContainer)}>
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 d-flex align-items-center flex-column justify-content-center w-100 gap-4 pb-5 w-100"
          )}
        >
          <label className={classNames(styles.title)}>
            <span className={classNames(styles.secondary)}>
              Choose your Plan
            </span>{" "}
            for a{" "}
            <span className={classNames(styles.secondary)}>Customized</span>{" "}
            Reading Space{" "}
            <span className={classNames(styles.primary)}>Tailored</span> to your
            Needs.
          </label>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center gap-3 flex-wrap w-100"
            )}
          >
            {plans?.map((itm, inx) => {
              return <TrialCard {...itm} key={inx} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlansCard;
