import { OrderSuccessIcon } from "assets";
import classNames from "classnames";
import { Modal } from "react-bootstrap";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";

interface PaymentVerificationModalProps {
  show: boolean;
  handleClose: () => void;
}

const PaymentVerificationModal = ({
  show,
  handleClose,
}: PaymentVerificationModalProps) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <div className={classNames("pt-2 pb-4 px-4")}>
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
            We will let you once verification is done
          </label>
          <label className={classNames(styles.subTitle)}>
            Request and screenshot has been sent to admin for verification once
            verified you can enjoy
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentVerificationModal;
