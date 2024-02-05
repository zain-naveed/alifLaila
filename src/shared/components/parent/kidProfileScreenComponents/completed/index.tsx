import {
  ChevDownIcon,
  DefaultBookImg,
  SearchIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import useDebounce from "shared/customHook/useDebounce";
import ProgressAssigneeDropDown from "shared/dropDowns/progressAssignees";
import BoxLoader from "shared/loader/box";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { getkidProgress } from "shared/services/parent/kidService";
import { TabsEnums } from "shared/utils/pageConstant/parent/kidProfileConstants";
import styles from "./style.module.scss";

interface Props {
  progress: any;
}

const Completed = ({ progress }: Props) => {
  const router = useRouter();
  const [list, setList] = useState<any>(progress?.data);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(progress?.total);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);

  const handleGetPendingProgress = () => {
    setLoading(true);
    let obj = {
      sort_by: "complete",
      search: searchVal,
    };
    getkidProgress(obj, currentPage, router?.query?.id)
      .then(
        ({
          data: {
            data: { data, total },
            message,
            status,
          },
        }) => {
          if (status) {
            setList(data);
            setTotalPage(total);
          }
        }
      )
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!initial) {
      handleGetPendingProgress();
    }
  }, [searchVal]);

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  return (
    <div className={classNames(styles.tableMain, "mb-4")}>
      <div
        className={classNames(
          "d-flex align-items-start gap-3 align-items-sm-center justify-content-between flex-column flex-sm-row px-4 py-4",
          styles.bookWrapper
        )}
      >
        <div className={classNames("d-flex flex-column align-items-start")}>
          <Heading
            heading="Completed Books"
            headingStyle={styles.bookMainHeading}
          />
          <Title
            title="Completed Books by kids"
            titleStyle={styles.bookMainTitle}
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-md-row align-items-start align-items-md-center  justify-content-between gap-3"
          )}
        >
          <div className={classNames(styles.searchContainer, "px-3")}>
            <SearchIcon className={classNames(styles.searchIcon)} />
            <input
              className={classNames(styles.searchInput, "ms-1")}
              placeholder="Search By Name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <CustomButton
            title="Assign Book"
            containerStyle={classNames(styles.buttonMain)}
            onClick={() => {
              router.push({
                pathname: parentPanelConstant.kidProfile.path.replace(
                  ":id",
                  String(router?.query?.id)
                ),
                query: { keyword: TabsEnums.assign },
              });
            }}
          />
        </div>
      </div>
      <CustomTable
        title="Completed Books"
        heads={["Book Name", "Assigned By", "Quiz Score", "Status"]}
        isEmpty={list?.length === 0 && !loading}
        loading={loading}
      >
        {loading ? (
          <>
            {Array.from(Array(5).keys()).map((itm, inx) => {
              return <TableRowLoader key={inx} />;
            })}
          </>
        ) : (
          <>
            {list?.map((itm: any, inx: number) => {
              return (
                <TableRow
                  index={inx}
                  key={inx}
                  total={list?.length}
                  item={itm}
                />
              );
            })}
          </>
        )}
      </CustomTable>
      <Pagination
        className={styles.paginationBar}
        currentPage={currentPage}
        totalCount={totalPage}
        pageSize={10}
        onPageChange={(page: any) => setCurrentPage(page)}
      />
    </div>
  );
};

const TableRow = ({ index, total, item }: any) => {
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <img
              alt="book-cover"
              src={
                item?.book?.cover_photo
                  ? item?.book?.cover_photo
                  : DefaultBookImg.src
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

        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start w-100 position-relative"
            )}
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
              />
            )}
          </div>
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
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
        <td className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}>
          <div className={classNames(styles.statusContainer)}>
            <label className={classNames(styles.statusLabel)}>Completed</label>
          </div>
        </td>
      </tr>
    </>
  );
};

const TableRowLoader = () => {
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <BoxLoader iconStyle={classNames(styles.bookCover)} />
            <BoxLoader iconStyle={classNames(styles.labelLoader)} />
          </div>
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
        <td className={classNames(styles.tableContentLabel, "px-2 py-3")}>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start w-100 position-relative"
            )}
          >
            {Array.from(Array(3).keys())?.map((sItm: any, inx: any) => {
              return (
                <BoxLoader iconStyle={classNames(styles.assigneeContainer)} />
              );
            })}
          </div>
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          <BoxLoader iconStyle={classNames(styles.labelLoader)} />
        </td>
      </tr>
    </>
  );
};

export default Completed;
