import {
  EyeIcon,
  OrderCancel,
  OrderCheck,
  OrderComplete,
  OrderShipIcon,
  OrderShipping,
} from "assets";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomTable from "shared/components/common/customTable";
import Status from "shared/components/common/status";
import { toastMessage } from "shared/components/common/toast";
import BoxLoader from "shared/loader/box";
import ConfirmOrderModal from "shared/modal/confirmOrder";
import RejectOrderModal from "shared/modal/rejectOrder";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { updateOrderStatus } from "shared/services/publisher/orderService";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

interface Props {
  orders: any[];
  loading: boolean;
}
function OrderTable(props: Props) {
  const { orders, loading } = props;

  return (
    <>
      <CustomTable
        title="Book Orders"
        heads={[
          "Customer Name",
          "Order ID",
          "Total Bill",
          "Status",
          "Order Date",
          "Action",
        ]}
        loading={loading}
        isEmpty={orders ? orders?.length < 1 : true}
      >
        <>
          {loading ? (
            <>
              {Array.from(Array(5).keys())?.map((item: any, inx: number) => {
                return (
                  <tr className={classNames(styles.tdItem)} key={inx}>
                    <td
                      className={classNames(
                        styles.paddingLeft,
                        styles.td,
                        styles.tdItem
                      )}
                    >
                      <BoxLoader iconStyle={classNames(styles.tdItemLoader)} />
                    </td>
                    <td className={classNames(styles.td, styles.tdItem)}>
                      <BoxLoader iconStyle={classNames(styles.tdItemLoader)} />
                    </td>
                    <td className={classNames(styles.td, styles.tdItem)}>
                      <BoxLoader iconStyle={classNames(styles.tdItemLoader)} />
                    </td>
                    <td className={classNames(styles.td, styles.tdItem)}>
                      <BoxLoader
                        iconStyle={classNames(styles.statusContainer)}
                      />
                    </td>
                    <td className={classNames(styles.td, styles.tdItem)}>
                      <BoxLoader iconStyle={classNames(styles.tdItemLoader)} />
                    </td>
                    <td
                      className={classNames(styles.actionItem, styles.tdItem)}
                    >
                      <div className={classNames("d-flex gap-2")}>
                        <BoxLoader iconStyle={classNames(styles.IconSyle)} />
                        <BoxLoader iconStyle={classNames(styles.IconSyle)} />
                        <BoxLoader iconStyle={classNames(styles.IconSyle)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <>
              {orders?.map((item: any, inx: number) => {
                return <RowItem Item={item} key={inx} />;
              })}
            </>
          )}
        </>
      </CustomTable>
    </>
  );
}

const RowItem = ({ Item }: any) => {
  const router = useRouter();
  const [item, setItem] = useState<any>(Item);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isShiped, setIsShiped] = useState<boolean>(false);

  const handleUpdateStatus = (status: any) => {
    let temp = { ...Item };
    temp["status"] = status;
    setItem(temp);
    handleClose();
    updateOrderStatus({ order_id: item?.id, status: status })
      .then(({ data: { data, message, status } }) => {
        if (status) {
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleShowRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  };

  const navigateOrderDetail = (id: any) => {
    router.push(partnersPanelConstant.orderDetail.path.replace(":id", id));
  };

  useEffect(() => {
    setItem(Item);
  }, [item?.id]);

  return (
    <>
      <tr className={classNames(styles.tdItem)}>
        <td
          className={classNames(styles.paddingLeft, styles.td, styles.tdItem)}
        >
          {item?.user?.full_name}
        </td>
        <td className={classNames(styles.td, styles.tdItem)}>
          {item?.order_id}
        </td>
        <td className={classNames(styles.td, styles.tdItem)}>
          Rs. {item?.total_amount}
        </td>
        <td className={classNames(styles.td, styles.tdItem)}>
          <Status status={item?.status} />
        </td>
        <td className={classNames(styles.td, styles.tdItem)}>
          {moment(item?.created_at).format("d-mm-yyyy")}
        </td>
        <td className={classNames(styles.actionItem, styles.tdItem)}>
          <div className={classNames("d-flex gap-2")}>
            <div
              className={classNames(styles.IconSyle)}
              role="button"
              onClick={() => navigateOrderDetail(item?.id)}
            >
              <EyeIcon />
            </div>
            {item?.status === 0 ? (
              <>
                <div
                  className={classNames(styles.IconSyle)}
                  role="button"
                  onClick={() => {
                    handleUpdateStatus(1);
                  }}
                >
                  <OrderCheck />
                </div>
                <div
                  className={classNames(styles.IconSyle)}
                  role="button"
                  onClick={handleShowRejectModal}
                >
                  <OrderCancel />
                </div>
              </>
            ) : item?.status === 1 ? (
              <div
                className={classNames(styles.IconSyle)}
                role="button"
                onClick={() => {
                  setIsShiped(true);
                  setOpen(true);
                }}
              >
                <OrderShipping />
              </div>
            ) : item?.status === 2 ? (
              <div
                className={classNames(styles.IconSyle)}
                role="button"
                onClick={() => {
                  setIsShiped(false);
                  setOpen(true);
                }}
              >
                <OrderComplete />
              </div>
            ) : null}
          </div>
        </td>
      </tr>
      <RejectOrderModal
        showModal={showRejectModal}
        handleClose={handleCloseRejectModal}
        order={item}
        setOrder={setItem}
      />

      <ConfirmOrderModal
        Icon={OrderShipIcon}
        heading={
          isShiped
            ? "Are you sure order is shipped?"
            : "Are you sure order is completed?"
        }
        open={open}
        handleClose={handleClose}
        description={
          isShiped
            ? `Please confirm that ${item?.user?.full_name}’s order shipment is completed`
            : `Please confirm that ${item?.user?.full_name}’s order is completed`
        }
        handleSubmit={() => {
          handleUpdateStatus(isShiped ? 2 : 4);
        }}
      />
    </>
  );
};

export default OrderTable;
