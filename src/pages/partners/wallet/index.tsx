import { CoinAsset1, PriceConvertIcon } from "assets";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import EarningCard from "shared/components/earningCard";
import AliflailaPayments from "shared/components/publisher/walletScreenComponents/aliflailaPayments";
import UserSpendings from "shared/components/publisher/walletScreenComponents/userSpendings";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { roles } from "shared/utils/enum";
import { classNames, withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/partner/walletConstants";
import {
  independentAuthorPathConstants,
  partnerAuthorPathConstant,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";

function Wallet({
  keyword,
  paymentsData,
  userSpendingData,
  statsData,
  userCookie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isPartnerAuthor = JSON.parse(
    userCookie ? userCookie : "{}"
  )?.is_partner_enabled;
  const isParentEnabled = JSON.parse(userCookie ?? '{}')?.is_partner_enabled_server;

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    login: {
      user: { role, associate_with },
    },
  } = useSelector((state: any) => state.root);

  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: partnersPanelConstant.wallet.path,
      query: { keyword: val },
    });
  };

  useEffect(() => {
    if (!isPartnerAuthor) {
      if (router?.query?.keyword) {
        setActiveTab(router?.query?.keyword);
      } else {
        setActiveTab(Tabs[0]);
      }
    }
  }, [router?.query, isPartnerAuthor]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Wallet",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper
      navigationItems={
        role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : role === roles.author && associate_with
          ? partnerAuthorPathConstant
          : independentAuthorPathConstants
      }
    >
      <div className="row mb-4">
        <div className={classNames("col-md-6")}>
          <EarningCard
            Icon={CoinAsset1}
            heading="Total Coins Earned"
            price={statsData?.data?.total_coins}
          />
        </div>
        <div className={classNames("col-md-6")}>
          <EarningCard
            showRupee
            Icon={PriceConvertIcon}
            heading="Total Rupees Converted"
            price={statsData?.data?.total_amount}
          />
        </div>
      </div>
      {isPartnerAuthor ? (
        <AliflailaPayments paymentsData={paymentsData?.data} />
      ) : (
        <>
          <CustomTab
            tabs={Tabs}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
            color="#9A469B"
          />
          {activeTab === TabsEnums.aliflailaPayments ? (
            <AliflailaPayments paymentsData={paymentsData?.data} />
          ) : (
            <UserSpendings userSpendingData={userSpendingData?.data} />
          )}
        </>
      )}
    </DashboardWraper>
  );
}

export const getServerSideProps = withError<{
  keyword?: any;
  userSpendingData?: any;
  paymentsData?: any;
  statsData: any;
  userCookie: any;
}>(async ({ req, query }) => {
  const isPartnerAuthor = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.is_partner_enabled;
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  if (isPartnerAuthor) {
    const [statsRes, paymentsRes] = await Promise.all([
      fetch(BaseURL + endpoint + Endpoint.partner.wallet.stats, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      fetch(BaseURL + endpoint + Endpoint.partner.wallet.payments, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    ]);

    const [paymentsData, statsData] = await Promise.all([
      paymentsRes.json(),
      statsRes.json(),
    ]);

    return {
      props: {
        paymentsData,
        statsData,
        userCookie: req?.cookies?.user,
      },
    };
  } else {
    if (query?.keyword === TabsEnums.userSpending) {
      const [statsRes, userSpendingRes] = await Promise.all([
        fetch(BaseURL + endpoint + Endpoint.partner.wallet.stats, {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
        fetch(BaseURL + endpoint + Endpoint.partner.wallet.userSpendings, {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      ]);

      const [userSpendingData, statsData] = await Promise.all([
        userSpendingRes.json(),
        statsRes.json(),
      ]);
      return {
        props: {
          userSpendingData,
          statsData,
          keyword: query?.keyword ? query?.keyword : Tabs[0],
          userCookie: req?.cookies?.user,
        },
      };
    } else {
      const [statsRes, paymentsRes] = await Promise.all([
        fetch(BaseURL + endpoint + Endpoint.partner.wallet.stats, {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
        fetch(BaseURL + endpoint + Endpoint.partner.wallet.payments, {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
      ]);

      const [paymentsData, statsData] = await Promise.all([
        paymentsRes.json(),
        statsRes.json(),
      ]);
      return {
        props: {
          paymentsData,
          statsData,
          keyword: query?.keyword ? query?.keyword : Tabs[0],
          userCookie: req?.cookies?.user,
        },
      };
    }
  }
});

export default Wallet;
