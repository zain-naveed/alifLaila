import React from "react";
import { useRouter } from "next/router";
import styles from "./style.module.scss";
import classNames from "classnames";
import Lottie from "react-lottie";
import { LoadingAnimation } from "assets";

const LOADER_THRESHOLD = 200;

export default function NavigationLoader(props: any) {
  const [isLoading, setLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timer: any;

    const start = () =>
      (timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD));

    const end = () => {
      if (timer) {
        clearTimeout(timer);
      }
      setLoading(false);
    };

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);

      if (timer) {
        clearTimeout(timer.current);
      }
    };
  }, [router.events]);

  if (!isLoading) return null;

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
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
}
