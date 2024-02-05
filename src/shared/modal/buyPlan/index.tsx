import { closeImg } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import BankDetails from "./bankDetails";
import styles from "./style.module.scss";
import UploadScreenShot from "./uploadScreenshot";

interface Props {
  show: boolean;
  handleClose: () => void;
  handleShowPaymentVerificationModal: () => void;
  plan: any;
}

const BuyPlanModal = ({
  show,
  handleClose,
  plan,
  handleShowPaymentVerificationModal,
}: Props) => {
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
      <div
        className={classNames(
          "py-4 d-flex flex-column align-items-center justify-content-center gap-2"
        )}
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center w-100 px-4"
          )}
        >
          <div />
          <h5 className={classNames(styles.modalHeaderHeaing)}>Make Payment</h5>
          <div
            onClick={handleClose}
            role={"button"}
            className={classNames(styles.closeImageContainer, "pointer")}
          >
            <Image src={closeImg} alt="close" />
          </div>
        </div>
        <label className={classNames(styles.subHeading, "px-4")}>
          Make payment by using our account information and upload the
          screenshot of receipt.{" "}
        </label>
        <SwitchModal
          handleClose={handleClose}
          plan={plan}
          handleShowPaymentVerificationModal={
            handleShowPaymentVerificationModal
          }
        />
      </div>
    </Modal>
  );
};

interface SwitchProps {
  handleClose: () => void;
  plan: any;
  handleShowPaymentVerificationModal: () => void;
}

function SwitchModal({
  handleClose,
  plan,
  handleShowPaymentVerificationModal,
}: SwitchProps) {
  const [step, setStep] = useState<number>(1);
  switch (step) {
    case 1:
      return <BankDetails setStep={setStep} plan={plan} />;
    case 2:
      return (
        <UploadScreenShot
          handleClose={() => {
            setStep(1);
            handleClose();
          }}
          planId={plan?.id}
          handleShowPaymentVerificationModal={
            handleShowPaymentVerificationModal
          }
        />
      );
    default:
      return <BankDetails setStep={setStep} plan={plan} />;
  }
}

export default BuyPlanModal;
