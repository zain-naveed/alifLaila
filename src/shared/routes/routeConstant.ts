const routeConstant = {
  home: {
    path: "/",
    title: "Home",
  },
  parent: {
    path: "/parent",
    title: "Parents",
  },
  school: {
    path: "/school",
    title: "School",
  },
  partners: {
    path: "/partners",
    title: "Partners",
  },
  terms: {
    path: "/terms",
    title: "Term",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
  },
  share: {
    path: "/share/:id",
    title: "Share",
  },
  plans: {
    path: "/plans",
    title: "Plans",
  },
  preview: {
    path: "/preview/:id",
    title: "Book Preview",
  },
};
const partnersPanelConstant = {
  stats: {
    path: "/partners/dashboard",
    title: "Dashboard",
  },
  order: {
    path: "/partners/order",
    title: "My Orders",
  },
  orderDetail: {
    path: "/partners/order/:id",
    title: "Orders",
  },
  book: {
    path: "/partners/book",
    title: "My Books",
  },
  featureBook: {
    path: "/partners/featureBook",
    title: "Featured Book",
  },
  quiz: {
    create: {
      path: "/partners/quiz/createQuiz/:id",
      title: "Add Quiz",
    },
    update: {
      path: "/partners/quiz/updateQuiz/:id",
      title: "Update Quiz",
    },
    list: {
      path: "/partners/quiz/:id",
      title: "Quiz",
    },
    question: {
      path: "/partners/quiz/addQuestion/:id",
      title: "Add Question",
    },
    updateQuestion: {
      path: "/partners/quiz/updateQuestion/:id",
      title: "Update Question",
    },
  },
  addBook: {
    path: "/partners/addBook",
    title: "Add Books",
  },
  editBook: {
    path: "/partners/editBook/:id",
    title: "Edit Book",
  },
  bookPreview: {
    path: "/partners/book/preview/:id",
    title: "Book Preview",
  },
  support: {
    path: "/partners/support",
    title: "Tickets",
  },
  mou: {
    path: "/partners/mou",
    title: "MOU",
  },
  wallet: {
    path: "/partners/wallet",
    title: "My Wallet",
  },
  setting: {
    path: "/partners/setting",
    title: "Settings",
  },
  share: {
    path: "/share/:id",
    title: "Share",
  },
  revisions: {
    path: "/partners/revisions/:id",
    title: "Revisions",
  },
  authors: {
    path: "/partners/authors",
    title: "Partner Authors",
  },
  authorProfile: {
    path: "/partners/authors/:id",
    title: "Author Profile",
  },
};
const kidPanelConstant = {
  home: {
    path: "/kid",
    title: "Home",
  },
  leadershipboard: {
    path: "/kid/leadershipboard",
    title: "Leadership Board",
  },
  mylibrary: {
    path: "/kid/mylibrary",
    title: "My Library",
  },
  plans: {
    path: "/kid/plans",
    title: "Plans",
  },
  profile: {
    path: "/kid/profile",
    title: "Progress",
  },
  product: {
    path: "/kid/product/:id",
    title: "Product Detail",
  },
  cart: {
    path: "/kid/cart",
    title: "My Cart",
  },
  books: {
    path: "/kid/books",
    title: "E Books",
  },
  publisher: {
    path: "/kid/publisher/:id",
    title: "Publisher",
  },
  author: {
    path: "/kid/author/:id",
    title: "Publisher",
  },
  preview: {
    path: "/kid/preview/:id",
    title: "Book Preview",
  },
  progressLevel: {
    path: "/kid/levels",
    title: "Progress Level",
  },
  checkout: {
    path: "/kid/checkout",
    title: "Checkout",
  },
  search: {
    path: "/kid/search",
    title: "Search",
  },
  notifications: {
    path: "/kid/notifications",
    title: "Notifications",
  },
  share: {
    path: "/share/:id",
    title: "Share",
  },
};

const parentPanelConstant = {
  dashboard: {
    path: "/parent/dashboard",
    title: "Dashboard",
  },
  books: {
    path: "/parent/books",
    title: "Books",
  },
  leadershipboard: {
    path: "/parent/leadershipboard",
    title: "Leadership Board",
  },
  collections: {
    path: "/parent/collections",
    title: "My Collections",
  },
  setting: {
    path: "/parent/settings",
    title: "Settings",
  },
  kidProfile: {
    path: "/parent/dashboard/kid/:id",
    title: "Profile",
  },
  preview: {
    path: "/parent/preview/:id",
    title: "Book Preview",
  },
  product: {
    path: "/parent/product/:id",
    title: "Book HardCopy Detail",
  },
  cart: {
    path: "/parent/cart",
    title: "Cart",
  },
  checkout: {
    path: "/parent/checkout",
    title: "Checkout",
  },
  plans: {
    path: "/parent/plans",
    title: "Membership Plans",
  },
  publisher: {
    path: "/parent/publisher/:id",
    title: "Publisher",
  },
  author: {
    path: "/parent/author/:id",
    title: "Publisher",
  },
  share: {
    path: "/share/:id",
    title: "Share",
  },
  search: {
    path: "/parent/search",
    title: "Search",
  },
};

export {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
  routeConstant,
};
