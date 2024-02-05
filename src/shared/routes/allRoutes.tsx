import {
  kidPanelConstant,
  parentPanelConstant,
  partnersPanelConstant,
  routeConstant,
} from "./routeConstant";

const commonRoute = [
  {
    path: routeConstant.home.path,
    title: routeConstant.home.title,
  },
  {
    path: routeConstant.parent.path,
    title: routeConstant.parent.title,
  },
  {
    path: routeConstant.school.path,
    title: routeConstant.school.title,
  },
  {
    path: routeConstant.partners.path,
    title: routeConstant.partners.title,
  },
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
  },
  {
    path: kidPanelConstant.publisher.path,
    title: kidPanelConstant.publisher.title,
  },
  {
    path: kidPanelConstant.author.path,
    title: kidPanelConstant.author.title,
  },
  {
    path: routeConstant.share.path,
    title: routeConstant.share.title,
  },
  {
    path: routeConstant.plans.path,
    title: routeConstant.plans.title,
  },
  {
    path: routeConstant.preview.path,
    title: routeConstant.preview.title,
  },
];

const publicRoute: any = [
  ...commonRoute,

  {
    path: kidPanelConstant.publisher.path,
    title: kidPanelConstant.publisher.title,
  },
  {
    path: kidPanelConstant.author.path,
    title: kidPanelConstant.author.title,
  },
];

const publisherRoute: any = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
  },
  {
    path: partnersPanelConstant.quiz.create.path,
    title: partnersPanelConstant.quiz.create.title,
  },
  {
    path: partnersPanelConstant.quiz.list.path,
    title: partnersPanelConstant.quiz.list.title,
  },
  {
    path: partnersPanelConstant.quiz.question.path,
    title: partnersPanelConstant.quiz.question.title,
  },
  {
    path: partnersPanelConstant.quiz.update.path,
    title: partnersPanelConstant.quiz.update.title,
  },
  {
    path: partnersPanelConstant.quiz.updateQuestion.path,
    title: partnersPanelConstant.quiz.updateQuestion.title,
  },
  {
    path: partnersPanelConstant.addBook.path,
    title: partnersPanelConstant.addBook.title,
  },
  {
    path: partnersPanelConstant.editBook.path,
    title: partnersPanelConstant.editBook.title,
  },
  {
    path: partnersPanelConstant.bookPreview.path,
    title: partnersPanelConstant.bookPreview.title,
  },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
  },
  {
    path: partnersPanelConstant.orderDetail.path,
    title: partnersPanelConstant.orderDetail.title,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
  },
  {
    path: partnersPanelConstant.revisions.path,
    title: partnersPanelConstant.revisions.title,
  },
  // {
  //   path: partnersPanelConstant.authors.path,
  //   title: partnersPanelConstant.authors.title,
  // },
  {
    path: partnersPanelConstant.authorProfile.path,
    title: partnersPanelConstant.authorProfile.title,
  },
];

const publisherParentEnabledRoute: any = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
  },
  {
    path: partnersPanelConstant.quiz.create.path,
    title: partnersPanelConstant.quiz.create.title,
  },
  {
    path: partnersPanelConstant.quiz.list.path,
    title: partnersPanelConstant.quiz.list.title,
  },
  {
    path: partnersPanelConstant.quiz.question.path,
    title: partnersPanelConstant.quiz.question.title,
  },
  {
    path: partnersPanelConstant.quiz.update.path,
    title: partnersPanelConstant.quiz.update.title,
  },
  {
    path: partnersPanelConstant.quiz.updateQuestion.path,
    title: partnersPanelConstant.quiz.updateQuestion.title,
  },
  {
    path: partnersPanelConstant.addBook.path,
    title: partnersPanelConstant.addBook.title,
  },
  {
    path: partnersPanelConstant.editBook.path,
    title: partnersPanelConstant.editBook.title,
  },
  {
    path: partnersPanelConstant.bookPreview.path,
    title: partnersPanelConstant.bookPreview.title,
  },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
  },
  {
    path: partnersPanelConstant.orderDetail.path,
    title: partnersPanelConstant.orderDetail.title,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
  },
  {
    path: partnersPanelConstant.revisions.path,
    title: partnersPanelConstant.revisions.title,
  },
  {
    path: partnersPanelConstant.authorProfile.path,
    title: partnersPanelConstant.authorProfile.title,
  },
  {
    path: partnersPanelConstant.authors.path,
    title: partnersPanelConstant.authors.title,
  },
];

const authorRoute: any = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
  },
  {
    path: partnersPanelConstant.quiz.create.path,
    title: partnersPanelConstant.quiz.create.title,
  },
  {
    path: partnersPanelConstant.quiz.list.path,
    title: partnersPanelConstant.quiz.list.title,
  },
  {
    path: partnersPanelConstant.quiz.question.path,
    title: partnersPanelConstant.quiz.question.title,
  },
  {
    path: partnersPanelConstant.quiz.update.path,
    title: partnersPanelConstant.quiz.update.title,
  },
  {
    path: partnersPanelConstant.quiz.updateQuestion.path,
    title: partnersPanelConstant.quiz.updateQuestion.title,
  },
  {
    path: partnersPanelConstant.addBook.path,
    title: partnersPanelConstant.addBook.title,
  },
  {
    path: partnersPanelConstant.editBook.path,
    title: partnersPanelConstant.editBook.title,
  },
  {
    path: partnersPanelConstant.bookPreview.path,
    title: partnersPanelConstant.bookPreview.title,
  },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
  },
  {
    path: partnersPanelConstant.orderDetail.path,
    title: partnersPanelConstant.orderDetail.title,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
  },
  {
    path: partnersPanelConstant.revisions.path,
    title: partnersPanelConstant.revisions.title,
  },
];

