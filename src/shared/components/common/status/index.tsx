import React from "react";
import styles from "./style.module.scss";
import {
  authorPaymentStatus,
  bookOrderStatus,
  bookPurchaseStatus,
  bookStatus,
  featureStatus,
  paymentStatus,
  plansStatus,
  transactionStatus
} from "./constant";
import classNames from "classnames";
interface Props {
  status: number;
  isUser?: boolean;
  type?: string; // book, order
  customContainerStyle?: any;
}

function Status(props: Props) {
  const { status, isUser, type, customContainerStyle } = props;

  const getStatus = (status: number) => {
    if (status === bookStatus.pending.value) {
      return bookStatus.pending.title;
    } else if (status === bookStatus.adminReview.value) {
      return bookStatus.adminReview.title;
    } else if (status === bookStatus.revisionRequested.value) {
      return bookStatus.revisionRequested.title;
    } else if (status === bookStatus.revisionSubmitted.value) {
      return bookStatus.revisionSubmitted.title;
    } else if (status === bookStatus.approved.value) {
      return bookStatus.approved.title;
    } else if (status === bookStatus.published.value) {
      return bookStatus.published.title;
    } else if (status === bookStatus.rejected.value) {
      return bookStatus.rejected.title;
    } else if (status === bookStatus.internalReview.value) {
      return bookStatus.internalReview.title;
    } else if (status === bookStatus.reviewCompleted.value) {
      return bookStatus.reviewCompleted.title;
    }
    return "";
  };

  return (
    <>
      {type === "book" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === bookStatus.pending.value ||
              status === bookStatus.adminReview.value ||
              status === bookStatus.revisionSubmitted.value
              ? styles.statusPending
              : status === bookStatus?.revisionRequested.value
              ? styles.statusRevision
              : status === bookStatus?.approved.value
              ? styles.statusApproved
              : status === bookStatus?.published.value
              ? styles.statusPublished
              : status === bookStatus?.rejected.value && styles.statusReject
          )}
        >
          {getStatus(status)}
        </div>
      ) : type === "Payment" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === paymentStatus.pending.value
              ? styles.statusPending
              : styles.statusProcess
          )}
        >
          {status === paymentStatus.pending.value
            ? paymentStatus.pending.title
            : paymentStatus.received.title}
        </div>
      ) : type === "AuthorPayment" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === paymentStatus.pending.value
              ? styles.statusPending
              : styles.statusProcess
          )}
        >
          {status === paymentStatus.pending.value
            ? authorPaymentStatus.pending.title
            : authorPaymentStatus.received.title}
        </div>
      ) : type === "PurchaseStatusType" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === bookPurchaseStatus.borrow.value
              ? styles.statusPending
              : styles.statusProcess
          )}
        >
          {status === bookPurchaseStatus.borrow.value
            ? bookPurchaseStatus.borrow.title
            : bookPurchaseStatus.buy.title}
        </div>
      ) : type === "Feature" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === featureStatus.pending.value
              ? styles.statusPending
              : status === featureStatus?.active.value
              ? styles.statusProcess
              : styles.statusReject
          )}
        >
          {status === featureStatus.pending.value
            ? featureStatus.pending.title
            : status === featureStatus?.active.value
            ? featureStatus.active.title
            : status === featureStatus?.rejected.value
            ? featureStatus.rejected.title
            : status === featureStatus?.expired.value &&
              featureStatus.expired.title}
        </div>
      ) : type === "PlansHistory" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === plansStatus.active.value
              ? styles.statusProcess
              : styles.statusReject
          )}
        >
          {status === plansStatus.active.value
            ? plansStatus.active.title
            : plansStatus.expired.title}
        </div>
      ) : type === "TransactionHistory" ? (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === transactionStatus.pending.value
              ? styles.statusPending
              : status === transactionStatus?.approved.value
              ? styles.statusApproved
              : status === transactionStatus?.rejected.value
              ? styles.statusReject
              : status === transactionStatus?.failed.value
              ? styles.statusReject
              : styles.statusReject
          )}
        >
          {status === transactionStatus.pending.value
            ? transactionStatus.pending.title
            : status === transactionStatus?.approved.value
            ? transactionStatus.approved.title
            : status === transactionStatus?.rejected.value
            ? transactionStatus.rejected.title
            : transactionStatus.failed.title
            }
        </div>
      ) : (
        <div
          className={classNames(
            customContainerStyle && customContainerStyle,
            styles.statusContainer,
            status === bookOrderStatus.pending.value
              ? styles.statusPending
              : status === bookOrderStatus?.processing.value
              ? styles.statusProcess
              : status === bookOrderStatus?.shipped.value
              ? styles.statusShipped
              : status === bookOrderStatus?.completed.value
              ? styles.statusCompeted
              : status === bookOrderStatus?.rejected.value &&
                styles.statusReject
          )}
        >
          {status === bookOrderStatus.pending.value
            ? bookOrderStatus.pending.title
            : status === bookOrderStatus?.processing.value
            ? bookOrderStatus.processing.title
            : status === bookOrderStatus?.shipped.value
            ? bookOrderStatus.shipped.title
            : status === bookOrderStatus?.completed.value
            ? bookOrderStatus.completed.title
            : status === bookOrderStatus?.rejected.value && isUser
            ? "Canceled"
            : bookOrderStatus.rejected.title}
        </div>
      )}
    </>
  );
}

export default Status;
