import classNames from "classnames";
import { useRef, useState } from "react";
import Slider from "react-slick";
import styles from "./style.module.scss";
import Image from "next/image";

interface Props {
  slides: any[];
}

const HeroCard = ({ slides }: Props) => {
  const sliderRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const handleBeforeChange = (oldindex: number, newindex: number) => {
    setActiveIndex(newindex);
  };
  const settings = {
    beforeChange: handleBeforeChange,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    infinite: true,
  };
  return (
    <div
      className={classNames(
        styles.mainHeaderContainer,
        "px-3 px-sm-0 position-relative d-flex flex-column  justify-content-end hero-content-slider"
      )}
    >
      {activeIndex === 0 ? (
        <div className={classNames(styles.contentContainer2)}>
          <label className={classNames(styles.title)}>
            <span className={classNames(styles.secondary)}>AlifLaila: </span>A
            Premier{" "}
            <span className={classNames(styles.primary)}>Digital Library</span>{" "}
            for Kids
          </label>
        </div>
      ) : (
        <div className={classNames(styles.contentContainer)}>
          <label className={classNames(styles.title)}>
            A Legacy of{" "}
            <span className={classNames(styles.primary)}>
              Children Literature
            </span>
            , Where{" "}
            <span className={classNames(styles.secondary)}>Stories </span>{" "}
            Connect{" "}
            <span className={classNames(styles.secondary)}>Generations </span>
          </label>
        </div>
      )}

      <Slider {...settings} ref={sliderRef}>
        {slides?.map((item, key) => {
          return (
            <div
              className={classNames(
                styles.slideContainer,
                "d-flex align-items-end justify-content-center",
                key === 1 && "pb-3"
              )}
              key={key}
            >
              <Image
                src={item?.slidePath?.src}
                alt={item?.altText}
                className={classNames(
                  key === 1 ? styles.slideImage2 : styles.slideImage
                )}
                height={344}
                width={1338}
              />
            </div>
          );
        })}
      </Slider>
      <div className={classNames(styles.dotsContainer)}>
        {slides.map((itm, inx) => {
          return (
            <div
              className={classNames(
                styles.dot,
                inx === activeIndex && styles.active
              )}
              role="button"
              key={inx}
              onClick={() => {
                sliderRef.current.slickGoTo(inx);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HeroCard;
