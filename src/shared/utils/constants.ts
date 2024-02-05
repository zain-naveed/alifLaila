import {
  AwardIcon,
  CheckIcon,
  HomeFillIcon,
  LeaderShipIcon,
  LibraryIcon,
  LogoutIcon,
  OrdersIcon,
  PartnersIcon,
  PlansIcon,
  PlansSubMenuIcon,
  ProgressIcon,
  SchoolIcon,
  User2Icon,
  UserFillIcon,
  Wallet2,
} from "assets";

import { kidPanelConstant, routeConstant } from "shared/routes/routeConstant";

const headerItems: {
  name: string;
  route: string;
  Icon: any;
}[] = [
  { name: "Home", route: routeConstant.home.path, Icon: HomeFillIcon },
  { name: "Parents", route: routeConstant.parent.path, Icon: UserFillIcon },
  { name: "School", route: routeConstant.school.path, Icon: SchoolIcon },
  {
    name: "Be Partner",
    route: routeConstant.partners.path,
    Icon: PartnersIcon,
  },
  {
    name: "Plans",
    route: routeConstant.plans.path,
    Icon: PlansSubMenuIcon,
  },
];

const readerHeaderItems: {
  name: string;
  route: string;
  Icon: any;
}[] = [
  { name: "Home", route: kidPanelConstant.home.path, Icon: HomeFillIcon },
  {
    name: "My Library",
    route: kidPanelConstant.mylibrary.path,
    Icon: LibraryIcon,
  },
  { name: "Plans", route: kidPanelConstant.plans.path, Icon: PlansIcon },
  {
    name: "Leadership Board",
    route: kidPanelConstant.leadershipboard.path,
    Icon: LeaderShipIcon,
  },
];

const familyReaderHeaderItems: {
  name: string;
  route: string;
  Icon: any;
}[] = [
  { name: "Home", route: kidPanelConstant.home.path, Icon: HomeFillIcon },
  {
    name: "My Library",
    route: kidPanelConstant.mylibrary.path,
    Icon: LibraryIcon,
  },
  {
    name: "Leadership Board",
    route: kidPanelConstant.leadershipboard.path,
    Icon: LeaderShipIcon,
  },
];

const readerProfileDropDownOptions: {
  title: string;
  value: string;
  Icon: any;
  route: string;
}[] = [
  {
    title: "My Progress",
    value: "My Progress",
    Icon: ProgressIcon,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "My Wallet",
    value: "My Wallet",
    Icon: Wallet2,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "My Orders",
    value: "My Orders",
    Icon: OrdersIcon,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "Badges",
    value: "Badges",
    Icon: AwardIcon,
    route: kidPanelConstant.progressLevel.path,
  },
  {
    title: "My Profile",
    value: "Edit Profile",
    Icon: User2Icon,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "Log out",
    value: "Log out",
    Icon: LogoutIcon,
    route: "",
  },
];

const parentReaderProfileDropDownOptions: {
  title: string;
  value: string;
  Icon: any;
  route: string;
}[] = [
  {
    title: "My Progress",
    value: "My Progress",
    Icon: ProgressIcon,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "My Wallet",
    value: "My Wallet",
    Icon: Wallet2,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "Badges",
    value: "Badges",
    Icon: AwardIcon,
    route: kidPanelConstant.progressLevel.path,
  },
  {
    title: "My Profile",
    value: "Edit Profile",
    Icon: User2Icon,
    route: kidPanelConstant.profile.path,
  },
  {
    title: "Log out",
    value: "Log out",
    Icon: LogoutIcon,
    route: "",
  },
];

const publisherContentData: {
  paragraph: string;
  Icon: any;
}[] = [
  {
    Icon: CheckIcon,
    paragraph: "Boost your readership and grow your loyal audience with us.",
  },
  {
    Icon: CheckIcon,
    paragraph: "Publish like a pro with our expert guidance and support.",
  },
  {
    Icon: CheckIcon,
    paragraph:
      "Experience our user-friendly interface and get smart insights into your book's performance",
  },
  {
    Icon: CheckIcon,
    paragraph: "Connect with readers who adore your books and crave more.",
  },
  {
    Icon: CheckIcon,
    paragraph: "Make your books come alive: We take care of the tech for you.",
  },
];

const freePlanBenifits = [
  "Get access to one book per day.",
  "No access to PREMIUM reads!",
  "Personalized book recommendations.",
  "Seamless access across devices",
];

export {
  headerItems,
  publisherContentData,
  readerHeaderItems,
  readerProfileDropDownOptions,
  freePlanBenifits,
  familyReaderHeaderItems,
  parentReaderProfileDropDownOptions,
};
