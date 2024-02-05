import {
  CatalogueIcon,
  CrossIcon,
  DefaultBookImg,
  EyeIcon,
  FilterLines,
  RepeatIcon,
  SearchIcon,
} from "assets";
import classNames from "classnames";
import moment from "moment";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Status from "shared/components/common/status";
import { featureStatus } from "shared/components/common/status/constant";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import EarningCard from "shared/components/earningCard";
import useDebounce from "shared/customHook/useDebounce";
import OptionsDropDown from "shared/dropDowns/options";
import BoxLoader from "shared/loader/box";
import ConfirmationModal from "shared/modal/confimation";
import FeatureBookModal from "shared/modal/featureBook";
import RejectionReasonModal from "shared/modal/rejectionReason";
import ViewCoverModal from "shared/modal/viewCover";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import {
  cancelRequest,
  getFeatureBookList,
  getRecentCovers,
} from "shared/services/publisher/featureService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { featureStatusEnums, roles } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";

const FeatureBook = ({
  user,
  featureListRes,
  statsData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(
    featureListRes?.data?.total
  );
  const [history, setHistory] = useState<any>(featureListRes?.data?.data);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;


  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: "All",
      Icon: null,
      action: () => {
        handleGetFeatureHistory("");
      },
    },
    {
      title: featureStatus.pending.title,
      Icon: null,
      action: () => {
        handleGetFeatureHistory(featureStatus.pending.value);
      },
    },
    {
      title: featureStatus.active.title,
      Icon: null,
      action: () => {
        handleGetFeatureHistory(featureStatus.active.value);
      },
    },
    {
      title: featureStatus.expired.title,
      Icon: null,
      action: () => {
        handleGetFeatureHistory(featureStatus.expired.value);
      },
    },
    {
      title: featureStatus.rejected.title,
      Icon: null,
      action: () => {
        handleGetFeatureHistory(featureStatus.rejected.value);
      },
    },
  ];

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  function handleGetFeatureHistory(status?: any) {
    setLoading(true);
    getFeatureBookList({
      page: currentPage,
      search: searchVal,
      status: status,
    })
      .then(({ data: { data, message, status } }) => {
        if (status) {
          if (data) {
            setTotalPage(data?.total);
            setHistory(data?.data);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setInitial(false);
        setLoading(false);
      });
  }

  useDebounce(
    () => {
      setSearchVal(search);
    },
    [search],
    800
  );

  useEffect(() => {
    if (!initial) {
      handleGetFeatureHistory();
    }
  }, [searchVal, currentPage]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Feature Books",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper
      navigationItems={
        role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      <div className="row mb-4 gap-3 gap-md-0">
        <div className={classNames("col-md-4")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Books Featured"
            price={statsData?.data?.approved?.featured}
          />
        </div>
        <div className={classNames("col-md-4")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Upcoming Featured Books"
            price={statsData?.data?.approved?.upcoming}
          />
        </div>
        <div className={classNames("col-md-4")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Pending Feature Requests"
            price={statsData?.data?.pending}
          />
        </div>
      </div>
      <div className={classNames(styles.tableMain, "my-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4",
            styles.bookWrapper
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading
              heading="All Featured Books"
              headingStyle={styles.bookMainHeading}
            />
            <Title
              title="Manage your uploaded books here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start justify-content-lg-end gap-3 flex-wrap"
            )}
          >
            <div className={classNames(styles.searchContainer, "d-flex")}>
              <SearchIcon className={classNames(styles.searchIconStyle)} />
              <input
                className={classNames(styles.searchInputStyle, "ps-2")}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setInitial(false);
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
            <CustomButton
              title="Feature New Book"
              containerStyle={classNames(styles.btnStyle)}
              onClick={handleShowModal}
            />
          </div>
        </div>
        <CustomTable
          title="All Featured Books"
          heads={[
            "Book Name",
            "Author Name",
            "Start Time",
            "End Time",
            "Status",
            "Action",
          ]}
          loading={loading}
          isEmpty={history ? history?.length < 1 : true}
        >
          {loading ? (
            <>
              {Array.from(Array(7).keys()).map((itm, inx) => {
                return <RowItemLoader key={inx} />;
              })}
            </>
          ) : (
            <>
              {history?.map((item: any, inx: number) => {
                return (
                  <RowItem
                    key={inx}
                    item={item}
                    setHistory={setHistory}
                    history={history}
                  />
                );
              })}
            </>
          )}
        </CustomTable>
        {history && history?.length > 0 ? (
          <Pagination
            className={styles.paginationBar}
            currentPage={currentPage}
            totalCount={totalPage}
            pageSize={10}
            onPageChange={(page: any) => setCurrentPage(page)}
          />
        ) : null}
      </div>
      <FeatureBookModal
        show={showModal}
        handleClose={handleCloseModal}
        setHistory={setHistory}
        history={history}
      />
    </DashboardWraper>
  );
};

const RowItem = ({ item, setHistory, history }: any) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRejectionModal, setShowRejectionModal] = useState<boolean>(false);
  const [showFeatureModal, setShowFeatureModal] = useState<boolean>(false);
  const [showCovereModal, setShowCoverModal] = useState<boolean>(false);
  const [recentLoading, setRecentLoading] = useState<boolean>(false);
  const [recentCovers, setRecentCovers] = useState<any>([]);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowRejectionModal = () => {
    setShowRejectionModal(true);
  };

  const handleCloseRejectionModal = () => {
    setShowRejectionModal(false);
  };

  const handleShowFeatureModal = () => {
    setShowFeatureModal(true);
  };

  const handleCloseFeatureModal = () => {
    setShowFeatureModal(false);
  };

  const handleShowCoverModal = () => {
    setShowCoverModal(true);
  };

  const handleCloseCoverModal = () => {
    setShowCoverModal(false);
  };

  const handleGetRecentCovers = () => {
    setRecentLoading(true);
    getRecentCovers(item?.book?.id)
      .then(({ data: { data, status } }) => {
        if (status) {
          setRecentCovers(data);
          handleShowFeatureModal();
        } else {
          toastMessage("error", "Something went wrong! Please try again later");
        }
      })
      .catch(() => {
        toastMessage("error", "Something went wrong! Please try again later");
      })
      .finally(() => {
        setRecentLoading(false);
      });
  };

  const handleCancelRequest = () => {
    setCancelLoading(true);
    cancelRequest(item?.id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          let filterArr = history?.filter(
            (i: any, ii: number) => i?.id !== item?.id
          );
          setHistory(filterArr);
          handleCloseModal();
          toastMessage("success", message);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setCancelLoading(false);
      });
  };

  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "16.667%" }}
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

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          {item?.book?.author?.name}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          {moment(item?.start_date).format("DD - MM - YYYY")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          {moment(item?.end_date).format("DD - MM - YYYY")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          {moment().isBefore(item?.start_date) ? (
            <div className={styles.scheduled}>Schduled</div>
          ) : (
            <Status status={item?.status} type="Feature" />
          )}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ width: "16.667%", verticalAlign: "center" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-3"
            )}
          >
            <CustomToolTip
              label={
                item?.status === featureStatusEnums.rejected
                  ? "View Reason"
                  : "View Cover"
              }
            >
              <div
                className={classNames(styles.actionContainer)}
                onClick={() => {
                  if (item?.status === featureStatusEnums.rejected) {
                    handleShowRejectionModal();
                  } else {
                    handleShowCoverModal();
                  }
                }}
              >
                <EyeIcon className={classNames(styles.actionIcon)} />
              </div>
            </CustomToolTip>

            {item?.status === featureStatusEnums.expired ? (
              <CustomToolTip label="Feature  Again">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleGetRecentCovers}
                >
                  {recentLoading ? (
                    <Spinner
                      animation="border"
                      size="sm"
                      style={{ color: "#9A469B" }}
                    />
                  ) : (
                    <RepeatIcon className={classNames(styles.actionIcon)} />
                  )}
                </div>
              </CustomToolTip>
            ) : null}
            {item?.status === featureStatusEnums.pending ? (
              <CustomToolTip label="Cancel">
                <div
                  className={classNames(styles.actionContainer)}
                  onClick={handleShowModal}
                >
                  <CrossIcon className={classNames(styles.actionIcon)} />
                </div>
              </CustomToolTip>
            ) : null}
          </div>
        </td>
      </tr>
      <ConfirmationModal
        heading="Are you sure you want to cancel?"
        open={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleCancelRequest}
        actionButtonText="Yes, Cancel"
        loading={cancelLoading}
      />
      <RejectionReasonModal
        reason={item?.reason}
        showModal={showRejectionModal}
        handleClose={handleCloseRejectionModal}
      />
      <FeatureBookModal
        show={showFeatureModal}
        handleClose={handleCloseFeatureModal}
        startingStep={2}
        preSelected={item?.book}
        preRecentCovers={recentCovers}
        isFirst
        setHistory={setHistory}
        history={history}
        history_id={item?.id}
      />
      <ViewCoverModal
        show={showCovereModal}
        handleClose={handleCloseCoverModal}
        cover={item?.cover_photo}
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
          style={{ verticalAlign: "middle", width: "16.667%" }}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
          >
            <BoxLoader iconStyle={classNames(styles.bookCover)} />
            <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
          </div>
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "16.667%" }}
        >
          <BoxLoader iconStyle={classNames(styles.statusLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ width: "16.667%", verticalAlign: "center" }}
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

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const [featureResp, statsRes] = await Promise.all([
    fetch(BaseURL + endpoint + Endpoint.partner.feature.getList + `?page=1`, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + endpoint + Endpoint.partner.feature.stats, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
  ]);
  const [featureListRes, statsData] = await Promise.all([
    featureResp.json(),
    statsRes.json(),
  ]);

  return { props: { user: req?.cookies?.user, featureListRes, statsData } };
});

export default FeatureBook;
