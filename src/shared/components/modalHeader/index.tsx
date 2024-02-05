import { BackIcon, closeImg } from "assets";
import classNames from "classnames";
import React from "react";
import styles from "./style.module.scss";
import Image from "next/image";

interface Props {
  close?: () => void;
  back?: () => void;
  isFirst?: boolean;
  headerStyle?: string;
  heading?: string;
  image?: any;
  closeImageStyle?: any;
  isCrossNotRequired?: boolean;
}

function ModalHeader(props: Props) {
  const {
    close,
    back,
    isFirst,
    headerStyle,
    heading,
    image,
    closeImageStyle,
    isCrossNotRequired,
  } = props;

  return (
    <>
      <div
        className={classNames(
          "d-flex justify-content-between align-items-center",
          headerStyle ? headerStyle : styles.headerContainer
        )}
      >
        {!isFirst ? (
          <BackIcon
            className={classNames(styles.backIcon, "pointer")}
            onClick={back}
          />
        ) : heading ? (
          <h5 className={styles.modalHeaderHeaing}>{heading}</h5>
        ) : (
          <div />
        )}
        {!isCrossNotRequired && (
          <div
            onClick={close}
            role={"button"}
            className={classNames(
              closeImageStyle ? closeImageStyle : styles.closeImageContainer,
              "pointer"
            )}
          >
            <Image src={image ? image : closeImg} alt="close" />
          </div>
        )}
      </div>
    </>
  );
}

export default ModalHeader;
