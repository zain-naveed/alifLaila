import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTable from "shared/components/common/customTable";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Rating from "shared/components/common/rating";
import BoxLoader from "shared/loader/box";
import SubmitRevisionModal from "shared/modal/submitRevision";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { getRevisions } from "shared/services/publisher/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { bookStatusEnum, roles } from "shared/utils/enum";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";

import { partnersPanelConstant } from "shared/routes/routeConstant";
import { withError } from "shared/utils/helper";
import { optionsTypes } from "shared/utils/pageConstant/partner/revisionConstant";
import styles from "./style.module.scss";

const Revisions = ({
  user,
  revisionsRes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const totalPage: number = revisionsRes?.data?.revision?.total;
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? "{}")?.is_partner_enabled_server;
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [book, setBook] = useState<any>(
    revisionsRes?.data?.book ? revisionsRes?.data?.book : null
  );
  const [response, setResponse] = useState<any>("");
  const [history, setHistory] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initial, setInitial] = useState<boolean>(true);
  const [showSubmitRevisionModal, setShowSubmitRevisionModal] =
    useState<boolean>(false);

  const handleShowSubmitRevesionModal = () => {
    setShowSubmitRevisionModal(true);
  };

  const handleCloseSubmitRevesionModal = () => {
    setShowSubmitRevisionModal(false);
  };

  const handleResponse = () => {
    const respData = revisionsRes?.data?.revision?.data;

    if (respData?.length > 0) {
      const detailReview = respData[0]?.data?.detailed_review;
      const initialReview = respData[0]?.data?.intial_review;
      const reply = respData[0]?.response;
      setResponse(reply ? reply : "");
      if (detailReview) {
        let tempArr: any = [];
        Object.keys(detailReview)?.map((itm, inx) => {
          const item = detailReview[itm];
          if (item?.checked) {
            tempArr.push(item);
          }
        });
        setHistory(tempArr);
      } else if (initialReview) {
        let tempArr: any = [];
        Object.keys(initialReview)?.map((itm, inx) => {
          const item = initialReview[itm];
          if (item?.checked) {
            tempArr.push(item);
          }
        });
        setHistory(tempArr);
      }
    }
  };

  const handleGetRevisions = () => {
    setLoading(true);
    getRevisions(router?.query?.id, currentPage)
      .then(
        ({
          data: {
            data: {
              revision: { data },
            },
            message,
            status,
          },
        }) => {
          if (status) {
            if (data?.length > 0) {
              const detailReview = data[0]?.data?.detailed_review;
              const initialReview = data[0]?.data?.intial_review;
              const reply = data[0]?.response;
              setResponse(reply ? reply : "");
              if (detailReview) {
                let tempArr: any = [];
                Object.keys(detailReview)?.map((itm, inx) => {
                  const item = detailReview[itm];
                  if (item?.checked) {
                    tempArr.push(item);
                  }
                });
                setHistory(tempArr);
              } else if (initialReview) {
                let tempArr: any = [];
                Object.keys(initialReview)?.map((itm, inx) => {
                  const item = initialReview[itm];
                  if (item?.checked) {
                    tempArr.push(item);
                  }
                });
                setHistory(tempArr);
              }
            }
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
      handleGetRevisions();
    }
  }, [currentPage]);

  useEffect(() => {
    handleResponse();
  }, []);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "My Books",
            action: () => {
              router.push(partnersPanelConstant.book.path);
            },
          },
          {
            title: book?.title,
            action: () => {
              router.push(
                partnersPanelConstant.bookPreview.path.replace(":id", book?.id)
              );
            },
          },
          {
            title: "Revisions",
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
      <div className={classNames(styles.tableMain, "my-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4",
            styles.bookWrapper
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading
              heading={`Book Revisions (${totalPage})`}
              headingStyle={styles.bookMainHeading}
            />
          </div>
          {book?.status === bookStatusEnum.revision_requested ? (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start justify-content-lg-end gap-3 flex-wrap"
              )}
            >
              <CustomButton
                title="Submit Revision"
                containerStyle={classNames(styles.btnStyle)}
                onClick={handleShowSubmitRevesionModal}
              />
            </div>
          ) : null}
        </div>
        <CustomTable
          title="Book Revisions"
          heads={["Parameter", "Response", "Comments "]}
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
                return <RowItem key={inx} item={item} />;
              })}
            </>
          )}
        </CustomTable>

        {response && !loading ? (
          <div
            className={classNames(
              "d-flex flex-column align-items-start w-100 px-3 pt-3 gap-2"
            )}
          >
            <label className={classNames(styles.respTitle)}>
              Your Response
            </label>
            <div className={classNames(styles.resp, "p-3")}>
              <p className="mb-0">{response}</p>
            </div>
          </div>
        ) : null}
        <Pagination
          className={styles.paginationBar}
          currentPage={currentPage}
          totalCount={totalPage}
          pageSize={1}
          onPageChange={(page: any) => {
            setInitial(false);
            setCurrentPage(page);
          }}
        />
      </div>
      <SubmitRevisionModal
        showModal={showSubmitRevisionModal}
        handleClose={handleCloseSubmitRevesionModal}
        book={book}
        setBook={setBook}
      />
    </DashboardWraper>
  );
};

const RowItem = ({ item }: any) => {
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "25%" }}
        >
          {item?.label}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "25%" }}
        >
          {item?.type === optionsTypes.rating ? (
            <Rating active={item?.value} changeColor={"#FDA504"} />
          ) : (
            <>{item?.option === 1 ? "Yes" : "No"}</>
          )}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ width: "50%" }}
        >
          {item?.type === optionsTypes.text ||
          item?.type === optionsTypes.rating ? (
            <p className="mb-0">{item?.comment}</p>
          ) : item?.type === optionsTypes.checklist ? (
            <>
              {item?.option === 0 ? (
                <>
                  <p className="mb-0 fw-bold">{item?.comment}</p>
                  <ul className="mb-0">
                    {item?.options
                      ?.filter((i: any) => i.value)
                      ?.map((sItm: any, inx: number) => {
                        return (
                          <li key={inx}>
                            {sItm?.name === "Others"
                              ? sItm?.comment
                              : sItm?.name}
                          </li>
                        );
                      })}
                  </ul>
                </>
              ) : null}
            </>
          ) : item?.type === optionsTypes.dropDown ? (
            <>
              {item?.option === 0 ? (
                <>
                  <p className="mb-0 fw-bold">Suggested option</p>
                  <ul className="mb-0">
                    <li>
                      {item?.selected?.name
                        ? item?.selected?.name
                        : item?.selected?.text}
                    </li>
                  </ul>
                </>
              ) : null}
            </>
          ) : null}
        </td>
      </tr>
    </>
  );
};

const RowItemLoader = () => {
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "25%" }}
        >
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "25%" }}
        >
          <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ width: "50%" }}
        >
          <div
            className={classNames("d-flex align-items-start flex-column gap-1")}
          >
            <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
            <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
            <BoxLoader iconStyle={classNames(styles.bookTitleLoader)} />
          </div>
        </td>
      </tr>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const revisionsResp = await fetch(
    BaseURL + endpoint + Endpoint.partner.book.revisions + params?.id,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const revisionsRes = await revisionsResp.json();

  return { props: { user: req?.cookies?.user, revisionsRes } };
});

export default Revisions;
