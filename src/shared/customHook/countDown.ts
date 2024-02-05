import * as React from "react";

export default function CountDown(
  duration: number,
  runTimer: boolean,
  setRunTimer: any,
  dependencies: any[]
) {
  if (typeof "window" !== undefined) {
    const [countDown, setCountDown] = React.useState(60 * duration);
    React.useEffect(() => {
      if (!countDown && runTimer) {
        setCountDown(60 * duration);
      }

      let timerId: any = null;
      if (runTimer) {
        timerId = setInterval(() => {
          setCountDown((countDown) => countDown - 1);
        }, 1000);
      } else {
        clearInterval(timerId);
      }

      return () => clearInterval(timerId);
    }, dependencies);

    React.useEffect(() => {
      if (countDown < 0 && runTimer) {
        setRunTimer(false);
        setCountDown(0 * duration);
      }
    }, [countDown, runTimer]);
    return countDown;
  }
}
