import React from "react";
import { classNames } from "shared/utils/helper";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";
interface Props {
  Iteration: number;
  customContainer?: any;
  noFixWidth?: boolean;
  isQuartor?: boolean;
  isParentModule?: boolean;
}

function BookLoader(props: Props) {
  const { Iteration, customContainer, noFixWidth, isQuartor, isParentModule } =
    props;

  return (
    <>
      {Array.from(Array(Iteration).keys()).map((item, index) => {
        return (
          <div
            className={classNames(
              noFixWidth
                ? styles.noFixWidthCardContainer
                : isQuartor && isParentModule
                ? styles.parentCardContainer2
                : isParentModule
                ? styles.parentCardContainer
                : isQuartor
                ? styles.quartorCardContainer
                : styles.cardContainer,
              "d-flex flex-column",
              customContainer && customContainer
            )}
            key={index}
          >
            <div className={classNames(styles.imgContainer)}>
              <BoxLoader
                iconStyle={classNames(
                  isParentModule ? styles.img2 : styles.img
                )}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default BookLoader;
