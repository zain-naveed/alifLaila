const roles = {
  mainSite: 0,
  school: 1,
  teacher: 2,
  parent: 3,
  reader: 4,
  author: 5,
  publisher: 6,
};

const accountStatus = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

const languageEnum = {
  english: "English",
  urdu: "Urdu",
};

const plansEnum = {
  annual: 4,
  monthly: 2,
  quator: 3,
  free: 1,
};

const kidAccountRole = {
  individual: 1,
  family: 2,
};

const mouStatus = {
  pending: 2,
  accepted: 3,
  declined: 4,
};

const ticketTypes = {
  support: 1,
  mou: 2,
};

const ticketStatus = {
  open: 1,
  closed: 2,
};

const ticketCommentTypes = {
  text: 1,
  image: 2,
  pdf: 3,
};

const bookStatusEnum = {
  pending: 0,
  admin_review: 1,
  revision_requested: 2,
  revision_submitted: 3,
  approved: 4,
  published: 5,
  rejected: 6,
  internal_review: 7,
  review_completed: 8,
};

const paymentStatusEnum = {
  pending: 0,
  received: 2,
};

const authorPaymentStatusEnum = {
  pending: 0,
  sent: 2,
};

const paymentTypesEnum = {
  softcopies: 1,
  hardcopies: 2,
};

const bookPurchaseTypeEnum = {
  buy: 2,
  borrow: 1,
};

const featureStatusEnums = {
  active: 1,
  pending: 0,
  expired: 3,
  rejected: 2,
};

const featureCoverEnums = {
  upload: 1,
  recent: 2,
  request: 3,
};

const plansStatusEnums = {
  active: 1,
  expired: 2,
};

const transactionStatusEnums = {
  pending: 0,
  approved: 1,
  rejected: 2,
  failed: 3,
};

const plansTypeEnums = {
  regular: 1,
  promotional: 2,
};

const reviewsStatus = {
  all: "",
  newest: "newest",
  oldest: "oldest",
  high_to_low: "high_rating",
  low_to_high: "low_rating",
};

const badgesTypes = {
  reading_streak: 1,
  super_reader: 2,
  quiz_whiz: 3,
  genre_guru: 4,
};

const plansDurationEnum = {
  1: "Monthly",
  2: "2-Month",
  3: "3-Month",
  4: "4-Month",
  5: "5-Month",
  6: "6-Month",
  7: "7-Month",
  8: "8-Month",
  9: "9-Month",
  10: "10-Month",
  11: "11-Month",
  12: "Annual",
};

export {
  roles,
  languageEnum,
  plansEnum,
  kidAccountRole,
  mouStatus,
  ticketTypes,
  ticketStatus,
  ticketCommentTypes,
  bookStatusEnum,
  paymentStatusEnum,
  bookPurchaseTypeEnum,
  featureStatusEnums,
  plansStatusEnums,
  transactionStatusEnums,
  plansTypeEnums,
  featureCoverEnums,
  accountStatus,
  reviewsStatus,
  paymentTypesEnum,
  badgesTypes,
  authorPaymentStatusEnum,
  plansDurationEnum,
};
