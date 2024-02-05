import React from "react";

import styles from "./style.module.scss";
import Lottie from "react-lottie";
import classNames from "classnames";

interface AnimationProps {
  animaton: any;
}

const Animation = ({ animaton }: AnimationProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animaton,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className={classNames(styles.navigationLoader)}>
      <Lottie
        isClickToPauseDisabled
        options={defaultOptions}
        isStopped={false}
        isPaused={false}
        height={"225px"}
        width={"300px"}
      />
    </div>
  );
};

export default Animation;
