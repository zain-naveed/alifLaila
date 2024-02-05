import { DeleteIcon, EyeIcon, SearchIcon } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import Title from "shared/components/common/title";
import useDebounce from "shared/customHook/useDebounce";
import BoxLoader from "shared/loader/box";
import RejectOrderModal from "shared/modal/rejectOrder";
import ViewOrderModal from "shared/modal/viewOrder";
import { getOrderList } from "shared/services/kid/cartService";
import styles from "./style.module.scss";
import PublishingHouse from "shared/components/common/publishingHouse";

interface OrdersProps {
  orderListData: any;
}

const Orders = ({ orderListData }: OrdersProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(orderListData?.total);
  const [orders, setOrders] = useState<any>(orderListData?.data);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const handleGetOrdersHistory = () => {
    setLoading(true);
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
            setTotalPage(total);
            setOrders(data);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setInitial(false);
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
      handleGetOrdersHistory();
    }
  }, [searchVal, currentPage]);

  return (
    <div className={classNames(styles.tableMain, "mb-4")}>
      <div
        className={classNames(
          "d-flex align-items-start gap-3 align-items-sm-center justify-content-between flex-column flex-sm-row px-4 py-4"
        )}
      >
        <div className={classNames("d-flex flex-column align-items-start")}>
          <Heading
            heading="Order History"
            headingStyle={styles.bookMainHeading}
          />
          <Title
            title="See all your orders Here"
            titleStyle={styles.bookMainTitle}
          />
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
                setInitial(false);
                setSearch(e.target.value);
              }}
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
        loading={loading}
      >
        {loading ? (
          <>
            {Array.from(Array(7).keys()).map((itm, inx) => {
              return <TableRowLoader key={inx} />;
            })}
          </>
        ) : (
          <>
            {orders?.map((itm: any, inx: number) => {
              return <TableRow Item={itm} key={inx} />;
            })}
          </>
        )}
      </CustomTable>
      {orders && orders?.length > 0 ? (
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
          style={{ maxWidth: "16%", verticalAlign: "middle" }}
        >
          {item?.order_id}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%", color: "#9a469b" }}
        >
          <PublishingHouse item={item} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          <Status status={item?.status} isUser />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          {moment(item?.created_at).format("D MMM , YYYY")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          Rs {item?.total_amount}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ maxWidth: "16%", verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3"
            )}
          >
            <CustomToolTip label="View Details">
              <div
                className={classNames(styles.actionContainer)}
                onClick={handleShowViewOrderModal}
              >
                <EyeIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>

            {item?.status === 0 ? (
              <CustomToolTip label="Cancel Order">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowRejectModal}
                >
                  <DeleteIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
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
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ maxWidth: "16%", verticalAlign: "middle" }}
        >
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          <BoxLoader iconStyle={classNames(styles.statusContainerLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "16%" }}
        >
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ maxWidth: "16%", verticalAlign: "middle" }}
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
    </>
  );
};
export default Orders;
