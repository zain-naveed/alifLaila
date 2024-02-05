let bookType: { label: string; value: number }[] = [
  {
    label: "Free",
    value: 1,
  },
  {
    label: "Premium",
    value: 2,
  },
];

const bookTypeEnums = {
  Free: 1,
  Premium: 2,
};

const bookCopyEnums = {
  hard: 1,
  soft: 0,
};

const bookAction = {
  yes: 1,
  no: 0,
};

let bookCopy: { label: string; value: number }[] = [
  {
    label: "Yes",
    value: 1,
  },
  {
    label: "No",
    value: 0,
  },
];

export { bookType, bookCopy, bookTypeEnums, bookAction, bookCopyEnums };
