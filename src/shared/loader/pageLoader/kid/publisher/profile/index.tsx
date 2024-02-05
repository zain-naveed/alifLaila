import classNames from "classnames";
import React from "react";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";
interface Props {}

function PublisherProfileLoader(props: Props) {
  const {} = props;

  return (
    <div
      className={classNames(
        "d-flex flex-column flex-sm-row align-items-center justify-content-between gap-4",
        styles.infoContainer
      )}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-3"
        )}
      >
        <BoxLoader iconStyle={classNames(styles.avatar)} />

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
            <BoxLoader iconStyle={classNames(styles.publisherName)} />
            <BoxLoader iconStyle={classNames(styles.verifyIcon)} />
          </div>
          
          <BoxLoader iconStyle={classNames(styles.publisherBadge)} />
        </div>
      </div>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2"
        )}
      >
        <BoxLoader iconStyle={classNames(styles.btn1Style)} />
        <BoxLoader iconStyle={classNames(styles.btn2Style)} />
      </div>
    </div>
  );
}

export default PublisherProfileLoader;
