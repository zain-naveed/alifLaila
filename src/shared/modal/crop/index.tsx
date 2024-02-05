import { Modal } from "react-bootstrap";
import CropperCard from "shared/components/common/cropper";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";

interface Props {
  show: boolean;
  coverPic: any;
  handleClose: () => void;
  aspectRatio: any;
  isVerticalOrientation?: boolean;
  handleAction: (val: any) => void;
  label?: string;
}

function CropModal({
  show,
  handleClose,
  coverPic,
  aspectRatio,
  isVerticalOrientation,
  handleAction,
  label,
}: Props) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <CropperCard
        coverPic={coverPic}
        aspectRatio={aspectRatio}
        isVerticalOrientation={isVerticalOrientation}
        handleAction={handleAction}
        label={label}
        handleClose={handleClose}
        isFirst={true}
      />
    </Modal>
  );
}

export default CropModal;
