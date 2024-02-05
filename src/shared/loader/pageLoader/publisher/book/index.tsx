import React from "react";
import { classNames } from "shared/utils/helper";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

function BookRowLoader() {
  return (
    <>
      {Array.from(Array(8).keys()).map((item, inx) => {
        return (
          <tr
            className={classNames(styles.tdItem)}
            key={`book-row-loader-${inx}`}
          >
            <td
              className={classNames(styles.paddingLeft, styles.first_td)}
              style={{ width: "20%" }}
            >
              <div
                className={classNames(
                  styles.bookNameItem,
                  "d-flex align-items-center"
                )}
              >
                <BoxLoader iconStyle={styles.imgLoader} />

                <BoxLoader iconStyle={styles.span} />
              </div>
            </td>
            <td
              className={classNames(styles.td, styles.tdItem)}
              style={{ width: "12%" }}
            >
              <BoxLoader iconStyle={styles.textLoad} />
            </td>
            <td
              className={classNames(styles.td, styles.tdItem)}
              style={{ width: "20%" }}
            >
              <BoxLoader iconStyle={styles.textLoad} />
            </td>
            <td
              className={classNames(styles.td, styles.tdItem)}
              style={{ width: "9%" }}
            >
              <BoxLoader iconStyle={styles.textLoad} />
            </td>
            <td
              className={classNames(styles.td, styles.tdItem)}
              style={{ width: "19%" }}
            >
              <BoxLoader iconStyle={styles.textLoad} />
            </td>
            <td
              className={classNames(styles.actionItem, styles.tdItem)}
              style={{ width: "20%" }}
            >
              <div className={classNames("d-flex gap-2")}>
                <BoxLoader iconStyle={styles.iconStyle} />

                <BoxLoader iconStyle={styles.iconStyle} />

                <BoxLoader iconStyle={styles.iconStyle} />

                <BoxLoader iconStyle={styles.iconStyle} />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default BookRowLoader;
