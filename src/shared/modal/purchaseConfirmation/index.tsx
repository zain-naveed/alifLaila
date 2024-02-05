import { CoinAsset1, PurchaseBookModalIcon } from "assets";
import classNames from "classnames";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import ModalHeader from "shared/components/modalHeader";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
  type: number;
  purchaseLoader: boolean;
  bookDetail: any;
  handleBookPurchase: () => void;
  loading: boolean;
  wallet: any;
}
function PurchaseConfirmationModal(props: Props) {
  const {
    open,
    handleClose,
    type,
    purchaseLoader,
    handleBookPurchase,
    bookDetail,
    wallet,
    loading,
  } = props;

  return (
    <Modal
      show={open}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader
        close={handleClose}
        isFirst={true}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "px-3 pt-0 pb-4 d-flex flex-column align-items-center justify-content-center"
        )}
      >
        <PurchaseBookModalIcon className={styles.insufficientIcon} />
        {loading ? (
          <BoxLoader iconStyle={classNames(styles.remainingContainerLoader)} />
        ) : (
          <div className={classNames(styles.remainingContainer, "gap-2 px-2")}>
            <CoinAsset1 className={classNames(styles.coinIcon)} />
            <label className={classNames(styles.remLabel)}>
              {wallet?.remaining_coins} Remaining Coins
            </label>
          </div>
        )}

        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-center gap-2 my-3"
          )}
        >
          <label className={classNames(styles.heading)}>
            Are you sure you want to {type === 1 ? "Borrow" : "Buy"} this for{" "}
            {type === 1 ? bookDetail?.borrow_coins : bookDetail?.buy_coins}{" "}
            coins?
          </label>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center gap-3"
          )}
        >
          <CustomButton
            title="Not Now"
            containerStyle={styles.buttonContainer2}
            onClick={handleClose}
          />
          <CustomButton
            title="Yes"
            containerStyle={styles.buttonContainer}
            loading={purchaseLoader}
            disabled={purchaseLoader}
            onClick={() => {
              handleBookPurchase();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default PurchaseConfirmationModal;
