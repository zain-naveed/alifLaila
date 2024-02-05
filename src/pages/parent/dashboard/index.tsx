import {
  AssignBookIcon,
  AssignCoinIcon,
  CatalogueIcon,
  QuestionMarkIcon,
  RemoveConfirmationIcon,
  TotalKidsIcon,
  TrackProgressIcon,
  UserBlockIcon,
  UserCheckIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import EarningCard from "shared/components/earningCard";
import AddKidModal from "shared/modal/addKid";
import AssignCoinsModal from "shared/modal/assignCoins";
import ConfirmationModal from "shared/modal/confimation";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import {
  activateKid,
  deActivateKid,
} from "shared/services/parent/dashboardService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import { TabsEnums } from "shared/utils/pageConstant/parent/kidProfileConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";

function Dashboard({
  kidsList,
  stats,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    login: { currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const [list, setList] = useState<any[]>(kidsList?.data ? kidsList?.data : []);
  const [totalKids, setTotalKids] = useState<number>(stats?.data?.kids?.total);
  const [showAddKidModal, setShowAddKidModal] = useState<boolean>(false);
  const [newKid, setNewKid] = useState<any>(null);

  const handleShowModal = () => {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowAddKidModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowAddKidModal(false);
  };

  const handleAddAction = (obj: any) => {
    let tempArr = [...list];
    tempArr.unshift(obj);
    setTotalKids(tempArr.length);
    setList(tempArr);
    setNewKid(obj);
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Dashboard",
            action: () => {
              router.push(parentPanelConstant.dashboard.path);
            },
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper navigationItems={parentPathConstants}>
      <div className="row mb-4">
        <div className={classNames("col-lg-4 col-md-6 mt-2")}>
          <EarningCard
            Icon={TotalKidsIcon}
            heading="Total Kids"
            price={totalKids}
            remaining={Number(4 - totalKids)}
          />
        </div>
        <div className={classNames("col-lg-4 col-md-6 mt-2")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Coin Consumed by Kids"
            price={stats?.data?.coins?.consumed_by_kids}
          />
        </div>
        <div className={classNames("col-lg-4 col-md-6 mt-2")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Coin Consumed by You"
            price={stats?.data?.coins?.consumed_by_parent}
            remaining={stats?.data?.coins?.remaining}
          />
        </div>
      </div>
      <div className={classNames(styles.tableMain, "mb-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-sm-center justify-content-between flex-column flex-sm-row px-4 py-4",
            styles.bookWrapper
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading heading="My Kids" headingStyle={styles.bookMainHeading} />
            <Title
              title="Manage your kids activities here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          {Number(4 - totalKids) > 0 ? (
            <CustomButton
              title="Add New"
              containerStyle={classNames(styles.buttonMain)}
              onClick={handleShowModal}
            />
          ) : null}
        </div>
        <CustomTable
          title="My Kids"
          heads={[
            "Kids Name",
            "Daily Coins Limit",
            "Current Level",
            "Books Read",
            "Pending Tasks",
            "Action",
          ]}
          isEmpty={list ? list?.length === 0 : true}
          loading={false}
        >
          {list ? (
            <>
              {list?.map((item, inx) => {
                return <TableRow kid={item} key={item?.id} newKid={newKid} />;
              })}
            </>
          ) : null}
        </CustomTable>
      </div>
      <AddKidModal
        showModal={showAddKidModal}
        handleClose={handleCloseModal}
        handleAction={handleAddAction}
      />
    </DashboardWraper>
  );
}

const TableRow = ({ kid, newKid }: any) => {
  const {
    login: { currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const router = useRouter();
  const [item, setItem] = useState<any>(kid);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModals, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    if (newKid?.id === kid?.id) {
      setShowModal(true);
      setItem(kid);
    }
  }, [newKid]);

  const handleShowModal = () => {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowConfirmation = () => {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowConfirmation(true);
    }
  };
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleActivation = () => {
    setLoading(true);
    activateKid(item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setItem(data);
          toastMessage("success", message);
          handleCloseConfirmation();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeactivation = () => {
    setLoading(true);
    deActivateKid(item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setItem(data);
          toastMessage("success", message);
          handleCloseConfirmation();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "20%" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
            role="button"
          >
            <img
              alt="kid-pic"
              src={
                item?.reader?.profile_picture
                  ? item?.reader?.profile_picture
                  : defaultAvatar.src
              }
              className={classNames(styles.kidAvt)}
              height={32}
              width={32}
            />
            {item?.reader?.full_name}
          </div>
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "15%" }}
        >
          {item?.coins_limit}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "15%" }}
        >
          {item?.current_level}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "15%" }}
        >
          {item?.completed_books}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "15%" }}
        >
          {item?.pending_assigned_books}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle", width: "20%" }}
        >
          <div className={classNames("d-flex gap-2")}>
            <CustomToolTip label="Track Progress">
              <div
                className={classNames(styles.actionContainer)}
                onClick={() => {
                  dispatch(
                    setBreadCrumb({
                      crumbs: [
                        {
                          title: "Dashboard",
                          action: () => {
                            router.push(parentPanelConstant.checkout.path);
                          },
                        },
                        {
                          title: item?.reader?.full_name,
                        },
                      ],
                    })
                  );
                  router.push(
                    parentPanelConstant.kidProfile.path.replace(":id", item?.id)
                  );
                }}
              >
                <TrackProgressIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>
            <CustomToolTip label="Assign Books">
              <div
                className={classNames(styles.actionContainer)}
                onClick={() => {
                  dispatch(
                    setBreadCrumb({
                      crumbs: [
                        {
                          title: "Dashboard",
                          action: () => {
                            router.push(parentPanelConstant.checkout.path);
                          },
                        },
                        {
                          title: item?.reader?.full_name,
                        },
                      ],
                    })
                  );
                  router.push({
                    pathname: parentPanelConstant.kidProfile.path.replace(
                      ":id",
                      String(item?.id)
                    ),
                    query: { keyword: TabsEnums.assign },
                  });
                }}
              >
                <AssignBookIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>
            <CustomToolTip label="Assign Coins">
              <div
                className={classNames(styles.actionContainer)}
                onClick={handleShowModal}
              >
                <AssignCoinIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>
            {item?.is_blocked ? (
              <CustomToolTip label="Activate account">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowConfirmation}
                >
                  <UserCheckIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            ) : (
              <CustomToolTip label="Deactivate account">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowConfirmation}
                >
                  <UserBlockIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            )}
          </div>
        </td>
      </tr>
      <ConfirmationModal
        heading={
          item?.is_blocked
            ? "Are you sure you want to Activate Account?"
            : "Are you sure you want to deactivate Kid?"
        }
        ImageSrc={item?.is_blocked ? QuestionMarkIcon : RemoveConfirmationIcon}
        open={showConfirmation}
        handleClose={handleCloseConfirmation}
        actionButtonText={item?.is_blocked ? "Yes Activate" : "Yes Deactivate"}
        loading={loading}
        handleSubmit={item?.is_blocked ? handleActivation : handleDeactivation}
      />
      <AssignCoinsModal
        show={showModals}
        handleClose={handleCloseModal}
        kids={[item]}
        kid={item}
        setKid={setItem}
      />
    </>
  );
};

export default Dashboard;

export const getServerSideProps = withError(async ({ req, res }) => {
  const [kidsListRes, statsRes] = await Promise.all([
    fetch(BaseURL + Endpoint.parent.dashboard.getKids, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + Endpoint.parent.dashboard.getStats, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
  ]);
  const [kidsList, stats] = await Promise.all([
    kidsListRes.json(),
    statsRes.json(),
  ]);
  return { props: { kidsList, stats } };
});
