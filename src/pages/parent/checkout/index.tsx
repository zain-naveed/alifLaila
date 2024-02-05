import {
  ChevDownIcon,
  ChevUpIcon,
  DefaultBookImg,
  NoProductIcon,
} from "assets";
import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import OrderSuccessModal from "shared/modal/orderSuccess";
import { resetCart } from "shared/redux/reducers/cartSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { checkout } from "shared/services/kid/cartService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { TabsEnums } from "shared/utils/pageConstant/parent/settingsConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/common/toast";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { withError } from "shared/utils/helper";
import PublishingHouse from "shared/components/common/publishingHouse";

function Checkout({
  cartList,
  address,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart: any = cartList?.data;
  const userAddress: any = address?.data;
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleCheckout = () => {
    setCheckoutLoading(true);
    checkout()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          handleShowModal();
          dispatch(resetCart());
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setCheckoutLoading(false);
      });
  };

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Checkout",
            action: () => {
              router.push(parentPanelConstant.checkout.path);
            },
          },
        ],
      })
    );
  }, []);

  return (
    <>
      <DashboardWraper navigationItems={parentPathConstants}>
        {cart?.cart?.length > 0 ? (
          <div
            className={classNames(
              "d-flex flex-column align-items-start justify-content-between w-100 gap-4"
            )}
          >
            <div className={classNames(styles.leftContainer, "pb-4")}>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between px-3 py-4 w-100"
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start justify-content-center w-100"
                  )}
                >
                  <label className={classNames(styles.label1)}>
                    Deliver to
                  </label>
                  <label className={classNames(styles.addressLabel)}>
                    {userAddress?.full_address}
                  </label>
                </div>

                <label
                  className={classNames(styles.editLabel)}
                  onClick={() => {
                    router?.push({
                      pathname: parentPanelConstant.setting.path,
                      query: { keyword: TabsEnums.address },
                    });
                  }}
                >
                  {userAddress ? "Edit" : "Add"}
                </label>
              </div>
              <div className={classNames(styles.seperator)} />
              {cart?.cart?.map((itm: any, inx: any) => {
                return (
                  <div key={inx} className={classNames("w-100")}>
                    <OrderCard item={itm} key={inx} />
                    <div className={classNames(styles.seperator)} />
                  </div>
                );
              })}
            </div>
            <div
              className={classNames(
                "d-flex flex-column flex-md-row gap-4 align-items-start justify-content-between w-100"
              )}
            >
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-between w-100 gap-3",
                  styles.couponContainer
                )}
              >
                <div
                  className={classNames(
                    "d-flex flex-column align-items-start gap-2"
                  )}
                >
                  <label className={classNames(styles.couponTitle)}>
                    Have a coupon?
                  </label>
                  <label className={classNames(styles.couponSubTitle)}>
                    Add your code for an instant cart discount
                  </label>
                </div>

                <div
                  className={classNames(styles.couponInputContainer, "px-3")}
                >
                  <input
                    placeholder="Enter code"
                    className={classNames(styles.couponInput)}
                  />
                  <label className={classNames(styles.applyBtn)}>Apply</label>
                </div>
              </div>
              <div className={classNames(styles.summaryContainer, "px-4")}>
                <div className={classNames("w-100 d-flex flex-column gap-3")}>
                  <label className={classNames(styles.couponTitle)}>
                    Cart summary
                  </label>
                  <div className={classNames(styles.shipContainer, "px-3")}>
                    <label className={classNames(styles.subtotalLabel)}>
                      Shipping Cost
                    </label>
                    <label className={classNames(styles.subtotalLabel)}>
                      Rs.{Math.trunc(cart?.total_shipping_costs)}
                    </label>
                  </div>
                </div>
                <div className={classNames("w-100 d-flex flex-column gap-3")}>
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between"
                    )}
                  >
                    <label className={classNames(styles.subtotalLabel)}>
                      Subtotal
                    </label>
                    <label className={classNames(styles.price1)}>
                      Rs.{Math.trunc(cart?.total_subtotals)}
                    </label>
                  </div>
                  <div className={classNames(styles.seperator2)} />
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between"
                    )}
                  >
                    <label className={classNames(styles.price2)}>Total</label>
                    <label className={classNames(styles.price2)}>
                      Rs.
                      {Number(cart?.total_subtotals) +
                        Number(cart?.total_shipping_costs)}
                    </label>
                  </div>
                </div>
                <CustomButton
                  loading={checkoutLoading}
                  disabled={checkoutLoading}
                  title="Place Order"
                  containerStyle={classNames(styles.btnStyle)}
                  onClick={handleCheckout}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={classNames(styles.noContentContainer)}>
            <NoContentCard
              Icon={NoProductIcon}
              label1="No Products Found"
              label2="There is no Product available in the Checkout page"
            />
          </div>
        )}

        <OrderSuccessModal
          show={showSuccessModal}
          handleClose={handleCloseModal}
        />
      </DashboardWraper>
    </>
  );
}

