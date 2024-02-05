import { LocationIcon, PhoneIcon, defaultAvatar } from "assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Status from "shared/components/common/status";
import { toastMessage } from "shared/components/common/toast";
import BoxLoader from "shared/loader/box";
import RejectOrderModal from "shared/modal/rejectOrder";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import {
  GetOrderDetail,
  updateOrderStatus,
} from "shared/services/publisher/orderService";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "../style.module.scss";
import { roles } from "shared/utils/enum";
import { InferGetServerSidePropsType } from "next";

function OrderDetail({
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const [orderDetail, setOrderDetail] = useState<any>([]);
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const totalWeightCalculator = (item: any) => {
    let total: number = 0;
    for (let k = 0; k < item?.order_items?.length; k++) {
      total += item?.order_items[k]?.total_weight;
    }
    setTotalWeight(total);
  };

  const handleShowRejectModal = () => {
    setShowRejectModal(true);
  };

  const handleCloseRejectModal = () => {
    setShowRejectModal(false);
  };

  const handleGetOrderDetail = () => {
    setLoading(true);
    GetOrderDetail(router.query.id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setOrderDetail(data);
          totalWeightCalculator(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateStatus = (statuss: any) => {
    setUpdateLoading(true);
    updateOrderStatus({ order_id: orderDetail?.id, status: statuss })
      .then(({ data: { data, message, status } }) => {
        if (status) {
          let temp = { ...orderDetail };
          temp["status"] = statuss;
          setOrderDetail(temp);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  useEffect(() => {
    if (router.query.id) {
      handleGetOrderDetail();
    }
  }, [router.query.id]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Order Details",
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
      <div
        className={classNames(
          "d-flex flex-column flex-lg-row justify-content-evenly gap-4"
        )}
      >
        {loading ? (
          <>
            <div className={classNames("col-12 col-lg-8")}>
              <BoxLoader
                iconStyle={classNames(styles.orderDetailContainerLaoder)}
              />
            </div>
            <div className={classNames("col-12 col-lg-4")}>
              <BoxLoader
                iconStyle={classNames(styles.customerDetailContainerLoader)}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className={classNames(
                styles.orderDetailContainer,
                "col-12 col-lg-8"
              )}
            >
              <div
                className={classNames(
                  "px-4 py-4 d-flex flex-column gap-4 align-items-center"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-column align-items-center justify-content-center gap-3"
                  )}
                >
                  <img
                    className={classNames(styles.profileImg)}
                    src={
                      orderDetail?.user?.profile_picture
                        ? orderDetail?.user?.profile_picture
                        : defaultAvatar.src
                    }
                    alt="order detail"
                    height={81}
                    width={81}
                  />
                  <label className={classNames(styles.profileLabel)}>
                    {orderDetail?.user?.full_name}
                  </label>
                </div>
                <div
                  className={classNames(
                    styles.orderSummaryContainer,
                    "d-flex flex-row align-items-center justify-content-around"
                  )}
                >
                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    <label className={classNames(styles.labelHeading)}>
                      Order ID
                    </label>
                    <label className={classNames(styles.labelText)}>
                      {orderDetail?.order_id}
                    </label>
                  </div>

                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    <label className={classNames(styles.labelHeading)}>
                      Total Weight
                    </label>
                    <label className={classNames(styles.labelText)}>
                      {totalWeight} kg
                    </label>
                  </div>

                  <div
                    className={classNames(
                      "d-flex flex-column align-items-start justify-content-between gap-2"
                    )}
                  >
                    <label className={classNames(styles.labelHeading)}>
                      Status
                    </label>
                    <Status status={orderDetail?.status} />
                  </div>
                </div>
              </div>
              <div className={classNames(styles.separator)}></div>

              <div
                className={classNames(
                  styles.orderDetailsContainer,
                  "d-flex flex-column align-items-center justify-content-center"
                )}
              >
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-around px-4",
                    styles.orderDetailsHeading
                  )}
                >
                  <label
                    className={classNames(styles.orderDetailsLabel)}
                    style={{ width: "50%", textAlign: "left" }}
                  >
                    Books
                  </label>
                  <label
                    className={classNames(styles.orderDetailsLabel)}
                    style={{ width: "25%" }}
                  >
                    Qty
                  </label>
                  <label
                    className={classNames(styles.orderDetailsLabel)}
                    style={{ width: "25%" }}
                  >
                    Price
                  </label>
                </div>
                {orderDetail?.order_items?.map((itm: any, inx: any) => {
                  return (
                    <div
                      className={classNames(
                        "d-flex  align-items-center justify-content-around px-4",
                        styles.orderDetailsItems
                      )}
                      key={inx}
                    >
                      <div
                        className={classNames(styles.bookContainer, "gap-2")}
                        style={{ width: "50%", textAlign: "left" }}
                      >
                        <div className={classNames(styles.imageContainer)}>
                          <img
                            src={itm?.book?.cover_photo}
                            alt="order detail"
                            className={classNames(styles.bookThumbnail)}
                            height={56}
                            width={52}
                          />
                        </div>
                        <label className={classNames(styles.bookTitle)}>
                          {itm?.book?.title}
                        </label>
                      </div>
                      <label
                        className={classNames(styles.bookQtyLabel)}
                        style={{ width: "25%" }}
                      >
                        {itm?.quantity}
                      </label>
                      <label
                        className={classNames(styles.bookPriceLabel)}
                        style={{ width: "25%" }}
                      >
                        Rs. {itm?.total_price}
                      </label>
                    </div>
                  );
                })}
              </div>

              <div
                className={classNames(
                  styles.orderPriceContainer,
                  "d-flex flex-row align-items-center justify-content-between py-5 px-3"
                )}
              >
                <label className={classNames(styles.orderPriceLabel)}>
                  Total
                </label>
                <label className={classNames(styles.orderPriceTotal)}>
                  Rs. {orderDetail?.total_amount}
                </label>
              </div>
              {orderDetail?.status !== 4 && orderDetail?.status !== 5 ? (
                <div
                  className={classNames(
                    styles.paddingX,
                    styles.paddingY,
                    styles.orderBorder
                  )}
                >
                  <div className="d-flex justify-content-center">
                    {orderDetail?.status === 0 ? (
                      <>
                        <CustomButton
                          title="Accept"
                          containerStyle={styles.acceptBtn}
                          onClick={() => {
                            handleUpdateStatus(1);
                          }}
                          loading={updateLoading}
                          disabled={updateLoading}
                        />
                        <CustomButton
                          title="Reject"
                          containerStyle={styles.rejectBtn}
                          onClick={handleShowRejectModal}
                        />
                      </>
                    ) : orderDetail?.status === 1 ? (
                      <CustomButton
                        title="Ship"
                        containerStyle={styles.acceptBtn}
                        onClick={() => {
                          handleUpdateStatus(2);
                        }}
                        loading={updateLoading}
                        disabled={updateLoading}
                      />
                    ) : (
                      orderDetail?.status === 2 && (
                        <CustomButton
                          title="Complete"
                          containerStyle={styles.acceptBtn}
                          onClick={() => {
                            handleUpdateStatus(4);
                          }}
                          loading={updateLoading}
                          disabled={updateLoading}
                        />
                      )
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <div
              className={classNames(
                styles.customerDetailContainer,
                "col-12 col-lg-4"
              )}
            >
              <div
                className={classNames(
                  styles.paddingX,
                  styles.paddingY,
                  styles.orderBorder,
                  "d-flex flex-column flex-xxl-row align-items-start align-items-xxl-center justify-content-between"
                )}
              >
                <Heading
                  heading="Customer Details"
                  headingStyle={styles.orderHeading}
                />
                <div
                  className={classNames("gap-2 px-2", styles.orderContainer)}
                >
                  <div className={classNames(styles.dotStyle)} />
                  <label className={classNames(styles.orderLabel)}>
                    Order ID #{orderDetail?.order_id}
                  </label>
                </div>
              </div>
              <div className={classNames(styles.paddingX, styles.paddingY)}>
                <div
                  className={classNames("d-flex align-items-center", "mb-4")}
                >
                  <img
                    src={orderDetail?.user?.profile_picture}
                    width={35}
                    height={35}
                    alt="icon"
                    className={classNames(styles.customerImg)}
                  />

                  <span className={classNames("ms-2")}>
                    {orderDetail?.destination_address ? (
                      <>
                        {orderDetail?.destination_address?.first_name +
                          " " +
                          orderDetail?.destination_address?.last_name}
                      </>
                    ) : (
                      orderDetail?.user?.full_name
                    )}
                  </span>
                </div>
                {orderDetail?.destination_address ? (
                  <>
                    <div
                      className={classNames(
                        "d-flex align-items-center",
                        "mb-4"
                      )}
                    >
                      <PhoneIcon />

                      <span className={classNames("ms-3")}>
                        {orderDetail?.destination_address?.phone}
                      </span>
                    </div>
                    <div
                      className={classNames(
                        "d-flex align-items-center",
                        "mb-2"
                      )}
                    >
                      <LocationIcon />
                      <span className={classNames("ms-3")}>
                        {orderDetail?.destination_address?.full_address}
                      </span>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
      <RejectOrderModal
        showModal={showRejectModal}
        handleClose={handleCloseRejectModal}
        order={orderDetail}
        setOrder={setOrderDetail}
      />
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      user: req?.cookies?.user,
    },
  };
});

export default OrderDetail;
