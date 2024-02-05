import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Pagination from "shared/components/common/pagination";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import {
  getTopUpsHistory,
  getTransactionsHistory,
} from "shared/services/kid/plansService";
import styles from "./style.module.scss";

interface Props {
  show: boolean;
  handleClose: () => void;
  itm: any;
}

const ViewPlanPurchaseHistoryModal = ({ show, handleClose, itm }: Props) => {
  const [item, setItem] = useState<any>(itm);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [transactionData, setTransactionData] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);

  const handleGetTopUpsHistory = () => {
    getTopUpsHistory(itm?.id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          let tempObj = { ...itm };
          tempObj["wallet_coins"] = data;
          setItem(tempObj);
        }
      })
      .catch((err) => {});
  };

  const getTransactionsData = () => {
    setLoader(true);
    getTransactionsHistory({
      page: currentPage,
      search: "",
      status: "",
      subscribe_id: itm?.id,
    })
      .then(({ data }) => {
        if (data?.statusCode !== 200) {
          toastMessage("error", data?.message);
        } else {
          setTransactionData(data?.data?.data);
          setTotalPage(data?.data?.total);
        }
        setLoader(true);
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        setLoader(true);
      });
  };

  useEffect(() => {
    if (show) {
      handleGetTopUpsHistory();
      getTransactionsData();
    }
  }, [show, currentPage]);

  const tableHeadings: any = [
    {
      label: "Transaction ID",
    },
    {
      label: "Transaction type",
    },
    {
      label: "Coins",
    },
    {
      label: "Amount",
    },
    {
      label: "Purchased date",
    },
  ];

  const transaction_type: any = [
    {
      label: "Online",
      status: 1,
    },
    {
      label: "Manual",
      status: 2,
    },
  ];

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
            "d-flex align-items-start flex-column justify-content-center gap-3 px-3"
          )}
        >
          <label className={classNames(styles.dateLabel)}>
            Annual Plans Purchase Details
          </label>

          <div className={classNames("w-100", styles.orderHeaderContainer)}>
            <table className="w-100">
              <tr className="w-100">
                {tableHeadings?.map((item: any) => {
                  return <td className={styles.labelTable}>{item?.label}</td>;
                })}
              </tr>

              {transactionData?.map((item: any, inx: any, arr: any) => {
                return (
                  <tr
                    className={
                      inx !== arr.length - 1 ? styles.borderBottom : ""
                    }
                  >
                    <td className={styles.tableBody}>{item?.transaction_id}</td>
                    <td className={styles.tableBody}>
                      {
                        transaction_type.find(
                          (itm: any) =>
                            itm?.status === Number(item?.transaction_type)
                        )?.label
                      }
                    </td>
                    <td className={styles.tableBody}>{item?.coins}</td>
                    <td className={styles.tableBody}>Rs. {item?.price}</td>
                    <td className={styles.tableBody}>
                      {moment(item?.transaction_date).format("DD MMM, YYYY")}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
          <Pagination
            className={styles.paginationBar}
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={10}
            onPageChange={(page: any) => setCurrentPage(page)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewPlanPurchaseHistoryModal;
