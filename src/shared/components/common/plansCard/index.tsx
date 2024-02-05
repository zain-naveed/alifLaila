import { ChargeIcon2, CrownIcon, TickIcon2, TickIcon3 } from "assets";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useState } from "react";
import BuyPlanModal from "shared/modal/buyPlan";
import styles from "./style.module.scss";
import PaymentVerificationModal from "shared/modal/paymentVerificationSent";
const BuyButton = dynamic(() => import("./buyButton"), { ssr: false });

interface PlanProps {
  plan: any;
}

const SinglePlansCard = ({ plan }: PlanProps) => {
  const [openDetailsModal, setOpenDetailModal] = useState(false);
  const [showPaymentVerificationModal, setShowPaymentVerificationModal] =
    useState(false);

  const handleShowDetailsModal = () => {
    setOpenDetailModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailModal(false);
  };

  const handleShowPaymentVerificationModal = () => {
    setShowPaymentVerificationModal(true);
  };

  const handleClosePaymentVerificationModal = () => {
    setShowPaymentVerificationModal(false);
  };

  return (
    <>
      <div
        className={classNames(
          styles.planContainer,
          plan?.active_plan && styles.annualContainer,
          "d-flex flex-column align-items-start justify-content-between px-3 px-sm-4 gap-3 py-4 py-sm-5 position-relative"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-between gap-3  "
          )}
        >
          {plan?.active_plan ? (
            <div className={classNames(styles.currentPlanContainer)}>
              <label className={classNames(styles.currentPlanLabel)}>
                Current Plan
              </label>
            </div>
          ) : null}
          {plan?.is_discounted ? (
            <div className={classNames(styles.discountedContainer)}>
              <div className={classNames(styles.content, "px-3")}>
                <label>{plan?.title}</label>
                <div className={classNames(styles.bottomCont)} />
              </div>
            </div>
          ) : null}

          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between"
            )}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              <label
                className={classNames(styles.planTitle)}
                style={plan?.active_plan ? { color: "white" } : {}}
              >
                {plan?.name}
              </label>
              {plan?.duration === 12 ? (
                <CrownIcon className={classNames(styles.iconStyle)} />
              ) : (
                <ChargeIcon2 className={classNames(styles.iconStyle)} />
              )}
            </div>
            <div
              className={classNames(
                "d-flex align-items-end justify-content-start gap-1"
              )}
            >
              <label
                className={classNames(styles.planPrice)}
                style={plan?.active_plan ? { color: "white" } : {}}
              >
                {plan?.is_discounted ? (
                  <>{Math.trunc(Number(plan?.discounted_price)) + " Rs"}</>
                ) : (
                  <>{Math.trunc(Number(plan?.price)) + " Rs"}</>
                )}
              </label>

              <label
                className={classNames(styles.planSubtitle)}
                style={plan?.active_plan ? { color: "white" } : {}}
              >
                {plan?.is_discounted ? (
                  <>
                    <span> {Math.trunc(Number(plan?.price)) + " Rs"}</span>
                  </>
                ) : (
                  <>
                    {plan?.duration === 12
                      ? "/Year!"
                      : plan?.duration === 1
                      ? "/Month!"
                      : `/${plan?.duration} Month!`}
                  </>
                )}
              </label>
            </div>
          </div>

          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between",
              styles.pointsList
            )}
          >
            {plan?.description?.map((itm: any, inx: any) => {
              return (
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-start gap-2"
                  )}
                  key={inx}
                >
                  {plan?.active_plan ? (
                    <TickIcon3 className={classNames(styles.planBulletIcon)} />
                  ) : (
                    <TickIcon2 className={classNames(styles.planBulletIcon)} />
                  )}

                  <label
                    className={classNames(styles.planBulletLabel)}
                    style={plan?.active_plan ? { color: "white" } : {}}
                  >
                    {itm}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <BuyButton plan={plan} handleBuyPlan={handleShowDetailsModal} />
      </div>
      <BuyPlanModal
        show={openDetailsModal}
        handleClose={handleCloseDetailsModal}
        plan={plan}
        handleShowPaymentVerificationModal={handleShowPaymentVerificationModal}
      />
      <PaymentVerificationModal
        show={showPaymentVerificationModal}
        handleClose={handleClosePaymentVerificationModal}
      />
    </>
  );
};

export default SinglePlansCard;
