import {
  CoinAsset1,
  CoinAsset2,
  DefaultBookImg,
  InfoIcon,
  SearchIcon,
} from "assets";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import Pagination from "shared/components/common/pagination";
import useDebounce from "shared/customHook/useDebounce";
import BoxLoader from "shared/loader/box";
import BuyCoinsModal from "shared/modal/buyCoins";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { getCurrentPlan } from "shared/services/kid/plansService";
import { getWallet, getWalletHistory } from "shared/services/kid/walletService";
import { getNumberOfDays } from "shared/utils/helper";
import styles from "./style.module.scss";
import { kidAccountRole } from "shared/utils/enum";

interface MyWallet {
  kid_role: number;
}

const MyWallet = ({ kid_role }: MyWallet) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { login } = useSelector((state: any) => state.root);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [history, setHistory] = useState<any>([]);
  const [wallet, setWallet] = useState<any>(null);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<any>(null);
  const [total, setTotal] = useState<number>(100);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [showBuyCoinsModal, setShowBuyCoinsModal] = useState<boolean>(false);

  const handleShowBuyCoinsModal = () => {
    setShowBuyCoinsModal(true);
  };

  const handleCloseBuyCoinsModal = () => {
    setShowBuyCoinsModal(false);
  };

  const handleGetWallet = () => {
    getWallet()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setCurrentWallet(data);
          dispatch(setLoginUser({ remainingCoins: data?.remaining_coins }));
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetCurrentPlan = () => {
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

  const handleGetWalletHistory = () => {
    setTableLoading(true);
    getWalletHistory(currentPage, searchVal)
      .then(
        ({
          data: {
            data: { data, total },
            message,
            status,
          },
        }) => {
          if (status) {
            setTotal(total);
            setHistory(data);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setTableLoading(false);
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

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    if (kid_role === kidAccountRole.family) {
      handleGetWallet();
    } else {
      handleGetCurrentPlan();
    }
  }, []);

  useEffect(() => {
    handleGetWalletHistory();
    // eslint-disable-next-line
  }, [currentPage, searchVal]);

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
                  {kid_role === kidAccountRole.family
                    ? "Daily Coins Limit"
                    : "Total Coins Purchased"}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-end justify-content-between w-100"
                )}
              >
                <label className={classNames(styles.coinCount)}>
                  {kid_role === kidAccountRole.family
                    ? currentWallet?.total_coins
                      ? currentWallet?.total_coins
                      : 0
                    : wallet?.total_coins
                    ? wallet?.total_coins
                    : 0}
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
                  {kid_role === kidAccountRole.family
                    ? "Remaining Coins"
                    : "Total Coins Left"}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-end justify-content-between w-100"
                )}
              >
                <label className={classNames(styles.coinCount)}>
                  {kid_role === kidAccountRole.family
                    ? currentWallet?.remaining_coins
                      ? currentWallet?.remaining_coins
                      : 0
                    : wallet?.remaining_coins
                    ? wallet?.remaining_coins
                    : 0}
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
      <div className={classNames(styles.tableContainer, "mt-4")}>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row align-items-start justify-content-between p-4 gap-3 gap-sm-0"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-start justify-content-between flex-column"
            )}
          >
            <label className={classNames(styles.tableTitle)}>
              Book History
            </label>
            <label className={classNames(styles.tableSubtitle)}>
              See your coins spent history
            </label>
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between gap-3"
            )}
          >
            <div className={classNames(styles.searchContainer, "px-3")}>
              <SearchIcon className={classNames(styles.searchIcon)} />
              <input
                className={classNames(styles.searchInput, "ms-1")}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                disabled={tableLoading}
              />
            </div>
          </div>
        </div>
        <CustomTable
          title="Book History"
          heads={["Book Name", "Purchase ID", "Coins", "Date", " Book Status"]}
          isEmpty={history ? history?.length === 0 : true}
          loading={tableLoading}
        >
          {tableLoading ? (
            <>
              {Array.from(Array(7).keys()).map((itm, inx) => {
                return <TableRowLoader key={inx} />;
              })}
            </>
          ) : (
            <>
              {history?.map((itm: any, inx: number) => {
                return <TableRow item={itm} key={inx} />;
              })}
            </>
          )}
        </CustomTable>

        <Pagination
          currentPage={currentPage}
          totalCount={total}
          pageSize={10}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
      <BuyCoinsModal
        show={showBuyCoinsModal}
        handleClose={handleCloseBuyCoinsModal}
        handleGetWallet={handleGetCurrentPlan}
      />
    </>
  );
};

const TableRow = ({ item }: any) => {
  const router = useRouter();
  return (
    <tr>
      <td
        className={classNames(styles.td, "ps-4 pe-2 py-3")}
        style={{ width: "30%", verticalAlign: "middle" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
          onClick={() => {
            router.push(
              kidPanelConstant.preview.path.replace(":id", item?.book?.id)
            );
          }}
        >
          <object
            data={
              item?.book?.thumbnail
                ? item?.book?.thumbnail
                : item?.book?.cover_photo
            }
            type="image/png"
            className={classNames(styles.bookStyle, "pointer")}
          >
            <Image
              alt="book-cover"
              src={DefaultBookImg}
              className={classNames(styles.bookStyle)}
              role="button"
              height={40}
              width={38}
            />
          </object>

          <label className={classNames(styles.bookTitle)} role="button">
            {item?.book?.title}
          </label>
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "15%" }}
      >
        {item?.purchase_id}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "15%" }}
      >
        {Math.trunc(item?.coins)}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        {moment(item?.purchase_date).format("D-M-YYYY h:mm a")}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ width: "15%" }}
      >
        {item?.type === 2 ? (
          <div className={classNames(styles.statusContainer)}>
            <label className={classNames(styles.statusLabel)}>
              Life time Buy
            </label>
          </div>
        ) : (
          <div
            className={classNames(styles.statusContainer, styles.pendingCont)}
          >
            <label
              className={classNames(styles.statusLabel, styles.pendingLabel)}
            >
              {getNumberOfDays(item?.expiry_date) < 1
                ? "Expired"
                : getNumberOfDays(item?.expiry_date) === 1
                ? "Expiring Today"
                : getNumberOfDays(item?.expiry_date) > 2
                ? `${getNumberOfDays(item?.expiry_date)} Days Left`
                : `1 Day Left`}
            </label>
          </div>
        )}
      </td>
    </tr>
  );
};

const TableRowLoader = () => {
  return (
    <tr>
      <td
        className={classNames(styles.td, "ps-4 pe-2 py-3")}
        style={{ width: "30%", verticalAlign: "middle" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.bookStyle)} />
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "15%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "15%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ width: "15%" }}
      >
        <BoxLoader iconStyle={classNames(styles.statusContainer)} />
      </td>
    </tr>
  );
};

export default MyWallet;
