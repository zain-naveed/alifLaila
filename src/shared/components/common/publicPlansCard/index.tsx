import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import { TickIcon4 } from "assets";
import CustomButton from "../customButton";
import { useDispatch } from "react-redux";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "shared/modal/auth/constants";

interface Props {
  name: string;
  description: string[];
  price: number;
  duration: number;
  isFamilyPlan?: boolean;
}

const PublicPlansCard = ({
  name,
  description,
  price,
  duration,
  isFamilyPlan,
}: Props) => {
  const dispatch = useDispatch();
  return (
    <div
      className={classNames(
        styles.plansCardContainer,
        isFamilyPlan && styles.familyPlansCardContainer
      )}
    >
      <div>
        <h2>{name}</h2>
        <div className={classNames(styles.descriptionContainer)}>
          {description?.map((desc, inx) => {
            return (
              <div
                className={classNames(
                  "d-flex align-items-start justify-content-start gap-2"
                )}
                key={inx}
              >
                <TickIcon4 />
                <span key={inx}>{desc}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2 ",
          styles.priceContainer
        )}
      >
        <CustomButton
          title="Buy Now"
          containerStyle={classNames(styles.seeMore)}
          onClick={() => {
            dispatch(
              setAuthReducer({ showModal: true, activeModal: forms.welcome })
            );
          }}
        />
        <label>{Math.trunc(price)}</label>
        <p>
          {duration === 12
            ? "/year!"
            : duration === 1
            ? "/month!"
            : `/${duration} month!`}
        </p>
      </div>
    </div>
  );
};

export default PublicPlansCard;
