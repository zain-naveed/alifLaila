import classNames from "classnames";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import { Modal } from "react-bootstrap";
import { OrderSuccessIcon } from "assets";
import CustomButton from "shared/components/common/customButton";
import { useRouter } from "next/router";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";
import { TabsEnums } from "shared/utils/pageConstant/parent/settingsConstants";

interface OrderSuccessModalProps {
  show: boolean;
  handleClose: () => void;
}

const OrderSuccessModal = ({ show, handleClose }: OrderSuccessModalProps) => {
  const router = useRouter();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <div className={classNames("pt-2 pt-xxl-3 pb-4 pb-xxl-5")}>
        <ModalHeader
          close={handleClose}
          headerStyle={styles.header}
          isFirst={true}
        />
        <div
          className={classNames(
            "d-flex align-items-center flex-column justify-content-center gap-2"
          )}
        >
          <OrderSuccessIcon className={classNames(styles.iconStyle)} />
          <label className={classNames(styles.title)}>
            Your order has been placed
          </label>
          <label className={classNames(styles.subTitle)}>
            Your Order has been successfully received and you’ll get your order
            soon{" "}
          </label>
          <CustomButton
            title="View Order Detail"
            containerStyle={classNames(styles.viewBtn, "mt-2")}
            onClick={() => {
              if (role === roles.parent) {
                router.push({
                  pathname: parentPanelConstant?.setting.path,
                  query: { keyword: TabsEnums.myOrders },
                });
              } else if (role === roles.reader) {
                router.push({
                  pathname: kidPanelConstant?.profile.path,
                  query: { keyword: "My Orders" },
                });
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default OrderSuccessModal;
