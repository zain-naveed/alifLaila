import { FilterLines, NewIcon, SearchIcon, defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomTable from "shared/components/common/customTable";
import Pagination from "shared/components/common/pagination";
import useDebounce from "shared/customHook/useDebounce";
import OptionsDropDown from "shared/dropDowns/options";
import ProgressAssigneeDropDown from "shared/dropDowns/progressAssignees";
import BoxLoader from "shared/loader/box";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { getProgress, markBookAsRead } from "shared/services/kid/bookService";
import { percentage } from "shared/utils/helper";
import { ProgressFilters } from "shared/utils/pageConstant/kid/profileConstant";
import styles from "./style.module.scss";

const Progress = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [progress, setProgress] = useState<any>([]);
  const [total, setTotal] = useState<number>(100);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [openSelection, setOpenSelection] = useState<boolean>(false);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: ProgressFilters[0].label,
      Icon: null,
      action: () => {
        handleGetProgress(ProgressFilters[0].value);
      },
    },
    {
      title: ProgressFilters[1].label,
      Icon: null,
      action: () => {
        handleGetProgress(ProgressFilters[1].value);
      },
    },
    {
      title: ProgressFilters[2].label,
      Icon: null,
      action: () => {
        handleGetProgress(ProgressFilters[2].value);
      },
    },
    {
      title: ProgressFilters[3].label,
      Icon: null,
      action: () => {
        handleGetProgress(ProgressFilters[3].value);
      },
    },
  ];

  const handleGetProgress = (filter: any) => {
    setTableLoading(true);
    getProgress({ page: currentPage, search: searchVal, sort_by: filter })
      .then(
        ({
          data: {
            data: { data, total },
            message,
            status,
          },
        }) => {
          if (status) {
            setTotal(total);
            setProgress(data);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setTableLoading(false);
      });
  };

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    handleGetProgress("");
    // eslint-disable-next-line
  }, [currentPage, searchVal]);
  return (
    <div className={classNames(styles.tableContainer, "mt-4")}>
      <div
        className={classNames(
          "d-flex flex-column flex-sm-row align-items-start justify-content-between p-4 gap-3 gap-sm-0"
        )}
      >
        <div
          className={classNames(
            "d-flex align-items-start justify-content-between flex-column"
          )}
        >
          <label className={classNames(styles.tableTitle)}>My Progress</label>
          <label className={classNames(styles.tableSubtitle)}>
            See your progress here.
          </label>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between gap-3"
          )}
        >
          <div className={classNames(styles.searchContainer, "px-3")}>
            <SearchIcon className={classNames(styles.searchIcon)} />
            <input
              className={classNames(styles.searchInput, "ms-1")}
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div
            className={classNames(
              styles.filterContainer,
              "gap-2 position-relative"
            )}
            role="button"
            onClick={() => {
              setOpenSelection(!openSelection);
            }}
          >
            <FilterLines className={classNames(styles.filterIcon)} />
            <label className={classNames(styles.filterLabel)} role="button">
              Filters
            </label>
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
        title="My Progress"
        heads={["Book Name", "Assigned By", "Status", "Quiz"]}
        isEmpty={progress ? progress?.length === 0 : true}
        loading={tableLoading}
      >
        {tableLoading ? (
          <>
            {Array.from(Array(7).keys()).map((itm, inx) => {
              return <TableRowLoader key={inx} />;
            })}
          </>
        ) : (
          progress?.map((itm: any, inx: number) => {
            return (
              <TableRow
                item={itm}
                key={inx}
                index={inx}
                total={progress?.length}
              />
            );
          })
        )}
      </CustomTable>
      <Pagination
        currentPage={currentPage}
        totalCount={total}
        pageSize={10}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    </div>
  );
};

