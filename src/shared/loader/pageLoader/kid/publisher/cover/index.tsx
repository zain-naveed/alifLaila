import classNames from "classnames";
import React from "react";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

function PublisherCoverLoader() {
  return <BoxLoader iconStyle={classNames(styles.coverContainer)} />;
}

export default PublisherCoverLoader;
