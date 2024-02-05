import { AskParentCoin, InsufficientCoinIcon } from "assets";
import classNames from "classnames";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import { useRouter } from "next/router";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { useSelector } from "react-redux";
import { kidAccountRole, roles } from "shared/utils/enum";
import Image from "next/image";
import dynamic from "next/dynamic";

interface Props {
  open: boolean;
  handleClose: () => void;
}
function InsufficentCoin({ open, handleClose }: Props) {
  const {
    login: {
      user: { role },
      kidRole,
    },
  } = useSelector((state: any) => state.root);
  const router = useRouter();

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
          "px-4 pb-4 pt-3 d-flex flex-column align-items-center justify-content-center gap-2"
        )}
      >
        <Image
          src={
            kidRole === kidAccountRole.family
              ? AskParentCoin
              : InsufficientCoinIcon
          }
          className={
            kidRole === kidAccountRole.family
              ? styles.askParentIcon
              : styles.insufficientIcon
          }
          alt=""
        />

        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-center gap-2"
          )}
        >
          <label className={classNames(styles.heading)}>
            {kidRole === kidAccountRole.family
              ? "Ask Your Parent for Help"
              : "You have Insuficient Coins"}
          </label>
          <p className={styles.paragraph}>
            {kidRole === kidAccountRole.family
              ? "Ask your parents to create their account & purchase coins for you."
              : "Purchase coins or use a parent account to read this book."}
          </p>
        </div>
        {kidRole !== kidAccountRole.family ? (
          <CustomButton
            title="Buy Coins"
            containerStyle={styles.buttonContainer}
            onClick={() => {
              handleClose();
              if (role === roles.parent) {
                router.push(parentPanelConstant.plans.path);
              } else {
                router.push(kidPanelConstant.plans.path);
              }
            }}
          />
        ) : null}
      </div>
    </Modal>
  );
}

export default dynamic(() => Promise.resolve(InsufficentCoin), {
  ssr: false,
});
