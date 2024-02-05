import { ChargeIcon2, ChargeIcon3, TickIcon2, TickIcon4 } from "assets";
import classNames from "classnames";
import { useSelector } from "react-redux";
import { freePlanBenifits } from "shared/utils/constants";
import styles from "../style.module.scss";

const FreePlanCard = () => {
  const {
    login: { currentPlan, isLoggedIn },
  } = useSelector((state: any) => state.root);
  return (
    <div
      className={classNames(
        styles.freePlanContainer,
        "d-flex flex-column align-items-start justify-content-center"
      )}
      id="content0"
    >
      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-between"
        )}
      >
        {isLoggedIn && !currentPlan ? (
          <div className={classNames(styles.currentPlanContainer, "mb-2")}>
            <label className={classNames(styles.currentPlanLabel)}>
              Current Plan
            </label>
          </div>
        ) : null}
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <label className={classNames(styles.planTitle)}>Free Reading</label>
          <ChargeIcon3 className={classNames(styles.iconStyle)} />
        </div>
        <div
          className={classNames(
            "d-flex align-items-end justify-content-start gap-1"
          )}
        >
          <label className={classNames(styles.planPrice)}>Start Free</label>
        </div>
      </div>

      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-between",
          styles.pointsList
        )}
      >
        {freePlanBenifits?.map((itm: any, inx: any) => {
          return (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
              key={inx}
            >
              <TickIcon4 className={classNames(styles.planBulletIcon)} />

              <label className={classNames(styles.planBulletLabel)}>
                {itm}
              </label>
            </div>
          );
        })}
      </div>

      <label className={classNames(styles.bottomLabel, "mt-3")}>
        No credit is required!
      </label>
    </div>
  );
};

export default FreePlanCard;
