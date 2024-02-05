import { PlansSlash, WhiteChargeIcon, WhiteVerifiedIcon } from "assets";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forms } from "shared/modal/auth/constants";
import BuyPlanModal from "shared/modal/buyPlan";
import PaymentVerificationModal from "shared/modal/paymentVerificationSent";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import CustomButton from "../../customButton";
import styles from "../style.module.scss";

interface PromotionalPlanCardProps {
  plan: any;
  index: number;
  id: string;
}

const PromotionalPlanCard = ({ plan, index, id }: PromotionalPlanCardProps) => {
  const {
    login: { isLoggedIn },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [openDetailsModal, setOpenDetailModal] = useState(false);
  const [showPaymentVerificationModal, setShowPaymentVerificationModal] =
    useState(false);

  const handleShowDetailsModal = () => {
    if (isLoggedIn) {
      setOpenDetailModal(true);
    } else {
      dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
    }
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
    <div
      className={classNames(
        styles.promoContainer,
        index % 2 !== 0 && styles.promo2Container,
        "d-flex flex-column align-items-start justify-content-start position-relative"
      )}
      id={id}
    >
      <div className={classNames(styles.discountedContainer)}>
        <div className={classNames(styles.content, "px-3")}>
          <label>{plan?.title}</label>
          <div className={classNames(styles.bottomCont)} />
        </div>
      </div>

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
            style={{ color: "white" }}
          >
            {plan?.name}
          </label>
          <WhiteChargeIcon className={classNames(styles.iconStyle)} />
        </div>
        <div
          className={classNames(
            "d-flex align-items-end justify-content-start gap-1"
          )}
        >
          <label
            className={classNames(styles.planPrice)}
            style={{ color: "white" }}
          >
            {Math.trunc(Number(plan?.price)) + " Rs"}
          </label>
          <label
            className={classNames(styles.planSubtitle)}
            style={{ color: "white" }}
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
          "d-flex flex-column align-items-start  flex-wrap w-100",
          styles.promoPointsList
        )}
      >
        {plan?.description?.map((itm: any, inx: any) => {
          return (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2 w-50"
              )}
              key={inx}
            >
              <WhiteVerifiedIcon
                className={classNames(styles.planBulletIcon)}
              />
              <label
                className={classNames(styles.planBulletLabel)}
                style={{ color: "white" }}
              >
                {itm}
              </label>
            </div>
          );
        })}
      </div>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-3"
        )}
      >
        <CustomButton
          title={"Buy Now"}
          containerStyle={classNames(
            plan?.active_plan ? styles.btn2Styles : styles.btn1Styles,
            plan?.active_plan && styles.diabledBtn
          )}
          onClick={handleShowDetailsModal}
        />
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-center gap-1"
          )}
        >
          <label
            className={classNames(styles.limitLabel)}
            style={{ color: "white" }}
          >
            For Limited Time
          </label>
          <label
            className={classNames(styles.timeLabel)}
            style={{ color: "white" }}
          >
            From {moment(plan?.start_date).format("Do MMM")} -{" "}
            {moment(plan?.end_date).format("Do MMM")}
          </label>
        </div>
      </div>
      <Image
        src={PlansSlash}
        alt=""
        className={classNames(styles.slashStyle)}
      />
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
    </div>
  );
};

export default PromotionalPlanCard;
