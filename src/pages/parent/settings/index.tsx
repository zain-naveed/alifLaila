import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import SettingsHeader from "shared/components/parent/settingsHeader";
import Address from "shared/components/parent/settingsScreenComponents/address";
import Orders from "shared/components/parent/settingsScreenComponents/orders";
import Profile from "shared/components/parent/settingsScreenComponents/profile";
import SubscriptionHistory from "shared/components/parent/settingsScreenComponents/subscriptionHistory";
import Wallet from "shared/components/parent/settingsScreenComponents/wallet";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/parent/settingsConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";

function Settings({
  keyword,
  walletStatsData,
  walletHistoryData,
  kidsListData,
  orderListData,
  historyListData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: parentPanelConstant?.setting.path,
      query: { keyword: val },
    });
  };

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
    } else {
      setActiveTab(Tabs[0]);
    }
  }, [router?.query]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Settings",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper navigationItems={parentPathConstants}>
      <div className={classNames("d-flex flex-column")}>
        <SettingsHeader showPackageDetail={activeTab === TabsEnums.plans} />
        <CustomTab
          tabs={Tabs}
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
        />
        <div className={classNames("my-4 my-sm-5")}>
          {activeTab === TabsEnums.myWallet ? (
            <Wallet
              walletStatsData={walletStatsData?.data}
              walletHistoryData={walletHistoryData?.data}
              kidsListData={kidsListData}
            />
          ) : activeTab === TabsEnums.myOrders ? (
            <Orders orderListData={orderListData?.data} />
          ) : activeTab === TabsEnums.plans ? (
            <SubscriptionHistory historyListData={historyListData?.data} />
          ) : activeTab === TabsEnums.editProfile ? (
            <Profile />
          ) : (
            <Address />
          )}
        </div>
      </div>
    </DashboardWraper>
  );
}

export default Settings;

export const getServerSideProps = withError<{
  keyword: any;
  walletStatsData?: any;
  walletHistoryData?: any;
  kidsListData?: any;
  orderListData?: any;
  historyListData?: any;
}>(async ({ res, req, query }) => {
  if (query?.keyword === TabsEnums.myOrders) {
    const ordersListRes = await fetch(BaseURL + Endpoint.kid.cart.orderList, {
      method: "Post",
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const orderListData = await ordersListRes.json();
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        orderListData,
      },
    };
  } else if (query?.keyword === TabsEnums.plans) {
    const historyListRes = await fetch(BaseURL + Endpoint.kid.plans.history, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const historyListData = await historyListRes.json();
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        historyListData,
      },
    };
  } else if (
    query?.keyword === TabsEnums.myWallet ||
    query?.keyword === undefined
  ) {
    const [kidsListRes, walletStatsRes, walletHistoryRes] = await Promise.all([
      fetch(BaseURL + Endpoint.parent.dashboard.getKids, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + Endpoint.kid.wallet.wallet, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + Endpoint.kid.wallet.history + `?page=1`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
    ]);

    const [kidsListData, walletStatsData, walletHistoryData] =
      await Promise.all([
        kidsListRes.json(),
        walletStatsRes.json(),
        walletHistoryRes.json(),
      ]);
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        walletStatsData,
        walletHistoryData,
        kidsListData,
      },
    };
  } else {
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
      },
    };
  }
});