const OrderCard = ({ item }: any) => {
  const [showDetail, setShowDetail] = useState<boolean>(false);
  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-start justify-content-between px-3 w-100 py-4",
        styles.orderContainer
      )}
      style={showDetail ? { background: "#F6F9FC" } : {}}
    >
      <div
        className={classNames(
          "d-flex flex-column align-items-start justify-content-between w-100 gap-2"
        )}
        role="button"
        onClick={() => {
          setShowDetail(!showDetail);
        }}
      >
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100"
          )}
        >
          <label className={classNames(styles.pubName)} role="button">
            By <PublishingHouse item={item} />
          </label>
          {showDetail ? (
            <ChevUpIcon className={classNames(styles.chevIcon)} />
          ) : (
            <ChevDownIcon className={classNames(styles.chevIcon)} />
          )}
        </div>
        <div className={classNames("d-flex align-items-center gap-3")}>
          <label className={classNames(styles.shippingCostLabel)} role="button">
            Shipping Charges: Rs.{Math.trunc(item?.shipping_cost)}
          </label>
          <label className={classNames(styles.label1)} role="button">
            {item?.items?.length ? item?.items?.length : 0} Book
            {item?.items?.length > 1 ? "s" : ""}
          </label>
        </div>
      </div>
      {showDetail ? (
        <>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between w-100 px-2 py-3 mt-4"
            )}
          >
            <label
              className={classNames(
                styles.detailTitle,
                styles.firstDetailTitle
              )}
            >
              Books
            </label>

            <label
              className={classNames(
                styles.detailTitle,
                styles.otherDetailTitle
              )}
            >
              Qty
            </label>
            <label
              className={classNames(
                styles.detailTitle,
                styles.otherDetailTitle
              )}
            >
              Price
            </label>
          </div>
          <div className={classNames(styles.seperator)} />
          {item?.items?.map((sItm: any, sInx: any) => {
            return (
              <>
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-between w-100 px-2 py-3"
                  )}
                >
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-start gap-2",
                      styles.firstDetailTitle
                    )}
                  >
                    <object
                      data={sItm?.book?.cover_photo}
                      type="image/png"
                      className={classNames(styles.bookImg, "pointer")}
                    >
                      <Image
                        alt="book-img"
                        className={classNames(styles.bookImg)}
                        src={DefaultBookImg}
                        height={56}
                        width={52}
                      />
                    </object>

                    <label className={classNames(styles.bookTitle)}>
                      {sItm?.book?.title}
                    </label>
                  </div>
                  <label
                    className={classNames(
                      styles.label1,
                      styles.otherDetailTitle
                    )}
                  >
                    {sItm?.quantity}
                  </label>
                  <label
                    className={classNames(
                      styles.detailPrice,
                      styles.otherDetailTitle
                    )}
                  >
                    Rs. {Math.trunc(sItm?.book?.price)}
                  </label>
                </div>
                {sInx !== item?.items?.length - 1 ? (
                  <div className={classNames(styles.seperator)} />
                ) : null}
              </>
            );
          })}
        </>
      ) : null}
    </div>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const [cartRes, addressRes] = await Promise.all([
    fetch(BaseURL + Endpoint.kid.cart.list, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),

    fetch(BaseURL + Endpoint.kid.user.getAddress, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      cache: "no-cache",
    }),
  ]);
  const [cartList, address] = await Promise.all([
    cartRes.json(),
    addressRes.json(),
  ]);
  return { props: { cartList, address } };
});

export default Checkout;
