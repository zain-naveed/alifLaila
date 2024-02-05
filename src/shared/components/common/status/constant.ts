import {
  authorPaymentStatusEnum,
  bookPurchaseTypeEnum,
  bookStatusEnum,
  featureStatusEnums,
  paymentStatusEnum,
  plansStatusEnums,
  transactionStatusEnums
} from "shared/utils/enum";

const bookOrderStatus = {
  pending: {
    value: 0,
    title: "Pending",
  },
  processing: {
    value: 1,
    title: "In Process",
  },
  shipped: {
    value: 2,
    title: "Shipped",
  },
  completed: {
    value: 4,
    title: "Completed",
  },
  rejected: {
    value: 5,
    title: "Rejected",
  },
};

const bookStatus = {
  pending: {
    value: bookStatusEnum.pending,
    title: "Pending",
  },
  adminReview: {
    value: bookStatusEnum.admin_review,
    title: "In Review",
  },
  revisionRequested: {
    value: bookStatusEnum.revision_requested,
    title: "Revision Requested",
  },
  revisionSubmitted: {
    value: bookStatusEnum.revision_submitted,
    title: "Revision Submitted",
  },
  approved: {
    value: bookStatusEnum.approved,
    title: "Approved",
  },
  published: {
    value: bookStatusEnum.published,
    title: "Published",
  },
  rejected: {
    value: bookStatusEnum.rejected,
    title: "Rejected",
  },
  internalReview: {
    value: bookStatusEnum.internal_review,
    title: "Internal Review",
  },
  reviewCompleted: {
    value: bookStatusEnum.review_completed,
    title: "Review Completed",
  },
};

const paymentStatus = {
  pending: {
    value: paymentStatusEnum.pending,
    title: "Pending",
  },
  received: {
    value: paymentStatusEnum.received,
    title: "Payment Received",
  },
};

const authorPaymentStatus = {
  pending: {
    value: authorPaymentStatusEnum.pending,
    title: "Pending",
  },
  received: {
    value: authorPaymentStatusEnum.sent,
    title: "Sent",
  },
};

const bookPurchaseStatus = {
  buy: {
    value: bookPurchaseTypeEnum.buy,
    title: "Buy",
  },
  borrow: {
    value: bookPurchaseTypeEnum.borrow,
    title: "Borrow",
  },
};

const featureStatus = {
  pending: {
    value: featureStatusEnums.pending,
    title: "Pending",
  },
  active: {
    value: featureStatusEnums.active,
    title: "Active",
  },
  expired: {
    value: featureStatusEnums.expired,
    title: "Expired",
  },
  rejected: {
    value: featureStatusEnums.rejected,
    title: "Rejected",
  },
};

const plansStatus = {
  active: {
    value: plansStatusEnums.active,
    title: "Active",
  },
  expired: {
    value: plansStatusEnums.expired,
    title: "Expired",
  },
};

const transactionStatus = {
  pending: {
    value: transactionStatusEnums.pending,
    title: "Pending",
  },
  approved: {
    value: transactionStatusEnums.approved,
    title: "Approved",
  },
  rejected: {
    value: transactionStatusEnums.rejected,
    title: "Rejected",
  },
  failed: {
    value: transactionStatusEnums.failed,
    title: "Failed",
  },
};

export {
  bookOrderStatus,
  bookStatus,
  paymentStatus,
  bookPurchaseStatus,
  featureStatus,
  plansStatus,
  transactionStatus,
  authorPaymentStatus,
};
