import { bookStatusEnum } from "shared/utils/enum";

const statusOption = [
  { value: "Approved", label: "Approved" },
  { value: "Reject", label: "Reject" },
];
const bookStatusArr = [
  {
    value: "Pending",
    serverValue: bookStatusEnum.pending,
    label: "Pending",
  },
  {
    serverValue: bookStatusEnum.admin_review,
    label: "Review",
    value: "Review",
  },
  {
    serverValue: bookStatusEnum.approved,
    label: "Approved",
    value: "Approved",
  },
  {
    serverValue: bookStatusEnum.published,
    label: "Published",
    value: "Published",
  },
  {
    serverValue: bookStatusEnum.rejected,
    label: "Rejected",
    value: "Rejected",
  },
];
export { statusOption, bookStatusArr };
