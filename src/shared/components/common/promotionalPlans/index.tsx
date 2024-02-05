import classNames from "classnames";

import { ChevLeftIcon, ChevRightIcon, NoPromoPlans } from "assets";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import PromotionalPlanCard from "./promotionalCard";
import styles from "./style.module.scss";
const FreePlanCard = dynamic(
  () => import("shared/components/common/promotionalPlans/freePlan"),
  { ssr: false }
);
interface Props {
  plans: any[];
  isPadding?: boolean;
}

const PromotionalPlans = ({ plans, isPadding }: Props) => {
  const left = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const scroll = (newindex: number) => {
    var elem: any = document?.getElementById(`promo-plans-list-container`);
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

  return (
    <>
      {plans?.length > 0 ? (
        <div className={classNames("d-flex flex-column ")}>
          <div
            className={classNames(
              "d-flex align-items-center gap-4 gap-sm-5 position-relative",
              plans?.length > 0
                ? "justify-content-start"
                : "justify-content-center",
              styles.plansContainer,
              isPadding && "px-3 px-sm-5"
            )}
            id="promo-plans-list-container"
          >
            <FreePlanCard />
            {plans?.map((plan, inx) => {
              return (
                <PromotionalPlanCard
                  plan={plan}
                  key={inx}
                  index={inx}
                  id={`content${inx + 1}`}
                />
              );
            })}
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center px-3 px-sm-0 w-100 mt-4 gap-4"
            )}
          >
            <div
              className={classNames(
                styles.leftArrowContainer,
                activeIndex !== 0 && styles.active
              )}
              onClick={() => {
                if (left.current !== 0) {
                  scroll(left.current - 1);
                  left.current -= 1;
                  setActiveIndex(activeIndex - 1);
                }
              }}
            >
              <ChevLeftIcon className={classNames(styles.arrowIcon)} />
            </div>
            <div
              className={classNames(
                "d-flex  justify-content-center align-items-center gap-2"
              )}
            >
              {Array.from(Array(plans?.length + 1).keys())?.map((item, key) => {
                return (
                  <div
                    className={classNames(
                      activeIndex === key
                        ? styles.activeDot
                        : styles.inActiveDot
                    )}
                    key={key}
                    id={`dot${key}`}
                  />
                );
              })}
            </div>
            <div
              className={classNames(
                styles.rightArrowContainer,
                activeIndex !== plans?.length && styles.active
              )}
              onClick={() => {
                if (left.current < plans?.length) {
                  scroll(left.current + 1);
                  left.current += 1;
                  setActiveIndex(activeIndex + 1);
                }
              }}
            >
              <ChevRightIcon className={classNames(styles.arrowIcon)} />
            </div>
          </div>
        </div>
      ) : (
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 d-flex flex-column flex-md-row align-items-center justify-content-center gap-4 w-100"
          )}
        >
          <FreePlanCard />
          <div className={classNames(styles.noPromoContainer)}>
            <Image src={NoPromoPlans} alt="" height={182} width={208} />
            <label>No Promotions Yet</label>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionalPlans;