const TableRow = ({ item, index, total }: any) => {
  const router = useRouter();
  const [openSelection, setOpenSelection] = useState<boolean>(false);

  const handleClickAction = () => {
    if (item?.is_new) {
      markBookAsRead({ id: item?.book?.id })
        .then(({ data: { data, status } }) => {
          if (status) {
            router.push(
              kidPanelConstant.preview.path.replace(":id", item?.book?.id)
            );
          }
        })
        .catch(() => {});
    } else {
      router.push(kidPanelConstant.preview.path.replace(":id", item?.book?.id));
    }
  };
  return (
    <tr>
      <td
        className={classNames(styles.td, "ps-4 pe-2 py-3")}
        style={{ width: "30%", verticalAlign: "middle" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <img
            alt="book-cover"
            src={
              item?.book?.thumbnail
                ? item?.book?.thumbnail
                : item?.book?.cover_photo
            }
            className={classNames(styles.bookStyle)}
            role="button"
            height={40}
            width={38}
            onClick={handleClickAction}
          />

          <label
            className={classNames(styles.bookTitle)}
            role="button"
            onClick={handleClickAction}
          >
            {item?.book?.title}
          </label>

          {item?.is_new ? (
            <NewIcon className={classNames(styles.newIcon)} />
          ) : null}
        </div>
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "30%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start position-relative"
          )}
          style={{ width: "fit-content" }}
        >
          {item?.assigned_by?.map((sItm: any, inx: any) => {
            return (
              <div
                className={classNames(
                  styles.assigneeContainer,
                  "position-relative"
                )}
                style={inx !== 0 ? { marginLeft: "-10px" } : {}}
                onClick={() => {
                  setOpenSelection(!openSelection);
                }}
                role="button"
                key={inx}
              >
                <img
                  src={
                    sItm?.profile_picture
                      ? sItm?.profile_picture
                      : defaultAvatar.src
                  }
                  alt="assignee-pic"
                  className={classNames(styles.assigneeImg)}
                  key={inx}
                  height={45}
                  width={45}
                />
              </div>
            );
          })}
          {openSelection && (
            <ProgressAssigneeDropDown
              openSelection={openSelection}
              setOpenSelection={setOpenSelection}
              options={item?.assigned_by}
              isLast={index === total - 1}
              isFirst={index === 0 && total === 1}
              showNewTag
            />
          )}
        </div>
      </td>
      <td
        className={classNames("px-2 py-3")}
        style={{ width: "20%", verticalAlign: "middle" }}
      >
        {item?.is_complete ? (
          <div className={classNames(styles.statusContainer)}>
            <label className={classNames(styles.statusLabel)}>Completed</label>
          </div>
        ) : item?.page_no === 0 ? (
          <div
            className={classNames(styles.statusContainer)}
            style={{ backgroundColor: "#FEF3F2" }}
          >
            <label
              className={classNames(styles.statusLabel)}
              style={{ color: "#B42318" }}
            >
              Not Yet Started
            </label>
          </div>
        ) : (
          <div
            className={classNames(styles.statusContainer)}
            style={{ backgroundColor: "#FFFAEB" }}
          >
            <label
              className={classNames(styles.statusLabel)}
              style={{ color: "#B54708" }}
            >
              {Math.trunc(percentage(item?.page_no, item?.book?.total_pages))}%
              Completed
            </label>
          </div>
        )}
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ width: "20%" }}
      >
        {item?.is_quiz ? (
          <>
            {item?.quiz?.is_complete
              ? Math.trunc(item?.quiz?.score) + "% Marks"
              : "Incomplete"}
          </>
        ) : (
          "No"
        )}
      </td>
    </tr>
  );
};

const TableRowLoader = () => {
  return (
    <tr>
      <td
        className={classNames(styles.td, "ps-4 pe-2 py-3")}
        style={{ maxWidth: "40%", verticalAlign: "middle" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.bookStyle)} />
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "30%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start w-100"
          )}
        >
          {Array.from(Array(4).keys())?.map((sItm: any, inx: any) => {
            return (
              <BoxLoader
                iconStyle={classNames(styles.assigneeContainer)}
                style={inx !== 0 ? { marginLeft: "-10px" } : {}}
              />
            );
          })}
        </div>
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ maxWidth: "15%" }}
      >
        <BoxLoader iconStyle={classNames(styles.statusContainer)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ maxWidth: "15%" }}
      >
        <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
      </td>
    </tr>
  );
};

export default Progress;
