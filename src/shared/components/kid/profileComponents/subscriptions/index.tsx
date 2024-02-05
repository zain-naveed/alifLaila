import {
  CoinAsset1,
  CoinAsset2,
  EyeIcon,
  FilterLines,
  InfoIcon,
  SearchIcon,
} from "assets";
import classNames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import { plansStatus } from "shared/components/common/status/constant";
import useDebounce from "shared/customHook/useDebounce";
import OptionsDropDown from "shared/dropDowns/options";
import BoxLoader from "shared/loader/box";
import BuyCoinsModal from "shared/modal/buyCoins";
import ViewPlanPurchaseHistoryModal from "shared/modal/viewPlanPurchaseHistory";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import PurchaseHistory from "shared/components/common/subscription/purchaseHistory";
import TransactionHistory from "shared/components/common/subscription/transactionHistory";
import {
  getCurrentPlan,
  getPlansHistory,
} from "shared/services/kid/plansService";
import { getNumberOfDays } from "shared/utils/helper";
import styles from "./style.module.scss";
import CustomTab from "shared/components/common/customTabs";

import { SubscriptionTabs } from "shared/utils/pageConstant/kid/profileConstant";

const Subscriptions = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { login } = useSelector((state: any) => state.root);
  const [wallet, setWallet] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [showBuyCoinsModal, setShowBuyCoinsModal] = useState<boolean>(false);

  function handleGetOrdersHistory(status?: any) {
    setTableLoading(true);
    getPlansHistory({
      page: currentPage,
      search: searchVal,
      status: status ? status : "",
    })
      .then(
        ({
          data: {
            data: { data, total },
            message,
            status,
          },
        }) => {
          if (status) {
            setTotalPage(total);
            setHistory(data);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setTableLoading(false);
      });
  }

  const handleShowBuyCoinsModal = () => {
    setShowBuyCoinsModal(true);
  };

  const handleCloseBuyCoinsModal = () => {
    setShowBuyCoinsModal(false);
  };

  const handleGetWallet = () => {
    setLoading(true);
    getCurrentPlan()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setCurrentPlan(data);
          setWallet(data?.current_wallet);
          compareDate(data?.current_wallet?.data?.expiry_date);
          dispatch(
            setLoginUser({
              ...login,
              currentPlan: data,
              remainingCoins: data?.current_wallet?.remaining_coins,
            })
          );
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const compareDate = (val: string) => {
    let date1 = new Date();
    let date2 = new Date(val);
    if (date1 > date2) {
      setIsExpired(true);
    } else if (date1 < date2) {
      setIsExpired(false);
    } else {
      setIsExpired(false);
    }
  };

  const [activeTab, setActiveTab] = useState<string | any>(SubscriptionTabs[0]);

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    handleGetWallet();
  }, []);

  useEffect(() => {
    handleGetOrdersHistory();
  }, [searchVal, currentPage]);

  const handleActiveTab = (val: string) => {
    setActiveTab(val);
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column flex-md-row align-items-center justify-content-between gap-4 gap-sm-3 mt-4"
        )}
      >
        {loading ? (
          <>
            <BoxLoader iconStyle={classNames(styles.coinsContainer)} />
            <BoxLoader iconStyle={classNames(styles.coinsContainer)} />
          </>
        ) : (
          <>
            <div
              className={classNames(
                styles.coinsContainer,
                "p-3 d-flex flex-column align-items-start justify-content-center gap-3"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start gap-3"
                )}
              >
                <CoinAsset1 className={classNames(styles.coinAsset)} />
                <label className={classNames(styles.coinTitle)}>
                  Total Coins Purchased
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-end justify-content-between w-100"
                )}
              >
                <label className={classNames(styles.coinCount)}>
                  {wallet?.total_coins ? wallet?.total_coins : 0}
                </label>
                {wallet?.expiry_date ? (
                  <div
                    className={classNames("d-flex align-items-center gap-2")}
                  >
                    <InfoIcon className={classNames(styles.infoIcon)} />
                    <label className={classNames(styles.expireTitle)}>
                      {getNumberOfDays(wallet?.expiry_date)} Days Left -
                    </label>
                    <label className={classNames(styles.tableSubtitle)}>
                      {currentPlan?.plan?.name}
                    </label>
                  </div>
                ) : null}
              </div>
            </div>
            <div
              className={classNames(
                styles.coinsContainer,
                "p-3 d-flex flex-column align-items-start justify-content-center gap-3"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start gap-3"
                )}
              >
                <CoinAsset2 className={classNames(styles.coinAsset)} />
                <label className={classNames(styles.coinTitle)}>
                  Total Coins Left
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-end justify-content-between w-100"
                )}
              >
                <label className={classNames(styles.coinCount)}>
                  {wallet?.remaining_coins ? wallet?.remaining_coins : 0}
                </label>
                {wallet?.expiry_date && !isExpired ? (
                  <div
                    className={classNames("d-flex align-items-center gap-2")}
                  >
                    <CustomButton
                      title="Buy Coins"
                      containerStyle={classNames(styles.btn, styles.buyBtn)}
                      onClick={handleShowBuyCoinsModal}
                    />
                    <CustomButton
                      title="Upgrade Plans"
                      containerStyle={classNames(styles.btn, styles.upgradeBtn)}
                      onClick={() => {
                        router.push(kidPanelConstant.plans.path);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={classNames("px-3 px-sm-0 pt-5 w-100")}>
        <CustomTab
          tabs={SubscriptionTabs}
          activeTab={activeTab}
          handleActiveTab={handleActiveTab}
        />
      </div>
      {activeTab === SubscriptionTabs[0] ? (
        <PurchaseHistory />
      ) : (
        <TransactionHistory />
      )}

      <BuyCoinsModal
        show={showBuyCoinsModal}
        handleClose={handleCloseBuyCoinsModal}
        handleGetWallet={handleGetWallet}
      />
    </>
  );
};

const TableRow = ({ item }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <tr>
        <td className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}>
          {item?.transaction_id ? item?.transaction_id : "----"}
        </td>

        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          Rs {Math.trunc(item?.price)}
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          {Math.trunc(item?.coins)}
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          {moment(item?.start_date).format("DD MMM, YYYY")}
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          {item?.duration === 1
            ? "Monthly"
            : item?.duration === 12
            ? "Annual"
            : `${item?.duration} Months`}
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <Status type="PlansHistory" status={item?.status} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          <CustomToolTip label="View Details">
            <div
              className={classNames(styles.actionContainer)}
              onClick={handleShowModal}
            >
              <EyeIcon className={classNames(styles.searchIcon)} />
            </div>
          </CustomToolTip>
        </td>
      </tr>
      {/* <ViewPlanPurchaseHistoryModal
        show={showModal}
        handleClose={handleCloseModal}
        itm={item}
      /> */}
    </>
  );
};

export default Subscriptions;
