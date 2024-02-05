import { PlansIcon, TickIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import BoxLoader from "shared/loader/box";
import { buyCoins, getTopUps } from "shared/services/kid/plansService";
import styles from "./style.module.scss";

interface Props {
  show: boolean;
  handleClose: () => void;
  handleGetWallet?: () => void;
}

function BuyCoinsModal({ show, handleClose, handleGetWallet }: Props) {
  const [activeIndex, setActiveIndex] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [topUps, setTopUps] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const handleBuyCoin = () => {
    if (activeIndex) {
      setActionLoading(true);
      buyCoins({ topup_id: activeIndex?.id })
        .then(({ data: { data, message, status } }) => {
          if (status) {
            toastMessage("success", message);
            handleGetWallet?.();
            handleClose();
          }
        })
        .catch((err) => {})
        .finally(() => {
          setActionLoading(false);
        });
    } else {
      if (topUps?.length > 0) {
        toastMessage("error", "Please a top up balance");
      } else {
        toastMessage(
          "error",
          "No Topups available at the moment. Please try again later"
        );
      }
    }
  };

  const handleGetTopups = () => {
    setLoading(true);
    getTopUps()
      .then(({ data: { data, status } }) => {
        if (status) {
          setTopUps(data);
        } else {
          setTopUps([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (show) {
      handleGetTopups();
    }
  }, [show]);

  const onClose = () => {
    handleClose();
    setActiveIndex(null);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader close={onClose} isFirst={true} headerStyle={styles.header} />
      <div
        className={classNames(
          "px-4 pb-4 pt-3 d-flex flex-column align-items-center justify-content-center gap-2"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-center gap-1"
          )}
        >
          <label className={classNames(styles.heading)}>Purchase Balance</label>
          <p className={styles.paragraph}>Select a top up balance</p>
        </div>

        {loading ? (
          <>
            <div
              className={classNames(
                "d-flex flex-column w-100 gap-3 mb-3",
                styles.topUpContainer
              )}
            >
              {Array.from(Array(3).keys())?.map((itm: any, inx: number) => {
                return (
                  <div
                    className={classNames(
                      styles.singleTopUpContainer,
                      styles.loader,
                      "d-flex flex-column align-items-start justify-content-around gap-1 w-100 p-3"
                    )}
                    key={inx}
                  >
                    <BoxLoader
                      iconStyle={classNames(styles.priceLabelLoader)}
                    />

                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-start gap-2"
                      )}
                    >
                      <BoxLoader
                        iconStyle={classNames(styles.iconContainerLoader)}
                      />
                      <BoxLoader
                        iconStyle={classNames(styles.coinsLabelLoader)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <BoxLoader iconStyle={classNames(styles.buttonContainer)} />
          </>
        ) : topUps?.length > 0 ? (
          <>
            <div
              className={classNames(
                "d-flex flex-column w-100 gap-3 mb-3",
                styles.topUpContainer
              )}
            >
              {topUps?.map((itm: any, inx: number) => {
                return (
                  <div
                    className={classNames(
                      styles.singleTopUpContainer,
                      "d-flex flex-column align-items-start justify-content-around gap-1 position-relative w-100 p-3",
                      activeIndex?.id === itm?.id && styles.activeTopUp
                    )}
                    onClick={() => {
                      setActiveIndex(itm);
                    }}
                    key={inx}
                  >
                    <span className={classNames(styles.priceLabel)}>
                      Price: Rs {itm?.price}
                    </span>
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-start gap-2"
                      )}
                    >
                      <div className={classNames(styles.iconContainer)}>
                        <PlansIcon />
                      </div>
                      <span className={classNames(styles.coinsLabel)}>
                        {itm?.coins} Coins
                      </span>
                    </div>
                    <div className={classNames(styles.actionContainer)}>
                      <TickIcon />
                    </div>
                  </div>
                );
              })}
            </div>
            <CustomButton
              title="Buy Coins"
              containerStyle={styles.buttonContainer}
              onClick={handleBuyCoin}
              disabled={loading || actionLoading}
              loading={actionLoading}
            />
          </>
        ) : (
          <>
            <NoContentCard
              label1="No Topups Found"
              label2="No Topups available at the moment. Please try again later"
              customContainer={"gap-0"}
              customIconContianer={classNames(styles.noFoundIconStyle)}
              customLabel1Style={classNames(styles.noFoundLabel1)}
              customLabel2Style={classNames(styles.noFoundLabel2)}
            />
          </>
        )}
      </div>
    </Modal>
  );
}

export default BuyCoinsModal;
