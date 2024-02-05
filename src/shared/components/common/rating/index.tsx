import React, { useState } from "react";
import { GraystarIcon } from "assets";
import styles from "./rating.module.scss";
import classNames from "classnames";
interface Props {
  active: any;
  setSelect: any;
  ratingHover: boolean;
  ratingStyle?: any;
  changeColor?: any;
}
function Rating({
  active,
  setSelect,
  ratingHover,
  ratingStyle,
  changeColor,
}: Partial<Props>) {
  const [hover, setHover] = useState(0);

  return (
    <>
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <GraystarIcon
            key={index}
            className={classNames(
              "pointer",
              index <= (hover > active ? hover : active)
                ? changeColor
                  ? styles.ratingActive2
                  : styles.ratingActive
                : !ratingHover
                ? styles.ratingNotHover
                : styles.rating,
              ratingStyle ? ratingStyle : styles.size
            )}
            onClick={() => {
              if (setSelect) {
                if (index != active) {
                  setSelect(index);
                } else {
                  setSelect(0);
                }
              }
            }}
            onMouseEnter={() => {
              if (ratingHover) {
                setHover(index);
              }
            }}
            onMouseLeave={() => {
              if (ratingHover) {
                setHover(0);
              }
            }}
          />
        );
      })}
    </>
  );
}
export default Rating;
