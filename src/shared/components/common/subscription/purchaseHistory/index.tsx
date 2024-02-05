import styles from "./style.module.scss";
import { useState, useEffect } from "react";
import classNames from "classnames";
import CustomTable from "shared/components/common/customTable";
import BoxLoader from "shared/loader/box";
import moment from "moment";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import CustomToolTip from "shared/components/common/customToolTip";
import ViewPlanPurchaseHistoryModal from "shared/modal/viewPlanPurchaseHistory";
import { SearchIcon, EyeIcon} from "assets";
import useDebounce from "shared/customHook/useDebounce";

import {
  getCurrentPlan,
  getPlansHistory,
} from "shared/services/kid/plansService";

interface PurchaseHistoryProps {
  historyListData?: any;
}


const PurchaseHistory = ({historyListData}:PurchaseHistoryProps ) => {

  const [search, setSearch] = useState<string>("");
  const [history, setHistory] = useState<any>(historyListData?.data ? historyListData?.data :[]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [searchVal, setSearchVal] = useState<string>("");

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

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    handleGetOrdersHistory();
  }, [searchVal, currentPage]);

  return (
    <>
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
              Subscriptions
            </label>
            <label className={classNames(styles.tableSubtitle)}>
              Plans Subscription History
            </label>
          </div>
          <div
            className={classNames(
              "d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-end gap-3"
            )}
          >
            <div className={classNames(styles.searchContainer, "px-3")}>
              <SearchIcon className={classNames(styles.searchIcon)} />
              <input
                className={classNames(styles.searchInput, "ms-1")}
                placeholder="Search Purchase ID"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <CustomTable
          title="Plans Purchase History"
          heads={[
            "Purchase ID",
            "Amount",
            "Coins",
            "Purchase Date",
            "Duration",
            "Status",
            "Actions",
          ]}
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
          className={styles.paginationBar}
          currentPage={currentPage}
          totalCount={totalPage}
          pageSize={10}
          onPageChange={(page: any) => setCurrentPage(page)}
        />
      </div>
    </>
  );
}

const TableRowLoader = () => {
  return (
    <>
      <tr>
        <td className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>

        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.statusLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
        </td>
      </tr>
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
      <ViewPlanPurchaseHistoryModal
        show={showModal}
        handleClose={handleCloseModal}
        itm={item}
      />
    </>
  );
};

export default PurchaseHistory;