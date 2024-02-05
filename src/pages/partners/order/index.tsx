import {
  FilterLines,
  OrderCountStatIcon,
  OrderEarningStatIcon,
  PendingStatIcon,
  SearchIcon,
} from "assets";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import EarningCard from "shared/components/earningCard";
import OrderTable from "shared/components/publisher/orderTable";
import useDebounce from "shared/customHook/useDebounce";
import OptionsDropDown from "shared/dropDowns/options";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { GetOrdersList } from "shared/services/publisher/orderService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { classNames, withError } from "shared/utils/helper";
import { OrdersFilters } from "shared/utils/pageConstant/partner/orderConstant";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import { roles } from "shared/utils/enum";

function Wallet({
  user,
  stats,
  ordersList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState<number>(ordersList?.data?.total);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [orders, setOrders] = useState<any[]>(ordersList?.data?.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: OrdersFilters[0].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[0].value);
      },
    },
    {
      title: OrdersFilters[1].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[1].value);
      },
    },
    {
      title: OrdersFilters[2].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[2].value);
      },
    },
    {
      title: OrdersFilters[3].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[3].value);
      },
    },
    {
      title: OrdersFilters[4].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[4].value);
      },
    },
    {
      title: OrdersFilters[5].label,
      Icon: null,
      action: () => {
        handleOrderslist(OrdersFilters[5].value);
      },
    },
  ];

  const handleOrderslist = (filter: any) => {
    setLoading(true);
    GetOrdersList({ search: searchVal, filter_by: filter }, currentPage)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data) {
            setOrders(data?.data);
            setTotal(data?.total);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    if (!initial) {
      handleOrderslist("");
    }
  }, [searchVal, currentPage]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Orders",
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
          : independentAuthorPathConstants
      }
    >
      <div className="row mb-4">
        <div className={classNames("col-lg-4 col-sm-6 mt-2")}>
          <EarningCard
            Icon={OrderEarningStatIcon}
            heading="Total Earnings"
            price={stats?.data?.total_earnings}
          />
        </div>
        <div className={classNames("col-lg-4 col-sm-6 mt-2")}>
          <EarningCard
            Icon={OrderCountStatIcon}
            heading="Total Orders"
            price={stats?.data?.total_orders}
          />
        </div>
        <div className={classNames("col-lg-4 col-sm-6 mt-2")}>
          <EarningCard
            Icon={PendingStatIcon}
            heading="Pending Orders"
            price={stats?.data?.pending_orders}
          />
        </div>
      </div>
      <div className={styles.tableMain}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4"
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading
              heading="Book Orders"
              headingStyle={styles.bookMainHeading}
            />
            <Title
              title="Manage your book orders here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames("d-flex flex-wrap align-items-center gap-3")}
          >
            <div className={classNames(styles.searchContainer, "d-flex  ")}>
              <SearchIcon className={classNames(styles.searchIconStyle)} />
              <input
                className={classNames(styles.searchInputStyle, "ps-2")}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setInitial(false);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className={classNames("position-relative")}>
              <CustomButton
                IconDirction="left"
                title="Filters"
                Icon={FilterLines}
                iconStyle={styles.iconStyle}
                containerStyle={classNames(styles.buttonFilter, "gap-2")}
                onClick={() => {
                  setOpenSelection(!openSelection);
                }}
              />
              <OptionsDropDown
                options={options}
                openSelection={openSelection}
                setOpenSelection={setOpenSelection}
                customContainer={styles.optionsContainer}
              />
            </div>
          </div>
        </div>
        <OrderTable orders={orders} loading={loading} />
        {orders?.length > 0 && !loading ? (
          <Pagination
            className={styles.paginationBar}
            currentPage={currentPage}
            totalCount={total}
            pageSize={10}
            onPageChange={(page: any) => {
              setInitial(false);
              setCurrentPage(page);
            }}
          />
        ) : null}
      </div>
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const [statsRes, orderRes] = await Promise.all([
    fetch(BaseURL + endpoint + Endpoint.partner.order.stats, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + endpoint + Endpoint.partner.order.list + `?page=1`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
  ]);
  const [stats, ordersList] = await Promise.all([
    statsRes.json(),
    orderRes.json(),
  ]);
  return { props: { user: req?.cookies?.user , stats, ordersList } };
});

export default Wallet;
