import { SubmitRevisionIllustration, closeImg } from "assets";
import classNames from "classnames";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import { submitRevision } from "shared/services/publisher/bookService";
import { bookStatusEnum } from "shared/utils/enum";
import styles from "./style.module.scss";
import Image from "next/image";

interface ModalProps {
  showModal: boolean;
  handleClose: () => void;
  book: any;
  setBook: (val: any) => void;
}

const SubmitRevisionModal = ({
  showModal,
  handleClose,
  book,
  setBook,
}: ModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const onClose = () => {
    setText("");
    handleClose();
  };

  const handleSubmitRevision = () => {
    let formData = new FormData();
    formData.append("book_id", book?.id);
    formData.append("comment", text);

    if (text) {
      setLoading(true);
      submitRevision(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            let temp = { ...book };
            temp["status"] = bookStatusEnum.revision_submitted;
            setBook(temp);
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
            "d-flex align-items-center justify-content-between w-100"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3 "
            )}
          >
            <SubmitRevisionIllustration
              className={classNames(styles.reportIcon)}
            />
            <label className={styles.labelText}>Submit Revision</label>
          </div>
          <div
            onClick={onClose}
            role={"button"}
            className={classNames(styles.closeImageContainer)}
          >
            <Image src={closeImg} alt="close" />
          </div>
        </div>

        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-center gap-2"
          )}
        >
          <label className={classNames(styles.optionLabel)}>
            Write Reply Message <span>*</span>
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
            title={"Cancel"}
            containerStyle={styles.cancelButton}
            onClick={onClose}
          />
          <CustomButton
            title={"Submit"}
            containerStyle={styles.reportButton}
            onClick={handleSubmitRevision}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SubmitRevisionModal;
