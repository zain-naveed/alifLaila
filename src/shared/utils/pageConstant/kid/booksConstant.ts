const SortFilters: { label: string; value: string }[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Most Popular",
    value: "most_popular",
  },
  {
    label: "Most Read",
    value: "most_read",
  },
  {
    label: "Highly Rated",
    value: "highly_rated",
  },
];

const quizFilters = [
  {
    id: 2,
    name: "All",
  },
  {
    id: 1,
    name: "Yes",
  },
  {
    id: 0,
    name: "No",
  },
];

const bookTypeFilters = [
  {
    id: 0,
    name: "All",
  },
  {
    id: 1,
    name: "Free",
  },
  {
    id: 2,
    name: "Premium",
  },
];

export { quizFilters, bookTypeFilters, SortFilters };
