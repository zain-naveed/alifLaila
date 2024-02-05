import {
  AccountPending,
  CatalogueIcon,
  ChevDownIcon,
  CoinAsset1,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LineGraph from "shared/components/common/LineGraph";
import BarGraph from "shared/components/common/barGraph";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import NoContentCard from "shared/components/common/noContentCard";
import EarningCard from "shared/components/earningCard";
import ReadBook from "shared/components/publisher/readBook";
import ReadGenre from "shared/components/publisher/readGenre";
import OptionsDropDown from "shared/dropDowns/options";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import {
  GetBooksStats,
  GetDashboardData,
} from "shared/services/publisher/dashboardService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { accountStatus, roles } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import { SortFilters } from "shared/utils/pageConstant/partner/dashboardConstant";
import {
  publisherPathConstants,
  partnerPendingPathConstants,
  independentAuthorPathConstants,
  partnerAuthorPathConstant,
  publisherPartnerEnabledPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import PartnerAuthorReadBook from "shared/components/publisher/partnerAuthorReadBook";
import { store } from "shared/redux/store";

function Dashboard({
  stats,
  graphData,
  mostReadGenres,
  filteredBooks,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const account_status = JSON.parse(user ? user : "{}")?.status;
  const isPartnerAuthor = JSON.parse(user ? user : "{}")?.is_partner_enabled;
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? "{}")?.is_partner_enabled_server;

  const [totalEarning, setTotalEarnings] = useState<any>(
    stats?.data?.total_earned_coins
  );
  const [totalConvertedEarning, setTotalConvertedEarning] = useState<any>(
    stats?.data?.total_earning
  );
  const [totalBooksPublished, setTotalBooksPublished] = useState<any>(
    stats?.data?.books?.status?.published
  );
  const [initial, setInitial] = useState<boolean>(true);
  const [bookStats, setBookStats] = useState<any>(filteredBooks?.data);
  const [isBookLoading, setIsBookLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<any>(SortFilters[0]);
  const [filterOptions, setFilterOptions] = useState<boolean>(false);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: SortFilters[0].label,
      Icon: null,
      action: () => {
        setInitial(false);
        setFilter(SortFilters[0]);
      },
    },
    {
      title: SortFilters[1].label,
      Icon: null,
      action: () => {
        setInitial(false);
        setFilter(SortFilters[1]);
      },
    },
    {
      title: SortFilters[2].label,
      Icon: null,
      action: () => {
        setInitial(false);
        setFilter(SortFilters[2]);
      },
    },
  ];

  const getBookStats = () => {
    setIsBookLoading(true);
    GetBooksStats(3, filter?.value)
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setBookStats(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsBookLoading(false);
      });
  };

  const onRefresh = () => {
    setLoading(true);
    GetDashboardData()
      .then(({ data: { status, data, message } }) => {
        if (status) {
          setTotalEarnings(data.total_earned_coins);
          setTotalConvertedEarning(data.total_earning);
          setTotalBooksPublished(data.books?.status?.published);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      getBookStats();
    }
  }, [filter]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Dashboard",
          },
        ],
      })
    );
  }, []);

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
      {account_status === accountStatus.pending ? (
        <div className={classNames(styles.notContentFoundContnr)}>
          <NoContentCard
            Icon={AccountPending}
            customContainer={classNames(
              "d-flex flex-column align-items-center gap-0 w-100"
            )}
            label1="Approval Pending"
            label2="Your account is in Review Please wait!"
          />
        </div>
      ) : (
        <>
          <div
            className={classNames(
              "d-flex flex-column flex-md-row justify-content-between align-items-center gap-4"
            )}
          >
            <div className={classNames("w-100")}>
              <EarningCard
                Icon={CoinAsset1}
                heading="Total Coins Earned This Month"
                price={totalEarning}
                convvertedPrice={totalConvertedEarning}
                onClick={onRefresh}
                loading={loading}
              />
            </div>
            <div className={classNames("w-100")}>
              <EarningCard
                Icon={CatalogueIcon}
                heading="Books Published"
                price={totalBooksPublished}
              />
            </div>
          </div>

          <div
            className={classNames(
              "d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4 mt-4"
            )}
          >
            <div className={classNames("col-12 col-lg-7 col-xl-8 px-0 mx-0")}>
              <LineGraph chartData={graphData?.data} />
            </div>
            {isPartnerAuthor ? (
              <div
                className={classNames(
                  styles.cardContainer,
                  styles.readBookWraper,
                  "w-100"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-row justify-content-between align-items-center mb-3"
                  )}
                >
                  <Heading
                    heading="Most Read Genre"
                    headingStyle={styles.bookHeading}
                  />
                </div>
                <ReadGenre mostReadGenres={mostReadGenres?.data} />
              </div>
            ) : (
              <div
                className={classNames(
                  styles.cardContainer,
                  styles.readBookWraper,
                  "w-100"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-row justify-content-between align-items-center mb-3"
                  )}
                >
                  <Heading heading="Books" headingStyle={styles.bookHeading} />

                  <div
                    className={classNames(
                      styles.filterContainer,
                      "position-relative"
                    )}
                  >
                    <label
                      className={classNames(styles.filterLabel)}
                      onClick={() => {
                        setFilterOptions(true);
                      }}
                    >
                      {filter?.label}
                    </label>
                    <ChevDownIcon
                      className={classNames(styles.filterIcon)}
                      onClick={() => {
                        setFilterOptions(true);
                      }}
                    />

                    <OptionsDropDown
                      options={options}
                      openSelection={filterOptions}
                      setOpenSelection={setFilterOptions}
                      customContainer={styles.optionsContainer}
                    />
                  </div>
                </div>
                <div>
                  <ReadBook
                    bookStats={bookStats}
                    loading={isBookLoading}
                    sortBy={filter?.value}
                  />
                </div>
              </div>
            )}
          </div>
          {!isPartnerAuthor ? (
            <div
              className={classNames(
                "d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4 mt-4 mb-4"
              )}
            >
              <div className={classNames("col-12 col-lg-7 col-xl-8 px-0")}>
                <BarGraph chartData={graphData?.data} />
              </div>
              <div
                className={classNames(
                  styles.cardContainer,
                  styles.readBookWraper,
                  "w-100"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-row justify-content-between align-items-center mb-3"
                  )}
                >
                  <Heading
                    heading="Most Read Genre"
                    headingStyle={styles.bookHeading}
                  />
                </div>
                <ReadGenre mostReadGenres={mostReadGenres?.data} />
              </div>
            </div>
          ) : (
            <div className={classNames("d-flex mt-4 mb-4")}>
              <div
                className={classNames(
                  styles.cardContainer,
                  styles.readBookWraper,
                  "w-100"
                )}
                style={{ height: "100%" }}
              >
                <div
                  className={classNames(
                    "d-flex flex-row justify-content-between align-items-center mb-3"
                  )}
                >
                  <Heading heading="Books" headingStyle={styles.bookHeading} />

                  <div
                    className={classNames(
                      styles.filterContainer,
                      "position-relative"
                    )}
                  >
                    <label
                      className={classNames(styles.filterLabel)}
                      onClick={() => {
                        setFilterOptions(true);
                      }}
                    >
                      {filter?.label}
                    </label>
                    <ChevDownIcon
                      className={classNames(styles.filterIcon)}
                      onClick={() => {
                        setFilterOptions(true);
                      }}
                    />

                    <OptionsDropDown
                      options={options}
                      openSelection={filterOptions}
                      setOpenSelection={setFilterOptions}
                      customContainer={styles.optionsContainer}
                    />
                  </div>
                </div>
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-start gap-5",
                    styles.booksListContainer
                  )}
                >
                  <PartnerAuthorReadBook
                    bookStats={bookStats}
                    loading={isBookLoading}
                    sortBy={filter?.value}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;

  const [statsRes, graphRes, mostReadGenresRes, bookStatsRes] =
    await Promise.all([
      fetch(BaseURL + endpoint + Endpoint.partner.dashboard.getDashboardStats, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + endpoint + Endpoint.partner.dashboard.graph, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(
        BaseURL +
          endpoint +
          Endpoint.partner.dashboard.getMostReadGenres +
          `?take=5`,
        {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          next: { revalidate: 3600 },
        }
      ),
      fetch(
        BaseURL +
          endpoint +
          Endpoint.partner.dashboard.getBooksStats +
          `?take=3&sort_by=${SortFilters[0]?.value}`,
        {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          next: { revalidate: 3600 },
        }
      ),
    ]);
  const [stats, graphData, mostReadGenres, filteredBooks] = await Promise.all([
    statsRes.json(),
    graphRes.json(),
    mostReadGenresRes.json(),
    bookStatsRes.json(),
  ]);
  return {
    props: {
      user: req?.cookies?.user,
      stats,
      graphData,
      mostReadGenres,
      filteredBooks,
    },
  };
});

export default Dashboard;
