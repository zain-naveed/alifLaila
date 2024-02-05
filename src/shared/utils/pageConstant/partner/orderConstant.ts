const OrdersFilters: { label: string; value: string }[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Pending",
    value: "0",
  },
  {
    label: "Processing",
    value: "1",
  },
  {
    label: "Shipped",
    value: "2",
  },
  {
    label: "Completed",
    value: "4",
  },
  {
    label: "Rejected",
    value: "5",
  },
];

export { OrdersFilters };
