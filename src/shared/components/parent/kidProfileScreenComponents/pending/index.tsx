import {
  ChevDownIcon,
  DefaultBookImg,
  SearchIcon,
  UnAssignIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import useDebounce from "shared/customHook/useDebounce";
import ProgressAssigneeDropDown from "shared/dropDowns/progressAssignees";
import BoxLoader from "shared/loader/box";
import ConfirmationModal from "shared/modal/confimation";
import { parentPanelConstant } from "shared/routes/routeConstant";
import {
  getkidProgress,
  unAssignBook,
} from "shared/services/parent/kidService";
import { roles } from "shared/utils/enum";
import { TabsEnums } from "shared/utils/pageConstant/parent/kidProfileConstants";
import styles from "./style.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setShowPlanModal } from "shared/redux/reducers/planModalSlice";

interface Props {
  progress: any;
}

const Pending = ({ progress }: Props) => {
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
      sort_by: "pending",
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
            heading="Pending Books"
            headingStyle={styles.bookMainHeading}
          />
          <Title
            title="Current Books by kids"
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
                setInitial(false);
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
        title="Pending Books"
        heads={["Book Name", "Assigned By", "Status", "Action"]}
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
                  key={itm?.id}
                  total={list?.length}
                  item={itm}
                  lists={list}
                  setList={setList}
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

const TableRow = ({ index, total, item, setList, lists }: any) => {
  const {
    login: { currentPlan },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [assignedBy, setAssignedBy] = useState<any>(item?.assigned_by);
  const [showAction, setShowAction] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleShowConfirmation = () => {
    if (!currentPlan) {
      if (!showModal) {
        dispatch(setShowPlanModal({ showModal: true }));
      }
    } else {
      setShowConfirmationModal(true);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
  };

  const handleUnAssign = () => {
    setLoading(true);

    let obj = {
      book_id: item?.book_id,
      kid_id: item?.user_id,
    };
    unAssignBook(obj)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (item?.assigned_by?.length === 1) {
            let filteredList = lists?.filter(
              (itm: any, inx: any) => itm.id !== item?.id
            );
            setList(filteredList);
          } else {
            let filterArr = item?.assigned_by.filter(
              (itm: any, inx: any) =>
                itm?.role !== roles.parent && itm?.id !== item?.id
            );
            setAssignedBy(filterArr);
          }
          handleCloseConfirmation();
          setShowAction(false);
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    let exist = item?.assigned_by.filter(
      (itm: any, inx: any) => itm?.role === roles.parent
    );
    if (exist?.length > 0) {
      setShowAction(true);
    }
  }, []);

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
            {assignedBy?.map((sItm: any, inx: any) => {
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
          <div
            className={classNames(styles.statusContainer, styles.pendingCont)}
          >
            <label
              className={classNames(styles.statusLabel, styles.pendingLabel)}
            >
              {/* Pending */}
              Not yet started
            </label>
          </div>
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle" }}
        >
          {showAction ? (
            <CustomToolTip label="Unassign Book">
              <div
                className={classNames(styles.actionContainer)}
                onClick={handleShowConfirmation}
              >
                <UnAssignIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>
          ) : null}
        </td>
      </tr>
      <ConfirmationModal
        heading="Are you sure you want to Unassign book?"
        open={showConfirmationModal}
        handleClose={handleCloseConfirmation}
        actionButtonText="Yes"
        handleSubmit={handleUnAssign}
        loading={loading}
      />
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
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
        </td>
      </tr>
    </>
  );
};
export default Pending;
