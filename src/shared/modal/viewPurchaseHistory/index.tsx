import { DefaultBookImg } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { Modal } from "react-bootstrap";
import Status from "shared/components/common/status";
import ModalHeader from "shared/components/modalHeader";
import styles from "./style.module.scss";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import { getBooksSales } from "shared/services/publisher/walletService";
import BoxLoader from "shared/loader/box";
import { paymentTypesEnum } from "shared/utils/enum";
import { useRouter } from "next/router";
import { getPartnerAuthorBooksSales } from "shared/services/publisher/authorsService";

interface ViewOrderModalProps {
  show: boolean;
  handleClose: () => void;
  item: any;
  isPartnerAuthor?: boolean;
}

const ViewPurchaseHistoryModal = ({
  show,
  handleClose,
  item,
  isPartnerAuthor,
}: ViewOrderModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [list, setList] = useState<any[]>([]);

  const handleGetPaymentBooksList = () => {
    getBooksSales(item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setList(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetPartnerAuthorPaymentBooksList = () => {
    getPartnerAuthorBooksSales(router?.query?.id, item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setList(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (show) {
      setLoading(true);
      if (isPartnerAuthor) {
        handleGetPartnerAuthorPaymentBooksList();
      } else {
        handleGetPaymentBooksList();
      }
    }
  }, [show]);

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
            "d-flex align-items-center flex-column justify-content-center gap-3 px-3 mt-3"
          )}
        >
          <div className={classNames("d-flex align-items-center gap-4 w-100")}>
            <div className={classNames("d-flex align-items-center gap-3")}>
              <label className={classNames(styles.dateLabel)}>From:</label>
              <label className={classNames(styles.bookDetail)}>
                {moment(item?.start_date).format("DD-MM-YYYY")}
              </label>
            </div>
            <div className={classNames("d-flex align-items-center gap-3")}>
              <label className={classNames(styles.dateLabel)}>To:</label>
              <label className={classNames(styles.bookDetail)}>
                {moment(item?.end_date).format("DD-MM-YYYY")}
              </label>
            </div>
          </div>
          <div
            className={classNames(styles.orderHeaderContainer, "p-3 d-flex")}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2 w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex flex-column align-items-center justify-content-between  gap-3"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start justify-content-between gap-2"
                  )}
                >
                  <label className={classNames(styles.orderId)}>
                    Transection ID
                  </label>
                  <label className={classNames(styles.orderIdDetail)}>
                    {item?.transaction_id ? item?.transaction_id : "----"}
                  </label>
                </div>
              </div>
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-between gap-2"
                )}
              >
                <label className={classNames(styles.orderId)}>
                  Total Amount
                </label>
                <label className={classNames(styles.orderIdDetail)}>
                  Rs. {Math.trunc(item?.amount)}
                </label>
              </div>
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2 w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-between gap-2"
                )}
              >
                <label className={classNames(styles.orderId)}>
                  Total Books
                </label>
                <label className={classNames(styles.orderIdDetail)}>
                  {item?.books_count}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-between gap-2 "
                )}
              >
                <label className={classNames(styles.orderId)}>
                  Platform Deduction
                </label>
                <label className={classNames(styles.orderIdDetail)}>
                  Rs. {Math.trunc(item?.platform_amount)}
                </label>
              </div>
            </div>

            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-start gap-2 w-100"
              )}
            >
              <label className={classNames(styles.orderId)}>Status</label>
              <Status
                status={item?.status}
                type="Payment"
                customContainerStyle={classNames(styles.statusContainer)}
              />
            </div>
          </div>
          {!loading && list?.length === 0 ? null : (
            <>
              <div
                className={classNames("d-flex flex-column w-100 gap-3 px-2")}
              >
                <div className={classNames("d-flex w-100")}>
                  <div className={classNames(styles.firstCol)}>
                    <label className={classNames(styles.tableTitle)}>
                      Books
                    </label>
                  </div>
                  <div
                    className={classNames(
                      styles.otherCol,
                      "d-flex align-items-center justify-content-center"
                    )}
                  >
                    <label className={classNames(styles.tableTitle)}>
                      Sale
                    </label>
                  </div>
                  <div
                    className={classNames(
                      styles.otherCol,
                      "d-flex align-items-center justify-content-end"
                    )}
                  >
                    <label className={classNames(styles.tableTitle)}>
                      Amount
                    </label>
                  </div>
                </div>
                <div className={classNames(styles.seperator)} />
              </div>
              <div
                className={classNames("d-flex flex-column w-100 gap-3 px-2")}
              >
                {loading ? (
                  <>
                    {Array.from(Array(4).keys()).map((itm: any, inx: any) => {
                      return (
                        <Fragment key={inx}>
                          <div className={classNames("d-flex w-100")}>
                            <div
                              className={classNames(
                                styles.firstCol,
                                "d-flex align-items-center justify-content-start gap-2"
                              )}
                            >
                              <div className={classNames(styles.imgContainer)}>
                                <BoxLoader
                                  iconStyle={classNames(styles.bookImg)}
                                />
                              </div>
                              <BoxLoader
                                iconStyle={classNames(styles.tableTitleLoader)}
                              />
                            </div>
                            <div
                              className={classNames(
                                styles.otherCol,
                                "d-flex align-items-center justify-content-center"
                              )}
                            >
                              <BoxLoader
                                iconStyle={classNames(styles.tableTitleLoader)}
                              />
                            </div>
                            <div
                              className={classNames(
                                styles.otherCol,
                                "d-flex align-items-center justify-content-end"
                              )}
                            >
                              <BoxLoader
                                iconStyle={classNames(styles.tableTitleLoader)}
                              />
                            </div>
                          </div>
                          <div className={classNames(styles.seperator)} />
                        </Fragment>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {list?.map((itm, inx) => {
                      return (
                        <Fragment key={inx}>
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
                                      : DefaultBookImg.src
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
                                {itm?.total_sales}x
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
                                {item?.payment_type ===
                                paymentTypesEnum.hardcopies
                                  ? "Rs. "
                                  : ""}
                                {Math.trunc(itm?.total_coins)}
                              </label>
                            </div>
                          </div>
                          <div className={classNames(styles.seperator)} />
                        </Fragment>
                      );
                    })}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewPurchaseHistoryModal;
