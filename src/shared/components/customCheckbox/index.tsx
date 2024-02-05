import { TickIcon } from "assets";
import React from "react";
import styles from "./style.module.scss";

interface Props {
  onClick: () => void;
  active: boolean;
}

function CustomCheckBox(props: Props) {
  const { onClick, active } = props;

  return (
    <>
      <div
        className={` me-1 d-flex justify-content-center align-items-center ${
          active ? styles.termsCheckBoxActive : styles.termsCheckBox
        }`}
        role={"button"}
        onClick={onClick}
      >
        <TickIcon />
      </div>
    </>
  );
}

export default CustomCheckBox;
