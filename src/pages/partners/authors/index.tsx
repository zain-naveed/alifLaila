import {
  CatalogueIcon,
  CoinAsset1,
  EyeIcon,
  QuestionMarkIcon,
  RemoveConfirmationIcon,
  SearchIcon,
  UserBlockIcon,
  UserCheckIcon,
  defaultAvatar,
} from "assets";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import EarningCard from "shared/components/earningCard";
import useDebounce from "shared/customHook/useDebounce";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { roles } from "shared/utils/enum";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import ConfirmationModal from "shared/modal/confimation";
import CustomToolTip from "shared/components/common/customToolTip";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import Image from "next/image";
import CustomTable from "shared/components/common/customTable";
import BoxLoader from "shared/loader/box";
import AddAuthorModal from "shared/modal/addAuthor";
import {
  activateAuthor,
  deActivateAuthor,
  getAuthorsList,
} from "shared/services/publisher/authorsService";
import { toastMessage } from "shared/components/common/toast";
import { InferGetServerSidePropsType } from "next";

function Authors({
  userCookie
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const isParentEnabled = JSON.parse(userCookie ?? '{}')?.is_partner_enabled_server;

  const [currentPage, setCurrentPage] = useState(1);
  const [authorsList, setAuthorsList] = useState<Array<any>>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowAddAuthorModal(true);
  };
  const handleCloseModal = () => {
    setShowAddAuthorModal(false);
  };

  const handleAddAction = (obj: any) => {
    let tempArr = [...authorsList];
    tempArr.unshift(obj);
    setAuthorsList(tempArr);
  };

  const handleGetAuthorsList = () => {
    getAuthorsList({ page: currentPage, search: searchVal })
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setAuthorsList(data?.data);
          setTotalPage(data?.total);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Authors",
          },
        ],
      })
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    handleGetAuthorsList();
  }, [searchVal, currentPage]);

  useDebounce(
    () => {
      setCurrentPage(1);
      setSearchVal(search);
    },
    [search],
    800
  );

  return (
    <DashboardWraper
      navigationItems={
        user?.role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      <div className="row mb-4 gap-3 gap-md-0">
        <div className={classNames("col-md-6")}>
          <EarningCard Icon={CoinAsset1} heading="Total Authors" price={0} />
        </div>
        <div className={classNames("col-md-6")}>
          <EarningCard Icon={CatalogueIcon} heading="Total Earning" price={0} />
        </div>
      </div>
      <div className={classNames(styles.tableMain, "mb-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4"
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading
              heading="Authors Lists"
              headingStyle={styles.bookMainHeading}
            />
            <Title
              title="Showing authors list here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames("d-flex flex-wrap align-items-center gap-3")}
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
            <CustomButton
              title="Add New"
              containerStyle={classNames(styles.buttonMain)}
              onClick={handleShowModal}
            />
          </div>
        </div>
        <CustomTable
          title="Authors Lists"
          heads={["Author’s Name", "Total Books", "Email", "Action"]}
          isEmpty={authorsList ? authorsList?.length === 0 : true}
          loading={loading}
        >
          {loading ? (
            <>
              {Array.from(Array(5).keys())?.map((item, inx) => {
                return <TableRowLoading key={inx} />;
              })}
            </>
          ) : (
            <>
              {authorsList?.map((item, inx) => {
                return <TableRow author={item} key={item?.id} />;
              })}
            </>
          )}
        </CustomTable>

        {authorsList ? (
          <Pagination
            className={styles.paginationBar}
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={24}
            onPageChange={(page: any) => {
              setCurrentPage(page);
            }}
          />
        ) : null}
      </div>
      <AddAuthorModal
        showModal={showAddAuthorModal}
        handleClose={handleCloseModal}
        handleAction={handleAddAction}
      />
    </DashboardWraper>
  );
}

const TableRow = ({ author }: any) => {
  const router = useRouter();
  const [item, setItem] = useState<any>(author);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setItem(author);
  }, [author?.id]);

  const handleShowConfirmation = () => {
    setShowConfirmation(true);
  };
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleActivation = () => {
    setLoading(true);
    activateAuthor(item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setItem(data);
          toastMessage("success", message);
          handleCloseConfirmation();
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

  const handleDeactivation = () => {
    setLoading(true);
    deActivateAuthor(item?.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setItem(data);
          toastMessage("success", message);
          handleCloseConfirmation();
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

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "30%" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
            role="button"
          >
            <img
              alt="kid-pic"
              src={
                item?.author?.profile_picture
                  ? item?.author?.profile_picture
                  : defaultAvatar.src
              }
              className={classNames(styles.kidAvt)}
              height={32}
              width={32}
            />
            {item?.author?.full_name}
          </div>
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "20%" }}
        >
          {item?.total_books}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "25%" }}
        >
          {item?.email}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle", width: "25%" }}
        >
          <div className={classNames("d-flex gap-2")}>
            <CustomToolTip label="View Profile">
              <div
                className={classNames(styles.actionContainer)}
                onClick={() => {
                  router.push(
                    partnersPanelConstant.authorProfile.path.replace(
                      ":id",
                      item?.id
                    )
                  );
                }}
              >
                <EyeIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>

            {item?.is_blocked ? (
              <CustomToolTip label="Activate account">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowConfirmation}
                >
                  <UserCheckIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            ) : (
              <CustomToolTip label="Deactivate account">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowConfirmation}
                >
                  <UserBlockIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            )}
          </div>
        </td>
      </tr>
      <ConfirmationModal
        heading={
          item?.is_blocked
            ? "Are you sure you want to Activate Account?"
            : "Are you sure you want to deactivate Author?"
        }
        ImageSrc={item?.is_blocked ? QuestionMarkIcon : RemoveConfirmationIcon}
        open={showConfirmation}
        handleClose={handleCloseConfirmation}
        actionButtonText={item?.is_blocked ? "Yes Activate" : "Yes Deactivate"}
        loading={loading}
        handleSubmit={item?.is_blocked ? handleActivation : handleDeactivation}
      />
    </>
  );
};

const TableRowLoading = () => {
  return (
    <tr>
      <td
        className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
        style={{ verticalAlign: "middle", width: "30%" }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-2"
          )}
          role="button"
        >
          <BoxLoader iconStyle={classNames(styles.kidAvt)} />
          <BoxLoader iconStyle={classNames(styles.titleLoader)} />
        </div>
      </td>

      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "20%" }}
      >
        <BoxLoader iconStyle={classNames(styles.titleLoader)} />
      </td>
      <td
        className={classNames(styles.tableContentLabel, "px-2 py-3")}
        style={{ width: "25%" }}
      >
        <BoxLoader iconStyle={classNames(styles.titleLoader)} />
      </td>

      <td
        className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
        style={{ verticalAlign: "middle", width: "25%" }}
      >
        <div className={classNames("d-flex gap-2")}>
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
          <BoxLoader iconStyle={classNames(styles.actionContainer)} />
        </div>
      </td>
    </tr>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      userCookie: req?.cookies?.user,
    },
  };
});

export default Authors;
