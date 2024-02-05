import {
  ChevDownIcon,
  CoinAsset1,
  CoinAsset3,
  CoinsLeftWarning,
  DefaultBookImg,
  UserGroup2,
} from "assets";
import classNames from "classnames";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import EarningCard from "shared/components/earningCard";
import UsersDropDown from "shared/dropDowns/users";
import BoxLoader from "shared/loader/box";
import AssignCoinsModal from "shared/modal/assignCoins";
import { getWalletHistory } from "shared/services/kid/walletService";
import { getNumberOfDays } from "shared/utils/helper";
import styles from "./style.module.scss";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";
import { useRouter } from "next/router";
import { parentPanelConstant } from "shared/routes/routeConstant";

interface WalletProps {
  walletStatsData: any;
  walletHistoryData: any;
  kidsListData: any;
}

const Wallet = ({
  walletStatsData,
  walletHistoryData,
  kidsListData,
}: WalletProps) => {
  const {
    login: { user, currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(walletHistoryData?.total);
  const [history, setHistory] = useState<any>(walletHistoryData?.data);
  const [selectedKid, setSelectedKid] = useState<any>(null);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModals, setShowModal] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

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

  const handleGetWalletHistory = (id?: any) => {
    setLoading(true);
    if (id) {
      getWalletHistory(currentPage, "", id)
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
          setLoading(false);
        });
    } else {
      getWalletHistory(currentPage, "")
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
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!initial) {
      if (selectedKid) {
        handleGetWalletHistory(selectedKid?.id);
      } else {
        handleGetWalletHistory();
      }
    }
  }, [currentPage, selectedKid]);

  return (
    <div className={classNames("d-flex flex-column")}>
      <div className="d-flex gap-3 flex-wrap mb-4">
        <div className={classNames(styles.cont)}>
          <EarningCard
            Icon={CoinAsset1}
            heading="Total Coins Purchased"
            price={walletStatsData?.total_coins}
          />
        </div>
        <div className={classNames(styles.cont)}>
          <EarningCard
            Icon={CoinAsset3}
            heading="Spend By ME"
            price={
              walletStatsData?.summary?.total_used_by_parent
                ? walletStatsData?.summary?.total_used_by_parent
                : 0
            }
          />
        </div>
        <div className={classNames(styles.cont)}>
          <EarningCard
            Icon={UserGroup2}
            heading="Spend By Kids"
            price={
              walletStatsData?.summary?.total_used_by_kids
                ? walletStatsData?.summary?.total_used_by_kids
                : 0
            }
          />
        </div>
        <div className={classNames(styles.cont)}>
          <EarningCard
            Icon={CoinsLeftWarning}
            heading="Coins Left"
            price={walletStatsData?.remaining_coins}
          />
        </div>
      </div>
      <div className={classNames(styles.tableMain, "mb-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-md-center justify-content-between flex-column flex-md-row px-4 py-4",
            styles.bookWrapper
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2 position-relative"
              )}
              onClick={() => {
                setOpenSelection(!openSelection);
              }}
              role="button"
            >
              <Heading
                heading={
                  selectedKid === null
                    ? "Coins Spend By Me"
                    : `${
                        selectedKid?.reader?.full_name.split(" ")[0]
                      } Coins Spending History`
                }
                headingStyle={styles.bookMainHeading}
              />
              <div className={classNames(styles.actionContainer)}>
                <ChevDownIcon className={classNames(styles.actionIcon)} />
              </div>

              <UsersDropDown
                openSelection={openSelection}
                setOpenSelection={setOpenSelection}
                onClick={(val: any) => {
                  if (val?.id === user?.id) {
                    setSelectedKid(null);
                  } else {
                    setSelectedKid(val);
                  }
                  setInitial(false);
                }}
                kids={kidsListData?.data}
              />
            </div>

            <Title
              title="Manage your kids coins."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center gap-3"
            )}
          >
            <CustomButton
              title="Assign Coins"
              containerStyle={classNames(styles.buttonMain)}
              onClick={handleShowModal}
            />
          </div>
        </div>
        <CustomTable
          title="Wallet History"
          heads={["Book Name", "Coins Spend", "Status", "Date"]}
          isEmpty={history ? history?.length === 0 : true}
          loading={loading}
        >
          {loading ? (
            <>
              {Array.from(Array(5).keys()).map((itm, inx) => {
                return <TableRowLoader key={inx} />;
              })}
            </>
          ) : (
            <>
              {history?.map((itm: any, inx: number) => {
                return <TableRow key={inx} item={itm} />;
              })}
            </>
          )}
        </CustomTable>
        {history && history?.length > 0 ? (
          <Pagination
            className={styles.paginationBar}
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={10}
            onPageChange={(page: any) => {
              setInitial(false);
              setCurrentPage(page);
            }}
          />
        ) : null}
      </div>
      <AssignCoinsModal
        show={showModals}
        handleClose={handleCloseModal}
        kids={kidsListData?.data}
      />
    </div>
  );
};

const TableRow = ({ item }: any) => {
  const router = useRouter();
  return (
    <tr>
      <td
        className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
        style={{ verticalAlign: "middle", width: "40%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
          onClick={() => {
            router.push(
              parentPanelConstant.preview.path.replace(":id", item?.book?.id)
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
            className={classNames(styles.bookCover, "pointer")}
          >
            <Image
              alt="book-cover"
              src={DefaultBookImg}
              className={classNames(styles.bookCover)}
              role="button"
              height={40}
              width={38}
            />
          </object>

          <label className={classNames(styles.bookTitle, "pointer")}>
            {item?.book?.title}
          </label>
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        {Math.trunc(Number(item?.coins))}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
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
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        {moment(item?.purchase_date).format("D-M-YYYY")}
      </td>
    </tr>
  );
};

const TableRowLoader = () => {
  return (
    <tr>
      <td
        className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
        style={{ verticalAlign: "middle", width: "40%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.bookCover)} />
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        <BoxLoader iconStyle={classNames(styles.labelLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        <BoxLoader iconStyle={classNames(styles.statusContainer)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        <BoxLoader iconStyle={classNames(styles.labelLoader)} />
      </td>
    </tr>
  );
};

export default Wallet;
