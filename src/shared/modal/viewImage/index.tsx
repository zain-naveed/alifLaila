import { Modal } from "react-bootstrap";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import Image from "next/image";
import { closeImg } from "assets";
interface Props {
  show: boolean;
  handleClose: () => void;
  cover: string;
}

function ViewImageModal({ show, handleClose, cover }: Props) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <div className={classNames("pt-4 px-4 pb-4 text-center")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between pb-3"
          )}
        >
          <label className={classNames(styles.coverLabel)}>Image</label>
          <div
            onClick={handleClose}
            role={"button"}
            className={classNames(styles.closeImageContainer)}
          >
            <Image src={closeImg} alt="close"  />
          </div>
        </div>
        <img
          src={cover}
          // width={530}
          alt="image preview"
          className={classNames(styles.imageStyle)}
        />
      </div>
    </Modal>
  );
}

export default ViewImageModal;
