import { OrderSuccessIcon, reviewCloseImage } from "assets";
import classNames from "classnames";
import { Modal } from "react-bootstrap";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import { useEffect } from "react";

interface PurchaseSuccessModalProps {
  show: boolean;
  handleClose: () => void;
  purchaseId: string;
}

const PurchaseSuccessModal = ({
  show,
  handleClose,
  purchaseId,
}: PurchaseSuccessModalProps) => {
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        handleClose();
      }, 3000);
    }
  }, [show]);
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      className="maxZindex"
    >
      <div className={classNames(styles.successContainer)}>
        <ModalHeader
          // close={handleClose}
          headerStyle={styles.header}
          isFirst={true}
          // image={reviewCloseImage}
          // closeImageStyle={styles.closeImage}
          isCrossNotRequired={true}
        />
        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-center"
          )}
        >
          <OrderSuccessIcon className={classNames(styles.successIcon)} />
          <label className={classNames(styles.successLabel)}>Successful</label>
        </div>
      </div>

      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center gap-1 mt-3 mb-4"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-center flex-column justify-content-center gap-2"
          )}
        >
          <label className={classNames(styles.title)}>
            Your purchase ID is {purchaseId}
          </label>
          <label className={classNames(styles.subTitle)}>
            The Book has been added to your Books list
          </label>
        </div>
        <label className={classNames(styles.enjoyLabel)}>Enjoy Reading!</label>
      </div>
    </Modal>
  );
};

export default PurchaseSuccessModal;
