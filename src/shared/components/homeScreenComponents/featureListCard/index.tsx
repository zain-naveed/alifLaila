import { ArrowRight, BackArrow2Icon } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { roles } from "shared/utils/enum";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import styles from "./style.module.scss";

interface FeatureListCardProps {
  list: any[];
  isInParent?: boolean;
}

const FeatureListCard = ({ list, isInParent }: FeatureListCardProps) => {
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const [isHovering, setIsHovering] = useState<boolean>(false);
  let featureList: any[] = [];

  if (list?.length <= 3) {
    if (list?.length === 1) {
      let tempArr = [...list, ...list, ...list, ...list];
      featureList = tempArr;
    } else {
      let tempArr = [...list, ...list];
      featureList = tempArr;
    }
  } else {
    featureList = list;
  }

  return (
    <div
      className={classNames("position-relative")}
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
    >
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
      >
        <SlideLeft isHovering={isHovering} isInParent={isInParent} />
        {featureList?.map((itm, inx) => {
          return (
            <SwiperSlide key={inx}>
              <div
                className={classNames(styles.featureCard)}
                key={inx}
                id={`feature-card${inx}`}
              >
                <img
                  src={itm?.cover_photo}
                  alt="asset-1"
                  className={classNames(styles.imgContainer)}
                  height={286}
                  width={848}
                />
                {/* <CustomButton
                  containerStyle={classNames(styles.btnContainer)}
                  title="Start Reading"
                  onClick={() => {
                    if (role === roles.reader) {
                      router.push(
                        kidPanelConstant.preview.path.replace(
                          ":id",
                          itm?.book_id
                        )
                      );
                    } else if (role === roles.parent) {
                      router.push(
                        parentPanelConstant.preview.path.replace(
                          ":id",
                          itm?.book_id
                        )
                      );
                    }
                  }}
                /> */}
              </div>
            </SwiperSlide>
          );
        })}
        <SlideRight isHovering={isHovering} isInParent={isInParent} />
      </Swiper>
    </div>
  );
};

interface SlideActionProps {
  isHovering: boolean;
  isInParent?: boolean;
}

const SlideRight = ({ isHovering, isInParent }: SlideActionProps) => {
  const swiper = useSwiper();
  return isHovering ? (
    <div
      className={classNames(
        isInParent ? styles.rightArrowContainer2 : styles.rightArrowContainer,
        styles.active
      )}
      onClick={() => {
        swiper.slideNext();
      }}
    >
      <ArrowRight className={classNames(styles.arrowIcon)} />
    </div>
  ) : null;
};

const SlideLeft = ({ isHovering, isInParent }: SlideActionProps) => {
  const swiper = useSwiper();
  return isHovering ? (
    <div
      className={classNames(
        isInParent ? styles.leftArrowContainer2 : styles.leftArrowContainer,
        styles.active
      )}
      onClick={() => {
        swiper.slidePrev();
      }}
    >
      <BackArrow2Icon className={classNames(styles.arrowIcon)} />
    </div>
  ) : null;
};

export default FeatureListCard;
