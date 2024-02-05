import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useState } from "react";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import SettingTab from "shared/components/common/settingTab";
import { accountStatus, roles } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import {
  tabEnum,
  tabs,
} from "shared/utils/pageConstant/partner/settingConstant";
import {
  publisherPathConstants,
  partnerPendingPathConstants,
  independentAuthorPathConstants,
  partnerAuthorPathConstant,
  publisherPartnerEnabledPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import EditProfile from "shared/components/publisher/settingsComponents/editProfile";
import AccountDetail from "shared/components/publisher/settingsComponents/accountDetail";

function Setting({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const account_status = JSON.parse(user ? user : "{}")?.status;
  const isPartnerAuthor = JSON.parse(user ? user : "{}")?.is_partner_enabled;
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };

  return (
    <DashboardWraper
      navigationItems={
        account_status === accountStatus.pending
          ? partnerPendingPathConstants
          : role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : role === roles.author && isPartnerAuthor
          ? partnerAuthorPathConstant
          : independentAuthorPathConstants
      }
    >
      <div className={classNames(styles.settingContainer)}>
        <div className={styles.padding_container}>
          <Heading heading="Settings" headingStyle={styles.setting_heading} />
        </div>
        <SettingTab
          tabs={tabs}
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
        />
        {tabEnum.editProfile == activeTab ? (
          <EditProfile />
        ) : tabEnum.account_detail == activeTab ? (
          <AccountDetail />
        ) : (
          ""
        )}
      </div>
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      user: req?.cookies?.user,
    },
  };
});

export default Setting;
