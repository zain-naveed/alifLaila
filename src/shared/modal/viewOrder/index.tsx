import { VerifiedIcon, defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import Status from "shared/components/common/status";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import PublishingHouse from "shared/components/common/publishingHouse";
import { roles } from "shared/utils/enum";

interface ViewOrderModalProps {
  item: any;
  show: boolean;
  handleClose: () => void;
}

const ViewOrderModal = ({ item, show, handleClose }: ViewOrderModalProps) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
    >
      <div className={classNames("pt-2 pb-4")}>
        <ModalHeader
          close={handleClose}
          headerStyle={styles.header}
          isFirst={true}
        />
        <div
          className={classNames(
            "d-flex align-items-center flex-column justify-content-center gap-3 px-3"
          )}
        >
          <img
            src={
              item?.partner?.role === roles.author
                ? item?.partner?.profile_picture
                : item?.partner?.publishing_logo
                ? item?.partner?.publishing_logo
                : defaultAvatar.src
            }
            height={81}
            width={81}
            alt="publishing logo"
            className={classNames(styles.logoStyle)}
          />
          <div
            className={classNames(
              "d-flex align-items-center justify-content-center gap-2"
            )}
          >
            <label className={classNames(styles.pubName)}>
              <PublishingHouse item={item} />
            </label>
            <VerifiedIcon className={classNames(styles.verifyIcon)} />
          </div>
          <div className={classNames(styles.orderHeaderContainer, "px-3")}>
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              <label className={classNames(styles.orderId)}>Order ID</label>
              <label className={classNames(styles.orderIdDetail)}>
                {item?.order_id}
              </label>
            </div>

            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              <label className={classNames(styles.orderId)}>Status</label>
              <Status
                status={item?.status}
                isUser
                customContainerStyle={styles.statusContainer}
              />
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              <label className={classNames(styles.orderId)}>
                Shipping Charges
              </label>
              <label className={classNames(styles.orderIdDetail)}>
                {item?.shipping_cost}
              </label>
            </div>
          </div>
          <div className={classNames("d-flex flex-column w-100 gap-3 px-2")}>
            <div className={classNames("d-flex w-100")}>
              <div className={classNames(styles.firstCol)}>
                <label className={classNames(styles.tableTitle)}>Books</label>
              </div>
              <div
                className={classNames(
                  styles.otherCol,
                  "d-flex align-items-center justify-content-center"
                )}
              >
                <label className={classNames(styles.tableTitle)}>Qty</label>
              </div>
              <div
                className={classNames(
                  styles.otherCol,
                  "d-flex align-items-center justify-content-end"
                )}
              >
                <label className={classNames(styles.tableTitle)}>Price</label>
              </div>
            </div>
            <div className={classNames(styles.seperator)} />
          </div>
          <div className={classNames("d-flex flex-column w-100 gap-3 px-2")}>
            {item?.order_items.map((itm: any, inx: any) => {
              return (
                <>
                  <div className={classNames("d-flex w-100")}>
                    <div
                      className={classNames(
                        styles.firstCol,
                        "d-flex align-items-center justify-content-start gap-2"
                      )}
                    >
                      <div className={classNames(styles.imgContainer)}>
                        <img
                          src={
                            itm?.book?.thumbnail
                              ? itm?.book?.thumbnail
                              : itm?.book?.cover_photo
                          }
                          alt="book-img"
                          width={52}
                          height={57}
                          className={classNames(styles.bookImg)}
                        />
                      </div>
                      <label className={classNames(styles.tableTitle)}>
                        {itm?.book?.title}
                      </label>
                    </div>
                    <div
                      className={classNames(
                        styles.otherCol,
                        "d-flex align-items-center justify-content-center"
                      )}
                    >
                      <label className={classNames(styles.bookDetail)}>
                        {itm?.quantity}
                      </label>
                    </div>
                    <div
                      className={classNames(
                        styles.otherCol,
                        "d-flex align-items-center justify-content-end"
                      )}
                    >
                      <label
                        className={classNames(styles.tableTitle)}
                        style={{ color: "#9a469b" }}
                      >
                        Rs.{itm?.price}
                      </label>
                    </div>
                  </div>
                  <div className={classNames(styles.seperator)} />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOrderModal;
