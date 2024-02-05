import { CrossIcon, ReportIcon } from "assets";
import classNames from "classnames";
import { Modal } from "react-bootstrap";
import styles from "./style.module.scss";

interface ReportModalProps {
  showModal: boolean;
  handleClose: () => void;
  reason: string;
}

const RejectionReasonModal = ({
  showModal,
  handleClose,
  reason,
}: Partial<ReportModalProps>) => {
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      backdrop="static"
      dialogClassName={styles.reportDialog}
    >
      <Modal.Body className={classNames("px-4 py-4 d-flex flex-column gap-4")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-3 position-relative"
          )}
        >
          <ReportIcon className={classNames(styles.reportIcon)} />
          <label className={styles.labelText}>Rejection Reason</label>
          <div
            className={classNames(styles.crossContainer)}
            onClick={handleClose}
          >
            <CrossIcon />
          </div>
        </div>
        <div className={classNames(styles.reasonContainer, "p-3")}>
          {reason}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RejectionReasonModal;
