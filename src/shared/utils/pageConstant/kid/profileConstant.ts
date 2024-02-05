const ProfileTabs = [
  "My Progress",
  "My Wallet",
  "My Orders",
  "Subscription History",
  "Edit Profile",
];

const FamilyProfileTabs = ["My Progress", "My Wallet", "Edit Profile"];

const ProfileTabsEnums = {
  progress: "My Progress",
  myWallet: "My Wallet",
  myOrders: "My Orders",
  subscriptions: "Subscription History",
  editProfile: "Edit Profile",
};

const FamilyProfileTabsEnums = {
  progress: "My Progress",
  myWallet: "My Wallet",
  editProfile: "Edit Profile",
};

const SubscriptionTabs = ["Purchase History", "Transaction History"];

const SubscriptionTabsEnums = {
  purchaseHistory: "Purchase History",
  transactionHistory: "Transaction History",
};

const ProgressFilters: { label: string; value: string }[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "In Progress",
    value: "incomplete",
  },
  {
    label: "Complete",
    value: "complete",
  },
];

export {
  ProfileTabs,
  ProfileTabsEnums,
  ProgressFilters,
  FamilyProfileTabs,
  FamilyProfileTabsEnums,
  SubscriptionTabs,
  SubscriptionTabsEnums,
};
