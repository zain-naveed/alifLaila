const LibraryTabs = ["My Shelf", "Favourites"];
const FamilyLibraryTabs = ["My Shelf", "Favourites", "Family Shelf"];
const LibraryTabsEnums = {
  favourites: "Favourites",
  myBooks: "My Shelf",
};
const FamilyLibraryTabsEnums = {
  favourites: "Favourites",
  myBooks: "My Shelf",
  shared: "Family Shelf",
};

const SortFilters: { label: string; value: any }[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Buy",
    value: 2,
  },
  {
    label: "Borrow",
    value: 1,
  },
];

export {
  LibraryTabs,
  LibraryTabsEnums,
  SortFilters,
  FamilyLibraryTabs,
  FamilyLibraryTabsEnums,
};
