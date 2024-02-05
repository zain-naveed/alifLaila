import { DefaultBookImg, FilterLines, SearchIcon } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import Title from "shared/components/common/title";
import styles from "./style.module.scss";
import HistoryFilterSidebar from "../historyFilterSidebar";
import { bookPurchaseTypeEnum, bookStatusEnum } from "shared/utils/enum";
import { getUserSpendings } from "shared/services/publisher/walletService";
import useDebounce from "shared/customHook/useDebounce";
import OptionsDropDown from "shared/dropDowns/options";
import BoxLoader from "shared/loader/box";
import moment from "moment";

const UserSpendings = ({ userSpendingData }: any) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(userSpendingData?.total);
  const [history, setHistory] = useState<any>(userSpendingData?.data);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
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
      title: "Buy",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments(bookPurchaseTypeEnum.buy);
      },
    },
    {
      title: "Borrow",
      Icon: null,
      action: () => {
        setCurrentPage(1);
        handleGetPayments(bookPurchaseTypeEnum.borrow);
      },
    },
  ];

  const handleGetPayments = (filter?: any) => {
    setLoading(true);
    getUserSpendings(currentPage, searchVal, filter)
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
  }, [currentPage, searchVal]);

  useDebounce(
    () => {
      setCurrentPage(1);
      setInitial(false);
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    setTotalPage(userSpendingData?.total);
    setHistory(userSpendingData?.data);
  }, [userSpendingData]);

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
              heading="User Spending History"
              headingStyle={styles.bookMainHeading}
            />
            <Title
              title="See your soft-copy purchase details"
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between gap-3"
            )}
          >
            <div className={classNames(styles.searchContainer, "d-flex")}>
              <SearchIcon className={classNames(styles.searchIconStyle)} />
              <input
                className={classNames(styles.searchInputStyle, "ps-2")}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
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
        </div>
        <CustomTable
          title="User Spending History"
          heads={["Book Name", "Order ID", "Coins", "Status", "Date"]}
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
        {!loading && history?.length > 0 ? (
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
        ) : null}
      </div>
    </>
  );
};

const RowItem = ({ item }: any) => {
  return (
    <tr>
      <td
        className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
        style={{ verticalAlign: "middle", width: "40%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <img
            alt="book-cover"
            src={
              item?.book?.thumbnail ? item?.book?.thumbnail : DefaultBookImg.src
            }
            className={classNames(styles.bookCover)}
            height={40}
            width={37}
          />
          <label className={classNames(styles.bookTitle)}>
            {item?.book?.title}
          </label>
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "15%" }}
      >
        {item?.purchase_id}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "15%" }}
      >
        {Math.trunc(item?.coins)}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "20%" }}
      >
        <Status status={item?.type} type="PurchaseStatusType" />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ maxWidth: "10%" }}
      >
        {moment(item?.created_at).format("DD-MM-YYYY h:mm a")}
      </td>
    </tr>
  );
};

const RowItemLoader = () => {
  return (
    <tr>
      <td
        className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
        style={{ verticalAlign: "middle", width: "40%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.bookCover)} />
          <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "15%" }}
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
        style={{ maxWidth: "10%" }}
      >
        <BoxLoader iconStyle={classNames(styles.rowItmLoader)} />
      </td>
    </tr>
  );
};

export default UserSpendings;
