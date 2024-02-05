import { DownloadIcon, EyeIcon, FilterLines, OrderCheck } from "assets";
import classNames from "classnames";
import moment from "moment";
import { useRouter } from "next/router";
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
import SendPaymentModal from "shared/modal/sendPayment";
import ViewPurchaseHistoryModal from "shared/modal/viewPurchaseHistory";
import { getPartnerAuthorPayments } from "shared/services/publisher/authorsService";
import { authorPaymentStatusEnum } from "shared/utils/enum";
import { downloadLink } from "shared/utils/helper";
import { TabsEnum } from "shared/utils/pageConstant/partner/authorsScreenConstants";
import styles from "./style.module.scss";

const Payments = ({ keyword }: any) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [history, setHistory] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        handleGetPayments(authorPaymentStatusEnum.pending);
      },
    },
    {
      title: "Sent",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments(authorPaymentStatusEnum.sent);
      },
    },
  ];

  const handleGetPayments = (filter?: any) => {
    setLoading(true);
    getPartnerAuthorPayments(currentPage, router?.query?.id, filter)
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
    if (keyword === TabsEnum.paymentHistory) {
      handleGetPayments();
    }
  }, [currentPage, keyword]);

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
              title="See your payment history from ABC Publishers."
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
          heads={["Purchase ID", "Amount", "Date", "Status", "Action"]}
          loading={loading}
          isEmpty={history ? history < 1 : true}
        >
          {loading ? (
            <>
              {Array.from(Array(4).keys()).map((itm, inx) => {
                return <RowItemLoader />;
              })}
            </>
          ) : (
            <>
              {history?.map((item: any, inx: number) => {
                return <RowItem key={inx} Item={item} />;
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
            setCurrentPage(page);
          }}
        />
      </div>
    </>
  );
};

const RowItem = ({ Item }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [item, setItem] = useState<any>(Item);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ maxWidth: "20%", verticalAlign: "middle" }}
        >
          {item?.transaction_id ? item?.transaction_id : "----"}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          Rs. {Math.trunc(item?.amount)}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          {moment(item?.created_at).format("DD-MM-YYYY h:mm a")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          <Status status={item?.status} type="AuthorPayment" />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ maxWidth: "20%", verticalAlign: "middle" }}
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
            ) : (
              <CustomToolTip label="Send Payment">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowPaymentModal}
                >
                  <OrderCheck className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            )}
          </div>
        </td>
      </tr>
      <ViewPurchaseHistoryModal
        show={showModal}
        handleClose={handleCloseModal}
        item={item}
        isPartnerAuthor
      />
      <SendPaymentModal
        showModal={showPaymentModal}
        handleClose={handleClosePaymentModal}
        item={item}
        setItem={setItem}
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
          style={{ maxWidth: "20%", verticalAlign: "middle" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
        >
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ maxWidth: "20%" }}
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
          style={{ maxWidth: "20%", verticalAlign: "middle" }}
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

export default Payments;
