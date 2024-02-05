import { DeleteIcon, EyeIcon, SearchIcon } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import NoContentCard from "shared/components/common/noContentCard";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import useDebounce from "shared/customHook/useDebounce";
import BoxLoader from "shared/loader/box";
import RejectOrderModal from "shared/modal/rejectOrder";
import ViewOrderModal from "shared/modal/viewOrder";
import { getOrderList } from "shared/services/kid/cartService";
import styles from "./style.module.scss";
import CustomTable from "shared/components/common/customTable";
import PublishingHouse from "shared/components/common/publishingHouse";

const MyOrders = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [orders, setOrders] = useState<any>([]);
  const [total, setTotal] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");

  const handleGetWalletHistory = () => {
    setTableLoading(true);
    getOrderList(currentPage, searchVal)
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
            setOrders(data);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setTableLoading(false);
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
    handleGetWalletHistory();
    // eslint-disable-next-line
  }, [currentPage, searchVal]);

  return (
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
          <label className={classNames(styles.tableTitle)}>Order History</label>
          <label className={classNames(styles.tableSubtitle)}>
            See all your orders Here
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
              placeholder="Search Order ID"
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
        title="Order History"
        heads={[
          "Order ID",
          "Publisher",
          "Order Status",
          "Order Date",
          "Total Bill",
          "Actions",
        ]}
        isEmpty={orders ? orders?.length === 0 : true}
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
            {orders?.map((itm: any, inx: number) => {
              return <TableRow Item={itm} key={itm?.id} />;
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
  );
};

const TableRow = ({ Item }: any) => {
  const [viewOrder, setViewOrder] = useState<boolean>(false);
  const [item, setItem] = useState<any>(Item);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);

  const handleShowViewOrderModal = () => {
    setViewOrder(true);
  };
  const handleCloseViewOrderModal = () => {
    setViewOrder(false);
  };

  const handleShowRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  };

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ width: "16%", verticalAlign: "middle" }}
        >
          {item?.order_id}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "20%", color: "#9a469b" }}
        >
          <PublishingHouse item={item} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16%" }}
        >
          <Status status={item?.status} isUser />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16%" }}
        >
          {moment(item?.created_at).format("D MMM , YYYY")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16%" }}
        >
          Rs {item?.total_amount}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ width: "16%", verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3"
            )}
          >
            <div
              className={classNames(styles.actionContainer)}
              onClick={handleShowViewOrderModal}
            >
              <EyeIcon className={classNames(styles.actionIcon)} />
            </div>
            {item?.status === 0 ? (
              <div
                className={classNames(styles.actionContainer)}
                onClick={handleShowRejectModal}
              >
                <DeleteIcon className={classNames(styles.actionIcon)} />
              </div>
            ) : null}
          </div>
        </td>
      </tr>
      <ViewOrderModal
        item={item}
        show={viewOrder}
        handleClose={handleCloseViewOrderModal}
      />

      <RejectOrderModal
        showModal={showRejectModal}
        handleClose={handleCloseRejectModal}
        order={item}
        setOrder={setItem}
        isUser
      />
    </>
  );
};

const TableRowLoader = () => {
  return (
    <tr>
      <td
        className={classNames(styles.td, "ps-4 pe-2 py-3")}
        style={{ width: "16%", verticalAlign: "middle" }}
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
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "16%" }}
      >
        <BoxLoader iconStyle={classNames(styles.statusContainer)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "16%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "16%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ width: "16%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-3"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
        </div>
      </td>
    </tr>
  );
};

export default MyOrders;
