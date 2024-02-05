import {
  ChatIcon,
  DashboardBookIcon,
  DashboardFeatureIcon,
  DashoboardOrderIcon,
  DashoboardSettingIcon,
  FileIcon,
  HomeIcon,
  PencilPaperIcon,
  WalletIcon,
} from "assets";
import { partnersPanelConstant } from "shared/routes/routeConstant";


const publisherPathConstants: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
    Icon: HomeIcon,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
    Icon: DashboardBookIcon,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
    Icon: DashboardFeatureIcon,
  },
  // {
  //   path: partnersPanelConstant.authors.path,
  //   title: partnersPanelConstant.authors.title,
  //   Icon: PencilPaperIcon,
  // },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
    Icon: DashoboardOrderIcon,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
    Icon: ChatIcon,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
    Icon: FileIcon,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
    Icon: WalletIcon,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];

const publisherPartnerEnabledPathConstants: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
    Icon: HomeIcon,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
    Icon: DashboardBookIcon,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
    Icon: DashboardFeatureIcon,
  },
  {
    path: partnersPanelConstant.authors.path,
    title: partnersPanelConstant.authors.title,
    Icon: PencilPaperIcon,
  },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
    Icon: DashoboardOrderIcon,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
    Icon: ChatIcon,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
    Icon: FileIcon,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
    Icon: WalletIcon,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];

const independentAuthorPathConstants: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
    Icon: HomeIcon,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
    Icon: DashboardBookIcon,
  },
  {
    path: partnersPanelConstant.featureBook.path,
    title: partnersPanelConstant.featureBook.title,
    Icon: DashboardFeatureIcon,
  },
  {
    path: partnersPanelConstant.order.path,
    title: partnersPanelConstant.order.title,
    Icon: DashoboardOrderIcon,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
    Icon: ChatIcon,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
    Icon: FileIcon,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
    Icon: WalletIcon,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];

const partnerPendingPathConstants: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
    Icon: HomeIcon,
  },
  {
    path: partnersPanelConstant.support.path,
    title: partnersPanelConstant.support.title,
    Icon: ChatIcon,
  },
  {
    path: partnersPanelConstant.mou.path,
    title: partnersPanelConstant.mou.title,
    Icon: FileIcon,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];

const partnerAuthorPathConstant: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: partnersPanelConstant.stats.path,
    title: partnersPanelConstant.stats.title,
    Icon: HomeIcon,
  },
  {
    path: partnersPanelConstant.book.path,
    title: partnersPanelConstant.book.title,
    Icon: DashboardBookIcon,
  },
  {
    path: partnersPanelConstant.wallet.path,
    title: partnersPanelConstant.wallet.title,
    Icon: WalletIcon,
  },
  {
    path: partnersPanelConstant.setting.path,
    title: partnersPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];

export {
  independentAuthorPathConstants,
  partnerAuthorPathConstant,
  partnerPendingPathConstants,
  publisherPathConstants,
  publisherPartnerEnabledPathConstants
};
