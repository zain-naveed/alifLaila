import {
  DashLeaderShipIcon,
  DashboardBookIcon,
  DashboardMemberShipIcon,
  DashoboardSettingIcon,
  HeartIcon,
  HomeIcon,
} from "assets";
import { parentPanelConstant } from "shared/routes/routeConstant";

const parentPathConstants: {
  path?: string;
  title: string;
  Icon: any;
}[] = [
  {
    path: parentPanelConstant.dashboard.path,
    title: parentPanelConstant.dashboard.title,
    Icon: HomeIcon,
  },
  {
    path: parentPanelConstant.books.path,
    title: parentPanelConstant.books.title,
    Icon: DashboardBookIcon,
  },
  {
    path: parentPanelConstant.leadershipboard.path,
    title: parentPanelConstant.leadershipboard.title,
    Icon: DashLeaderShipIcon,
  },
  {
    path: parentPanelConstant.collections.path,
    title: parentPanelConstant.collections.title,
    Icon: HeartIcon,
  },
  {
    path: parentPanelConstant.plans.path,
    title: parentPanelConstant.plans.title,
    Icon: DashboardMemberShipIcon,
  },
  {
    path: parentPanelConstant.setting.path,
    title: parentPanelConstant.setting.title,
    Icon: DashoboardSettingIcon,
  },
];
export { parentPathConstants };
