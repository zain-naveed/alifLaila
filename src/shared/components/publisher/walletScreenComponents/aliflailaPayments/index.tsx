import { DownloadIcon, EyeIcon, FilterLines } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import Title from "shared/components/common/title";
import OptionsDropDown from "shared/dropDowns/options";
import BoxLoader from "shared/loader/box";
import ViewPurchaseHistoryModal from "shared/modal/viewPurchaseHistory";
import { getPayments } from "shared/services/publisher/walletService";
import { paymentStatusEnum, paymentTypesEnum } from "shared/utils/enum";
import styles from "./style.module.scss";
import { downloadLink } from "shared/utils/helper";

const AliflailaPayments = ({ paymentsData }: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(paymentsData?.total);
  const [history, setHistory] = useState<any>(paymentsData?.data);
  const [loading, setLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);
  const [openSelection, setOpenSelection] = useState<boolean>(false);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: "All",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments();
      },
    },
    {
      title: "Pending",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments(paymentStatusEnum.pending);
      },
    },
    {
      title: "Payment Received",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments(paymentStatusEnum.received);
      },
    },
  ];

  const handleGetPayments = (filter?: any) => {
    setLoading(true);
    getPayments(currentPage, filter)
      .then(
        ({
          data: {
            data: { data, total },
            message,
            status,
          },
        }) => {
          if (status) {
            setHistory(data);
            setTotalPage(total);
          }
        }
      )
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      handleGetPayments();
    }
  }, [currentPage]);

  return (
    <>
      <div className={classNames(styles.tableMain, "my-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4",
            styles.bookWrapper
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading
              heading="Payments History"
              headingStyle={styles.bookMainHeading}
            />
            <Title
              title="See your payments received from Alif Laila."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div className={classNames("position-relative")}>
            <CustomButton
              IconDirction="left"
              title="Filters"
              Icon={FilterLines}
              iconStyle={styles.iconStyle}
              containerStyle={classNames(styles.buttonFilter, "gap-2")}
              onClick={() => {
                setOpenSelection(!openSelection);
              }}
            />
            <OptionsDropDown
              options={options}
              openSelection={openSelection}
              setOpenSelection={setOpenSelection}
              customContainer={styles.optionsContainer}
            />
          </div>
        </div>
        <CustomTable
          title="Payments History"
          heads={["Purchase ID", "Amount", "Type", "Date", "Status", "Action"]}
          loading={loading}
          isEmpty={history ? history < 1 : true}
        >
          {loading ? (
            <>
              {Array.from(Array(4).keys()).map((itm, inx) => {
                return <RowItemLoader key={inx} />;
              })}
            </>
          ) : (
            <>
              {history?.map((item: any, inx: number) => {
                return <RowItem key={inx} item={item} />;
              })}
            </>
          )}
        </CustomTable>

        <Pagination
          className={styles.paginationBar}
          currentPage={currentPage}
          totalCount={totalPage}
          pageSize={10}
          onPageChange={(page: any) => {
            setInitial(false);
            setCurrentPage(page);
          }}
        />
      </div>
    </>
  );
};

const RowItem = ({ item }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ maxWidth: "15%", verticalAlign: "middle" }}
        >
          {item?.transaction_id ? item?.transaction_id : "----"}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "15%" }}
        >
          Rs. {Math.trunc(item?.amount)}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "17.5%" }}
        >
          {paymentTypesEnum.hardcopies === item?.payment_type
            ? "Printed Copies"
            : "Soft Copies"}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "15%" }}
        >
          {moment(item?.created_at).format("DD-MM-YYYY h:mm a")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          <Status status={item?.status} type="Payment" />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ maxWidth: "17.5%", verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3"
            )}
          >
            <CustomToolTip label="View Details">
              <div
                className={classNames(styles.actionContainer)}
                onClick={handleShowModal}
              >
                <EyeIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>
            {item?.receipt_image ? (
              <CustomToolTip label="Download">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={() => {
                    downloadLink(item?.receipt_image, "attachment");
                  }}
                >
                  <DownloadIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            ) : null}
          </div>
        </td>
      </tr>
      <ViewPurchaseHistoryModal
        show={showModal}
        handleClose={handleCloseModal}
        item={item}
      />
    </>
  );
};

const RowItemLoader = () => {
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ maxWidth: "15%", verticalAlign: "middle" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "15%" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "17.5%" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "15%" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          <BoxLoader iconStyle={classNames(styles.statusLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ maxWidth: "17.5%", verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3"
            )}
          >
            <BoxLoader iconStyle={classNames(styles.actionContainer)} />
            <BoxLoader iconStyle={classNames(styles.actionContainer)} />
          </div>
        </td>
      </tr>
    </>
  );
};

export default AliflailaPayments;
