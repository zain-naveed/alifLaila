import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import ModalHeader from "shared/components/modalHeader";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import Image from "next/image";
import { RemoveConfirmationIcon } from "assets";
interface Props {
  open: boolean;
  handleClose: () => void;
  Icon?: any;
  heading: string;
  handleSubmit?: () => void;
  actionButtonText?: string;
  loading?: boolean;
  ImageSrc?: any;
}

function ConfirmationModal(props: Props) {
  const {
    open,
    handleClose,
    handleSubmit,
    heading,
    Icon,
    actionButtonText,
    loading,
    ImageSrc,
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
          {ImageSrc ? (
            <Image src={ImageSrc} alt="" className={styles.icon} />
          ) : Icon ? (
            <Icon className={styles.icon} />
          ) : (
            <Image
              src={RemoveConfirmationIcon}
              alt=""
              className={styles.icon}
            />
          )}
          <Heading
            heading={heading ? heading : "Are you sure you want to delete?"}
            headingStyle={classNames(styles.deleteHeading)}
          />
          <div className={classNames(styles.buttonContainer, "gap-4")}>
            <CustomButton
              title="Not Now"
              containerStyle={styles.defaultButton}
              onClick={handleClose}
              disabled={loading}
            />
            <CustomButton
              title={actionButtonText ? actionButtonText : "Yes, Delete"}
              containerStyle={styles.actionButton}
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmationModal;
