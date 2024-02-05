import React from "react";
import CustomButton from "../../customButton";
import { useSelector } from "react-redux";
import classNames from "classnames";
import styles from "../style.module.scss";

interface BuyButtonProps {
  plan: any;
  handleBuyPlan: () => void;
}

const BuyButton = ({ plan, handleBuyPlan }: BuyButtonProps) => {
  const { login } = useSelector((state: any) => state.root);
  return (
    <CustomButton
      title={
        plan?.active_plan
          ? "Buy Again"
          : login?.currentPlan
          ? "Buy Now"
          : "Buy Now"
      }
      containerStyle={classNames(
        plan?.active_plan ? styles.btn2Styles : styles.btn1Styles
      )}
      onClick={handleBuyPlan}
    />
  );
};

export default BuyButton;
