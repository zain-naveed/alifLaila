import { ReportIcon } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import { rejectOrder } from "shared/services/publisher/orderService";
import styles from "./style.module.scss";
import { cancelOrder } from "shared/services/kid/cartService";

interface ReportModalProps {
  showModal: boolean;
  handleClose: () => void;
  order: any;
  setOrder: (val: any) => void;
  isUser: boolean;
}

const RejectOrderModal = ({
  showModal,
  handleClose,
  order,
  setOrder,
  isUser,
}: Partial<ReportModalProps>) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const onClose = () => {
    setText("");
    if (handleClose) {
      handleClose();
    }
  };

  const handleRejectOrder = () => {
    let formData = new FormData();
    formData.append("order_id", order?.id);
    formData.append("reason", text);

    if (text) {
      setLoading(true);
      rejectOrder(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            let temp = { ...order };
            temp["status"] = 5;
            setOrder?.(temp);
            onClose();
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      toastMessage("error", "Please write something");
    }
  };

  const handleCancelOrder = () => {
    let formData = new FormData();
    formData.append("order_id", order?.id);
    formData.append("reason", text);

    if (text) {
      setLoading(true);
      cancelOrder(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            let temp = { ...order };
            temp["status"] = 5;
            setOrder?.(temp);
            onClose();
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      toastMessage("error", "Please write something");
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName={styles.reportDialog}
    >
      <Modal.Body className={classNames("px-4 py-4 d-flex flex-column gap-4")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-3 "
          )}
        >
          <ReportIcon className={classNames(styles.reportIcon)} />
          <label className={styles.labelText}>
            {isUser ? "Cancel This Order" : "Reject This Order"}
          </label>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-center gap-2"
          )}
        >
          <label className={classNames(styles.optionLabel)}>
            Write Reason <span>*</span>
          </label>
          <textarea
            style={{ resize: "none" }}
            className={styles.textAreaComp}
            value={text}
            onChange={(e: any) => setText(e.target.value)}
            placeholder="Write your reason here..."
          />
        </div>
        <div className={classNames("d-flex gap-3")}>
          <CustomButton
            title={isUser ? "Not Now" : "Cancel"}
            containerStyle={styles.cancelButton}
            onClick={onClose}
          />
          <CustomButton
            title={isUser ? "Cancel" : "Reject"}
            containerStyle={styles.reportButton}
            onClick={isUser ? handleCancelOrder : handleRejectOrder}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RejectOrderModal;
