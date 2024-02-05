import {
  ChevDownIcon,
  LeaderShipBoardAvatar1,
  LoadingAnimation,
  NoReviewIcon,
  ReaderOfMonthBadge,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Animation from "shared/components/common/animation";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import LeaderShipCard from "shared/components/kid/leaderShipCard";
import OptionsDropDown from "shared/dropDowns/options";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { getLeadershipStats } from "shared/services/kid/leaderShipBoardService";
import { getAgeRangeList } from "shared/services/publisher/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/parent/leaderShipConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";

function LeaderShipBoard({
  keyword,
  resp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [monthly, setMonthly] = useState<any>(resp?.data?.month);
  const [weekly, setWeekly] = useState<any>(resp?.data?.week);

  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [options, setOptions] = useState<any[]>([]);

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: parentPanelConstant?.leadershipboard.path,
      query: { keyword: val },
    });
  };

  const handleGetLeaderShipStats = (age_id: any) => {
    setLoading(true);
    getLeadershipStats({
      category: keyword === TabsEnums.readerOfWeek ? 2 : 1,
      age_range_id: age_id,
    })
      .then(({ data: { data, status } }) => {
        if (status) {
          setWeekly(data?.week);
          setMonthly(data?.month);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetAgeRangeList = () => {
    getAgeRangeList()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data) {
            let tempArr = [];
            for (let x = 0; x < data?.length; x++) {
              let obj = {
                title: data[x]?.text,
                Icon: null,
                action: () => {
                  handleGetLeaderShipStats(data[x]?.id);
                },
              };
              tempArr?.push(obj);
            }
            setOptions(tempArr);
          }
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
      setMonthly(resp?.data?.month);
      setWeekly(resp?.data?.week);
    } else {
      setActiveTab(Tabs[0]);
    }
  }, [router?.query]);

  useEffect(() => {
    handleGetAgeRangeList();
  }, [router?.query]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Leadership Board",
          },
        ],
      })
    );
  }, []);

  return (
    <>
      {loading ? <Animation animaton={LoadingAnimation} /> : null}

      <DashboardWraper navigationItems={parentPathConstants}>
        <div className={classNames("d-flex flex-column")}>
          <div
            className={classNames(
              styles.headerContainer,
              "d-flex align-items-center justify-content-start w-100"
            )}
          >
            <div
              className={classNames(
                styles.customContainer,
                styles.mainContainer,
                "px-3 px-sm-0 gap-1 w-100"
              )}
            >
              <label className={classNames(styles.mainHeading)}>
                Leadership Board
              </label>
              <label className={classNames(styles.subHeading)}>
                Reader Spotlight: Acknowledging the outstanding readers of the
                month and week
              </label>
            </div>
          </div>

          <div className={classNames("position-relative")}>
            <CustomTab
              tabs={Tabs}
              activeTab={activeTab}
              handleActiveTab={handleActiveTab}
            />

            <div className={classNames(styles.filterContainer)}>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center gap-1 position-relative w-100"
                )}
              >
                <label
                  className={classNames(styles.filterLabel)}
                  onClick={() => {
                    setOpenSelection(!openSelection);
                  }}
                >
                  Age Range
                </label>
                <ChevDownIcon
                  className={classNames(styles.filterIcon)}
                  onClick={() => {
                    setOpenSelection(!openSelection);
                  }}
                />
                {options?.length ? (
                  <OptionsDropDown
                    options={options}
                    openSelection={openSelection}
                    setOpenSelection={setOpenSelection}
                    customContainer={styles.optionsContainer}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div className={classNames("mt-4")}>
            {activeTab === TabsEnums.readerOfMonth ? (
              <ReaderOfMonth monthly={monthly} />
            ) : (
              <ReaderOfWeek weekly={weekly} />
            )}
          </div>
        </div>
      </DashboardWraper>
    </>
  );
}

const ReaderOfMonth = ({ monthly }: any) => {
  return monthly ? (
    <div className={classNames(styles.bgContainer)}>
      <div
        className={classNames(
          styles.readerOfMonthContainer,
          "d-flex flex-column align-items-center"
        )}
      >
        <div
          className={classNames(
            styles.readerOfMonthSubContainer,
            "d-flex flex-column align-items-center justify-content-center px-4 gap-2 gap-sm-3 gap-lg-4"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-end justify-content-between w-100",
              styles.userInfoContainer
            )}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-center gap-2"
              )}
            >
              <Image
                src={
                  monthly?.user?.profile_picture
                    ? monthly?.user?.profile_picture
                    : LeaderShipBoardAvatar1
                }
                alt="profile-pic"
                className={classNames(styles.avatarStyle)}
                height={102}
                width={102}
              />
              <label className={classNames(styles.winnerName)}>
                {monthly?.user?.full_name}
              </label>
              <label className={classNames(styles.winnerAge)}>
                {monthly?.user?.age} years
              </label>
            </div>
            <ReaderOfMonthBadge className={classNames(styles.badgeStyle)} />
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3 w-100"
            )}
          >
            <div
              className={classNames(
                styles.statContainer,
                "d-flex flex-column align-items-start justify-content-center px-3"
              )}
            >
              <label className={classNames(styles.statCount)}>
                {monthly?.badges_count}
              </label>
              <label className={classNames(styles.statLabel)}>
                Total Badges
              </label>
            </div>
            <div
              className={classNames(
                styles.statContainer,
                "d-flex flex-column align-items-start justify-content-center px-3"
              )}
            >
              <label className={classNames(styles.statCount)}>
                {monthly?.books_read}
              </label>
              <label className={classNames(styles.statLabel)}>
                Books Completed
              </label>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            styles.h100,
            "d-flex align-items-center justify-content-center"
          )}
        >
          <label className={classNames(styles.title)}>
            Reader Of the <span>month</span>
          </label>
        </div>
      </div>
    </div>
  ) : (
    <div className={classNames("mt-5")}>
      <NoContentCard
        customContainer={"d-flex flex-column align-items-center gap-3"}
        Icon={NoReviewIcon}
        label1="No Student Found"
        label2="There is no data available in the “Leadership Board” Page"
      />
    </div>
  );
};

const ReaderOfWeek = ({ weekly }: any) => {
  return weekly ? (
    <div className={classNames("d-flex flex-column")}>
      {weekly?.map((itm: any, inx: number) => {
        return <LeaderShipCard key={inx} index={inx} noBg itm={itm} />;
      })}
    </div>
  ) : (
    <div className={classNames("mt-5")}>
      <NoContentCard
        customContainer={"d-flex flex-column align-items-center gap-3"}
        Icon={NoReviewIcon}
        label1="No Student Found"
        label2="There is no data available in the “Leadership Board” Page"
      />
    </div>
  );
};

export const getServerSideProps = withError(async ({ req, res, query }) => {
  if (query?.keyword === TabsEnums.readerOfWeek) {
    const response = await fetch(
      BaseURL + Endpoint.kid.leadershipBoard.getStats + `?category=2`,
      {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }
    );
    const resp = await response.json();
    return {
      props: {
        resp: resp,
        keyword: query?.keyword ? query?.keyword : Tabs[0],
      },
    };
  } else {
    const response = await fetch(
      BaseURL + Endpoint.kid.leadershipBoard.getStats + `?category=1`,
      {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }
    );
    const resp = await response.json();
    return {
      props: {
        resp: resp,
        keyword: query?.keyword ? query?.keyword : Tabs[0],
      },
    };
  }
});

export default LeaderShipBoard;
