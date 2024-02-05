import { OrderShipIcon } from "assets";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import ModalHeader from "shared/components/modalHeader";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {
  open: boolean;
  handleClose: () => void;
  Icon: any;
  heading: string;
  description: string;
  handleSubmit?: () => void;
  actionButtonText?: string;
  loading?: boolean;
}

function ConfirmOrderModal(props: Props) {
  const {
    open,
    handleClose,
    handleSubmit,
    heading,
    Icon,
    actionButtonText,
    loading,
    description,
  } = props;

  return (
    <Modal
      show={open}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      contentClassName={styles.contentClass}
      className="maxZindex"
    >
      <ModalHeader
        isFirst={true}
        close={handleClose}
        headerStyle={classNames(styles.header)}
      />
      <Modal.Body>
        <div className="text-center d-flex flex-column gap-3 align-items-center pb-3">
          {Icon ? (
            <Icon className={styles.icon} />
          ) : (
            <OrderShipIcon className={styles.icon} />
          )}
          <Heading
            heading={heading ? heading : "Are you sure order is shipped?"}
            headingStyle={classNames(styles.deleteHeading)}
          />
          <label className={classNames(styles.desc)}>{description}</label>
          <div className={classNames(styles.buttonContainer, "gap-4")}>
            <CustomButton
              title={actionButtonText ? actionButtonText : "Yes, Confirm"}
              containerStyle={styles.actionButton}
              onClick={handleSubmit}
              loading={loading}
            />
            <CustomButton
              title="Cancel"
              containerStyle={styles.defaultButton}
              onClick={handleClose}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmOrderModal;
