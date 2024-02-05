import React, { useCallback, useEffect, useState } from "react";
import styles from "./style.module.scss";
import { classNames, percentage } from "shared/utils/helper";
interface Props extends React.HTMLProps<HTMLInputElement> {
  progress: number;
  disable?: boolean;
  isRightOriented?: boolean;
}

function Slider(props: Props) {
  const { disable, progress, isRightOriented, max, onBlur } = props;
  const setRef = useCallback(
    (element: any) => {
      if (element) {
        element.onchange = props.onChange ? props.onChange : null;
        element.oninput = props.onInput ? props.onInput : null;
      }
    },
    [props.onChange]
  );

  useEffect(() => {
    // for show progress bar after change value
    // @ts-ignore
    if (document.getElementById("myinput")) {
      // @ts-ignore
      document.getElementById("myinput").oninput = function () {
        // @ts-ignore
        // var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        var value = percentage(this.value, max - 1);
        // @ts-ignore
        this.style.background =
          `linear-gradient(to ${
            isRightOriented ? "left" : "right"
          }, #ef437b 0%, #ef437b ` +
          value +
          "%, #D9E0E9 " +
          value +
          "%, #D9E0E9 100%)";
        // }
      };
    }
  }, []);

  useEffect(() => {
    // for show progress bar intially
    let ele: any = document.getElementById("myinput");
    var value = 0;

    if (max) {
      value = percentage(progress, Number(max));
    }
    // @ts-ignore
    ele.style.background =
      `linear-gradient(to ${
        isRightOriented ? "left" : "right"
      }, #ef437b 0%, #ef437b ` +
      value +
      "%, #D9E0E9 " +
      value +
      "%, #D9E0E9 100%)";
  }, [progress]);

  return (
    <div
      className={classNames(
        "d-flex align-items-center",
        styles.progressContainer
      )}
    >
      <input
        ref={setRef}
        id="myinput"
        min={0}
        max={max}
        disabled={disable}
        type="range"
        value={progress}
        onChange={() => {}}
        onInput={undefined}
        style={isRightOriented ? { direction: "rtl" } : {}}
        onBlur={onBlur}
      />
    </div>
  );
}

export default Slider;