const partnerAuthorRoute: any = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
  },
  {
    path: partnersPanelConstant.bookPreview.path,
    title: partnersPanelConstant.bookPreview.title,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
  },
];

const partnersPendingRoute: any = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
  },
];

const individualKidRoutes: any = [
  {
    path: kidPanelConstant.home.path,
    title: kidPanelConstant.home.title,
  },
  {
    path: kidPanelConstant.mylibrary.path,
    title: kidPanelConstant.mylibrary.title,
  },
  {
    path: kidPanelConstant.plans.path,
    title: kidPanelConstant.plans.title,
  },
  {
    path: kidPanelConstant.leadershipboard.path,
    title: kidPanelConstant.leadershipboard.title,
  },
  {
    path: kidPanelConstant.product.path,
    title: kidPanelConstant.product.title,
  },
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
  },
  {
    path: kidPanelConstant.profile.path,
    title: kidPanelConstant.profile.title,
  },
  {
    path: kidPanelConstant.books.path,
    title: kidPanelConstant.books.title,
  },
  {
    path: kidPanelConstant.cart.path,
    title: kidPanelConstant.cart.title,
  },
  {
    path: kidPanelConstant.publisher.path,
    title: kidPanelConstant.publisher.title,
  },
  {
    path: kidPanelConstant.author.path,
    title: kidPanelConstant.author.title,
  },
  {
    path: kidPanelConstant.preview.path,
    title: kidPanelConstant.preview.title,
  },
  {
    path: kidPanelConstant.progressLevel.path,
    title: kidPanelConstant.progressLevel.title,
  },
  {
    path: kidPanelConstant.checkout.path,
    title: kidPanelConstant.checkout.title,
  },
  {
    path: kidPanelConstant.search.path,
    title: kidPanelConstant.search.title,
  },
  {
    path: kidPanelConstant.notifications.path,
    title: kidPanelConstant.notifications.title,
  },
];

const familyKidRoutes: any = [
  {
    path: kidPanelConstant.home.path,
    title: kidPanelConstant.home.title,
  },
  {
    path: kidPanelConstant.mylibrary.path,
    title: kidPanelConstant.mylibrary.title,
  },
  {
    path: kidPanelConstant.leadershipboard.path,
    title: kidPanelConstant.leadershipboard.title,
  },
  {
    path: kidPanelConstant.product.path,
    title: kidPanelConstant.product.title,
  },
  {
    path: routeConstant.terms.path,
    title: routeConstant.terms.title,
  },
  {
    path: routeConstant.privacy.path,
    title: routeConstant.privacy.title,
  },
  {
    path: kidPanelConstant.profile.path,
    title: kidPanelConstant.profile.title,
  },
  {
    path: kidPanelConstant.books.path,
    title: kidPanelConstant.books.title,
  },
  {
    path: kidPanelConstant.cart.path,
    title: kidPanelConstant.cart.title,
  },
  {
    path: kidPanelConstant.publisher.path,
    title: kidPanelConstant.publisher.title,
  },
  {
    path: kidPanelConstant.author.path,
    title: kidPanelConstant.author.title,
  },
  {
    path: kidPanelConstant.preview.path,
    title: kidPanelConstant.preview.title,
  },
  {
    path: kidPanelConstant.progressLevel.path,
    title: kidPanelConstant.progressLevel.title,
  },
  {
    path: kidPanelConstant.search.path,
    title: kidPanelConstant.search.title,
  },
  {
    path: kidPanelConstant.notifications.path,
    title: kidPanelConstant.notifications.title,
  },
];

const parentRoutes: any = [
  {
    path: parentPanelConstant.dashboard.path,
    title: parentPanelConstant.dashboard.title,
  },
  {
    path: parentPanelConstant.books.path,
    title: parentPanelConstant.books.title,
  },
  {
    path: parentPanelConstant.leadershipboard.path,
    title: parentPanelConstant.leadershipboard.title,
  },
  {
    path: parentPanelConstant.collections.path,
    title: parentPanelConstant.collections.title,
  },
  {
    path: parentPanelConstant.setting.path,
    title: parentPanelConstant.setting.title,
  },
  {
    path: parentPanelConstant.kidProfile.path,
    title: parentPanelConstant.kidProfile.title,
  },
  {
    path: parentPanelConstant.preview.path,
    title: parentPanelConstant.preview.title,
  },
  {
    path: parentPanelConstant.product.path,
    title: parentPanelConstant.product.title,
  },
  {
    path: parentPanelConstant.cart.path,
    title: parentPanelConstant.cart.title,
  },
  {
    path: parentPanelConstant.checkout.path,
    title: parentPanelConstant.checkout.title,
  },
  {
    path: parentPanelConstant.plans.path,
    title: parentPanelConstant.plans.title,
  },
  {
    path: parentPanelConstant.publisher.path,
    title: parentPanelConstant.publisher.title,
  },
  {
    path: parentPanelConstant.author.path,
    title: parentPanelConstant.author.title,
  },
  {
    path: parentPanelConstant.search.path,
    title: parentPanelConstant.search.title,
  },
];

export {
  familyKidRoutes,
  individualKidRoutes,
  parentRoutes,
  partnersPendingRoute,
  publicRoute,
  publisherRoute,
  publisherParentEnabledRoute,
  authorRoute,
  partnerAuthorRoute,
};
