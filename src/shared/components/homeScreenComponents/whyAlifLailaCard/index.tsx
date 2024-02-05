import { ChevLeftIcon, ChevRightIcon } from "assets";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { whyAlifLailaConstants } from "shared/utils/pageConstant/landingPageConstant";
import styles from "./style.module.scss";
import useWindowDimensions from "shared/customHook/usWindowDimentions";

const WhyAlifLailaCard = () => {
  const { width } = useWindowDimensions();
  const left = useRef<number>(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [dotList, setDotList] = useState(
    Array.from(Array(whyAlifLailaConstants?.length - 2).keys())
  );

  const scroll = (newindex: number) => {
    var elem: any = document?.getElementById(`info-list-container`);
    var imgElem: any = document?.getElementById(`content${newindex}`);
    const scrollRect = elem?.getBoundingClientRect();
    const activeRect = imgElem?.getBoundingClientRect();
    elem.scrollLeft =
      elem?.scrollLeft +
      (activeRect?.left -
        scrollRect?.left -
        scrollRect?.width / 2 +
        activeRect?.width / 2);
  };

  useEffect(() => {
    if (width > 576 && width < 768) {
      left.current = 0;
      setActiveIndex(0);
      scroll(0);
      setIsSmallScreen(true);
      setIsMediumScreen(false);
      setDotList(Array.from(Array(whyAlifLailaConstants?.length).keys()));
    } else if (width < 576) {
      left.current = 0;
      setActiveIndex(0);
      scroll(0);
      setIsSmallScreen(true);
      setIsMediumScreen(false);
      setDotList(Array.from(Array(whyAlifLailaConstants?.length).keys()));
    } else {
      left.current = 1;
      setActiveIndex(0);
      scroll(1);
      setIsMediumScreen(false);
      setIsSmallScreen(false);
      setDotList(Array.from(Array(whyAlifLailaConstants?.length - 2).keys()));
    }
  }, [width]);

  return (
    <div
      className={classNames(
        "d-flex align-items-center flex-column justify-content-center w-100 gap-5 py-5",
        styles.topContainer
      )}
      style={{ maxWidth: "2000px", margin: "auto" }}
    >
      <label className={classNames(styles.title)}>Why AlifLaila</label>

      <div
        className={classNames(
          "d-flex align-items-center justify-content-start  gap-5 w-100 px-3",
          styles.listContainer
        )}
        id="info-list-container"
      >
        {whyAlifLailaConstants?.map((Itm: any, key) => {
          return (
            <div
              className={classNames(
                styles.mainContainer,
                "d-flex flex-column align-items-center justify-content-center gap-0 gap-lg-2"
              )}
              style={{ backgroundColor: Itm?.bgColor }}
              key={key}
              id={`content${key}`}
            >
              <Itm.Asset className={classNames(styles.img)} />
              <label
                className={classNames(styles.cardTitle, "px-2")}
                style={{ color: Itm?.color }}
              >
                {Itm?.title}
              </label>
              <label className={classNames(styles.content, "px-3")}>
                {Itm?.content}
              </label>
            </div>
          );
        })}
      </div>

      <div
        className={classNames(
          "d-flex justify-content-center align-items-center gap-3"
        )}
      >
        <div
          className={classNames(
            isSmallScreen || isMediumScreen
              ? left.current === 0
                ? styles.inActiveArrowContainer
                : styles.activeArrowContainer
              : left.current === 1
              ? styles.inActiveArrowContainer
              : styles.activeArrowContainer
          )}
          onClick={() => {
            if (!isSmallScreen && !isMediumScreen) {
              if (left.current !== 1) {
                scroll(left.current - 1);
                left.current -= 1;
                setActiveIndex(activeIndex - 1);
              }
            } else if (isSmallScreen || isMediumScreen) {
              if (left.current !== 0) {
                scroll(left.current - 1);
                left.current -= 1;
                setActiveIndex(activeIndex - 1);
              }
            }
          }}
        >
          <ChevLeftIcon
            className={classNames(
              isSmallScreen || isMediumScreen
                ? left.current === 0
                  ? styles.inActiveArrowIcon
                  : styles.activeArrowIcon
                : left.current === 1
                ? styles.inActiveArrowIcon
                : styles.activeArrowIcon
            )}
          />
        </div>
        <div
          className={classNames(
            "d-flex  justify-content-center align-items-center gap-2"
          )}
        >
          {dotList?.map((item, key) => {
            return (
              <div
                className={classNames(
                  activeIndex === key ? styles.activeDot : styles.inActiveDot
                )}
                key={key}
                id={`dot${key}`}
              />
            );
          })}
        </div>

        <div
          className={classNames(
            isSmallScreen || isMediumScreen
              ? left.current === dotList.length - 1
                ? styles.inActiveArrowContainer
                : styles.activeArrowContainer
              : left.current === dotList.length
              ? styles.inActiveArrowContainer
              : styles.activeArrowContainer
          )}
          onClick={() => {
            if (isMediumScreen || isSmallScreen) {
              if (left.current < dotList.length - 1) {
                scroll(left.current + 1);
                left.current += 1;
                setActiveIndex(activeIndex + 1);
              }
            } else {
              if (left.current < dotList.length) {
                scroll(left.current + 1);
                left.current += 1;
                setActiveIndex(activeIndex + 1);
              }
            }
          }}
        >
          <ChevRightIcon
            className={classNames(
              isSmallScreen || isMediumScreen
                ? left.current === dotList.length - 1
                  ? styles.inActiveArrowIcon
                  : styles.activeArrowIcon
                : left.current === dotList.length
                ? styles.inActiveArrowIcon
                : styles.activeArrowIcon
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default WhyAlifLailaCard;
