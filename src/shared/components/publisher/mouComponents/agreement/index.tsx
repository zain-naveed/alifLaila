import classNames from "classnames";
import moment from "moment";
import { mouStatus } from "shared/utils/enum";
import styles from "./style.module.scss";

interface Props {
  mouData: any;
}
const Agreement = ({ mouData }: Props) => {
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-start gap-2 w-100 mb-3"
      )}
    >
      {mouData?.status !== mouStatus.declined ? (
        <div
          className={classNames(
            "d-flex  my-2 w-100 mt-3",
            mouData?.status === mouStatus.pending
              ? "justify-content-between"
              : "justify-content-end"
          )}
        >
          {mouData?.status === mouStatus.pending ? (
            <label
              htmlFor="agreement"
              className={classNames(styles.agreementlabel)}
            >
              Sign This Agreement
            </label>
          ) : null}

          <span className={classNames(styles.agreementlabel)}>
            {mouData?.status === mouStatus.pending
              ? "Last Updated"
              : mouData?.status === mouStatus.accepted
              ? "Signed On"
              : ""}{" "}
            {moment(
              mouData?.accepted_at ? mouData?.accepted_at : mouData?.updated_at
            ).format("DD/MM/YYYY")}
          </span>
        </div>
      ) : null}

      <div
        className={classNames(styles.agreementContent, "ps-3 pe-1 py-4 w-100")}
      >
        {mouData?.agreement
          .split("\n")
          .map(function (item: string, idx: number) {
            return <p key={idx}>{item}</p>;
          })}
      </div>
      <div
        className={classNames(
          "d-flex align-items-center my-3 w-100 row p-0 m-0"
        )}
      >
        <div
          className={classNames(
            "col-12  col-lg-12 p-0 pe-md-2  col-xxl-8 d-flex justify-content-between align-items-center mt-3"
          )}
        >
          <div className={classNames(styles.statContainer, "px-2")}>
            <label>Free Books</label>
            <span>
              {mouData?.free_book_ratio} Book
              {mouData?.free_book_ratio > 1 || mouData?.free_book_ratio === 0
                ? "s"
                : ""}
            </span>
          </div>
          <label className={classNames(styles.outOfLabel)}>Out of</label>
          <div className={classNames(styles.statContainer, "px-2")}>
            <label>Books Limit</label>
            <span>
              {mouData?.total_books} Book
              {mouData?.total_books > 1 || mouData?.total_books === 0
                ? "s"
                : ""}
            </span>
          </div>
        </div>
        <div className={classNames("col-md-4 col-12 mt-3 p-0")}>
          <div className={classNames(styles.statContainer, "px-2")}>
            <label>Platform Fee</label>
            <span>{mouData?.platform_commission} %</span>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          "d-flex w-100",
          mouData?.user_signature
            ? "justify-content-between"
            : "justify-content-end"
        )}
      >
        {mouData?.user_signature ? (
          <div className={classNames(styles.signatureContainer)}>
            <img
              src={mouData?.user_signature}
              alt="publisher signature"
              className={styles.signatureImage}
            />
            <div className={classNames(styles.seperator)} />
            <label className={classNames(styles.signedPerson)}>Publisher</label>
          </div>
        ) : null}

        <div className={classNames(styles.signatureContainer)}>
          <img
            src={mouData?.admin_signature}
            alt="admin signature"
            className={styles.signatureImage}
          />
          <div className={classNames(styles.seperator)} />
          <label className={classNames(styles.signedPerson)}>Admin</label>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
