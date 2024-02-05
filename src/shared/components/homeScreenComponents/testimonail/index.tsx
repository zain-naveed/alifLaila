import { ChevLeftIcon, ChevRightIcon } from "assets";
import classNames from "classnames";
import { useRef } from "react";
import Slider from "react-slick";
import SingleTestimonial from "./singleTestimonial";
import styles from "./style.module.scss";

const Testimonials = ({ feedBacks }: any) => {
  const sliderRef = useRef<any>(null);

  const settings = {
    autoplay: false,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleLeft = () => {
    sliderRef.current.slickPrev();
  };
  const handleRight = () => {
    sliderRef.current.slickNext();
  };

  return (
    <div
      className={classNames(
        "mt-5 d-flex align-items-center justify-content-center"
      )}
    >
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex align-items-center flex-column justify-content-center w-100 gap-3"
        )}
      >
        <label className={classNames(styles.title)}>
          Feedback from our Users
        </label>
        <label className={classNames(styles.subTitle)}>
          We are recognized for exceeding client expectations and delivering
          outstanding results through dedication.
        </label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center w-100 mt-4"
          )}
        >
          {feedBacks?.length > 2 ? (
            <div
              className={classNames(styles.activeArrowContainer)}
              onClick={handleLeft}
            >
              <ChevLeftIcon className={classNames(styles.activeArrowIcon)} />
            </div>
          ) : null}

          <div className={classNames(styles.w90)}>
            <Slider {...settings} ref={sliderRef}>
              {feedBacks?.map((item: any, key: any) => {
                return (
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-center"
                    )}
                    key={key}
                  >
                    <SingleTestimonial {...item} index={key} />
                  </div>
                );
              })}
            </Slider>
          </div>
          {feedBacks?.length > 2 ? (
            <div
              className={classNames(styles.activeArrowContainer)}
              onClick={handleRight}
            >
              <ChevRightIcon className={classNames(styles.activeArrowIcon)} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
