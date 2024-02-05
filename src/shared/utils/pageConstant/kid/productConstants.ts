import { reviewsStatus } from "shared/utils/enum";

const ReviewFilters: { label: string; value: string }[] = [
  {
    label: "All",
    value: reviewsStatus.all,
  },
  {
    label: "Newest to Oldest",
    value: reviewsStatus.newest,
  },
  {
    label: "Oldest to Newest",
    value: reviewsStatus.oldest,
  },
  {
    label: "High to Low Rating",
    value: reviewsStatus.high_to_low,
  },
  {
    label: "Low to High Rating",
    value: reviewsStatus.low_to_high,
  },
];

export { ReviewFilters };
