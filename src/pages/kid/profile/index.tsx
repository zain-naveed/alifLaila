import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CustomTab from "shared/components/common/customTabs";
import Footer from "shared/components/footer";
import EditProfile from "shared/components/kid/profileComponents/editProfile";
import MyOrders from "shared/components/kid/profileComponents/myOrders";
import MyWallet from "shared/components/kid/profileComponents/myWallet";
import Progress from "shared/components/kid/profileComponents/progress";
import Subscriptions from "shared/components/kid/profileComponents/subscriptions";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { kidAccountRole } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import {
  FamilyProfileTabs,
  FamilyProfileTabsEnums,
  ProfileTabs,
  ProfileTabsEnums,
} from "shared/utils/pageConstant/kid/profileConstant";
import styles from "./style.module.scss";
const UserInfo = dynamic(
  () => import("shared/components/kid/profileComponents/userInfo"),
  { ssr: false }
);

const Profile = ({
  keyword,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role;
  const bodyRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<string | any>(
    keyword
      ? keyword
      : kid_role === kidAccountRole.individual
      ? ProfileTabs[0]
      : FamilyProfileTabs[0]
  );

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: kidPanelConstant?.profile.path,
      query: { keyword: val },
    });
  };

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
    } else {
      setActiveTab(
        kid_role === kidAccountRole.individual
          ? ProfileTabs[0]
          : FamilyProfileTabs[0]
      );
    }
  }, [router?.query]);

  useScroll(bodyRef);

  return (
    <>
      <ReaderNavWrapper />

      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 pt-4 w-100"
          )}
        >
          <UserInfo />
          <CustomTab
            tabs={
              kid_role === kidAccountRole.individual
                ? ProfileTabs
                : FamilyProfileTabs
            }
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          {kid_role === kidAccountRole.individual ? (
            <>
              {ProfileTabsEnums.progress === activeTab ? (
                <Progress />
              ) : ProfileTabsEnums.myWallet === activeTab ? (
                <MyWallet kid_role={kid_role} />
              ) : ProfileTabsEnums.myOrders === activeTab ? (
                <MyOrders />
              ) : ProfileTabsEnums.subscriptions === activeTab ? (
                <Subscriptions />
              ) : ProfileTabsEnums.editProfile ? (
                <EditProfile kid_role={kid_role} />
              ) : (
                <Progress />
              )}
            </>
          ) : (
            <>
              {FamilyProfileTabsEnums.progress === activeTab ? (
                <Progress />
              ) : FamilyProfileTabsEnums.myWallet === activeTab ? (
                <MyWallet kid_role={kid_role} />
              ) : FamilyProfileTabsEnums.editProfile ? (
                <EditProfile />
              ) : (
                <Progress />
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res, query }) => {
  return {
    props: {
      keyword: query?.keyword ? query?.keyword : ProfileTabs[0],
      user: req?.cookies?.user,
    },
  };
});

export default Profile;
