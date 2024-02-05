import { LoadingAnimation, NoProductIcon } from "assets";
import classNames from "classnames";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Animation from "shared/components/common/animation";
import BookPriceCard from "shared/components/common/bookPriceCard";
import CartBookCard from "shared/components/common/cartBookCard";
import CardQuantity from "shared/components/common/cartQuantity";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import Footer from "shared/components/footer";
import CheckoutCard from "shared/components/kid/checkoutCard";
import ReaderNavWrapper from "shared/components/navWrapper/reader";

import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import PublishingHouse from "shared/components/common/publishingHouse";
import { useScroll } from "shared/customHook/useScoll";
import { setCartSlice } from "shared/redux/reducers/cartSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import {
  decreaseQuantity,
  getCartList,
  increaseQuantity,
  removefromCart,
} from "shared/services/kid/cartService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { kidAccountRole } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import { cartHeadingConstant } from "shared/utils/pageConstant/kid/cartConstant";
import styles from "./style.module.scss";

function Cart({
  cartList,
  suggestion,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const {
    cart: { count },
  } = useSelector((state: any) => state.root);
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role ?? undefined;
  const router = useRouter();
  const suggestedBooks = suggestion?.data;
  const bodyRef = useRef<any>(null);
  const [cart, setCartList] = useState<any>(cartList?.data);
  const [quantityLoader, setQuantityLoader] = useState<boolean>(false);

  const handleGetCartList = () => {
    getCartList()
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setCartList(data);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setQuantityLoader(false);
      });
  };

  const handleIncrement = (id: any) => {
    setQuantityLoader(true);
    increaseQuantity(id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          handleGetCartList();
        } else {
          toastMessage("error", message);
          setQuantityLoader(false);
        }
      })
      .catch((err) => {
        setQuantityLoader(false);
      });
  };

  const handleDecrement = (id: any) => {
    setQuantityLoader(true);
    decreaseQuantity(id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          handleGetCartList();
        } else {
          toastMessage("error", message);
          setQuantityLoader(false);
        }
      })
      .catch((err) => {
        setQuantityLoader(false);
      });
  };

  const handleRemoveFromCart = (id: any) => {
    setQuantityLoader(true);
    removefromCart(id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          handleGetCartList();
          dispatch(setCartSlice({ count: count - 1 }));
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {});
  };

  useScroll(bodyRef);

  return (
    <>
      {quantityLoader ? <Animation animaton={LoadingAnimation} /> : null}
      <ReaderNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          <label className={classNames(styles.viewCartHeading, "my-5")}>
            Your Cart
          </label>
          <div className={classNames(styles.cartDetailMain)}>
            {cart?.cart?.length > 0 ? (
              <>
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-between px-4",
                    "mb-3",
                    styles.cartContent
                  )}
                >
                  {cartHeadingConstant.map(
                    (
                      item: {
                        heading: string;
                      },
                      inx
                    ) => {
                      return (
                        <div
                          key={inx}
                          className={classNames(
                            inx == 0
                              ? styles.card_FirstHeading
                              : styles.card_OtherHeading
                          )}
                        >
                          <label className={classNames(styles.cartHeading)}>
                            {item?.heading}
                          </label>
                        </div>
                      );
                    }
                  )}
                </div>
                <div
                  className={classNames(
                    "d-flex flex-column",
                    styles.cartContent
                  )}
                >
                  {cart?.cart?.map((item: any, inx: number) => {
                    return (
                      <div
                        className={classNames(
                          (inx + 1) % 3 == 0 || inx + 1 == 1
                            ? styles.itemContainer
                            : styles.itemContainer2
                        )}
                        key={inx}
                      >
                        <div
                          className={classNames("d-flex flex-column gap-2 p-4")}
                        >
                          <div className={classNames(styles.publisherName)}>
                            By{" "}
                            <span>
                              <PublishingHouse item={item} />
                            </span>
                          </div>
                          <div className={classNames(styles.shipCharges)}>
                            Shipping Charges: Rs.
                            {item?.shipping_cost}
                          </div>
                        </div>
                        {item?.items?.map((sItem: any, sinx: number) => {
                          return (
                            <div key={sinx}>
                              <div
                                className={classNames(
                                  "d-flex w-100 align-items-center justify-content-between px-4",
                                  item?.items?.length - 1 == sinx ? "pb-4" : ""
                                )}
                              >
                                <div
                                  className={classNames(
                                    styles.card_FirstHeading
                                  )}
                                >
                                  <CartBookCard
                                    user_id={sItem?.user_id}
                                    added_by={sItem?.added_by}
                                    item={sItem?.book}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                    isParentKid={
                                      kid_role === kidAccountRole.family
                                    }
                                  />
                                </div>
                                <div
                                  className={classNames(
                                    styles.card_OtherHeading
                                  )}
                                >
                                  <CardQuantity
                                    value={sItem?.quantity}
                                    containerStyle={styles.cartContainer}
                                    iconStyle={styles.quantityIconStyle}
                                    cartValueStyle={styles.cartValue}
                                    increment={() => {
                                      handleIncrement(sItem?.book?.id);
                                    }}
                                    decrement={() =>
                                      handleDecrement(sItem?.book?.id)
                                    }
                                  />
                                </div>
                                <div
                                  className={classNames(
                                    styles.card_OtherHeading
                                  )}
                                >
                                  <span
                                    className={classNames(styles.priceLabel)}
                                  >
                                    Rs.{Math.trunc(sItem?.book?.price)}
                                  </span>
                                </div>
                                <div
                                  className={classNames(
                                    styles.card_OtherHeading
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      styles.totalBookPrice
                                    )}
                                  >
                                    Rs.
                                    {Math.trunc(
                                      Number(sItem?.book?.price) *
                                        Number(sItem?.quantity)
                                    )}
                                  </span>
                                </div>
                              </div>
                              {item?.items?.length - 1 != sinx ? (
                                <hr className={classNames(styles.headingRow)} />
                              ) : item?.items?.length - 1 != sinx &&
                                cart?.cart?.length - 1 !== inx ? (
                                <hr className={classNames(styles.headingRow)} />
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <NoContentCard
                  customContainer={classNames(
                    "gap-0 d-flex flex-column align-items-center my-5"
                  )}
                  Icon={NoProductIcon}
                  label1="No Products Found"
                  label2="There is no Product available in the “Cart” page"
                />
              </>
            )}
          </div>
        </div>
        <div
          className={classNames(
            styles.customContainer,
            "d-flex flex-md-row flex-column justify-content-md-end my-5 px-3 px-sm-0 gap-5 gap-md-0 w-100"
          )}
        >
          {/* <div
            className={classNames(
              "d-flex align-items-start justify-content-center col-md-6 col-12 p-0 m-0"
            )}
          >
            <div
              className={classNames(
                styles.checkoutLeftContainer,
                "d-flex flex-column align-items-start justify-content-between gap-3 w-100"
              )}
            >
              {cartListLoading ? (
                <>
                  <BoxLoader
                    iconStyle={classNames(styles.couponHeadingLoader)}
                  />
                  <BoxLoader
                    iconStyle={classNames(styles.discountTitleLoader)}
                  />
                  <BoxLoader
                    iconStyle={classNames(styles.couponInputContainerLoader)}
                  />
                </>
              ) : (
                <>
                  {cart?.cart?.length > 0 ? (
                    <>
                      <label className={classNames(styles.couponHeading)}>
                        Have a coupon?
                      </label>
                      <span className={classNames(styles.discountTitle)}>
                        Add your code for an instant cart discount
                      </span>
                      <div
                        className={classNames(
                          styles.couponInputContainer,
                          "gap-2 px-3"
                        )}
                      >
                        <input
                          type="text"
                          placeholder="Enter code"
                          className={classNames(styles.couponInput)}
                        />
                        <label className={classNames(styles.applyBtn)}>
                          Apply
                        </label>
                      </div>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div> */}

          {kid_role !== undefined && kid_role === kidAccountRole?.individual ? (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-center col-md-6 col-12 p-0 m-0"
              )}
            >
              {cart?.cart?.length > 0 ? (
                <CheckoutCard
                  total={cart?.total_subtotals}
                  totalShippig={cart?.total_shipping_costs}
                  handleAction={() => {
                    router.push(kidPanelConstant.checkout.path);
                  }}
                  kid_role={kid_role}
                />
              ) : null}
            </div>
          ) : (
            kid_role === undefined && (
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center col-md-6 col-12 p-0 m-0"
                )}
              >
                {cart?.cart?.length > 0 ? (
                  <CheckoutCard
                    total={cart?.total_subtotals}
                    totalShippig={cart?.total_shipping_costs}
                    handleAction={() => {
                      router.push(kidPanelConstant.checkout.path);
                    }}
                    kid_role={kid_role}
                  />
                ) : null}
              </div>
            )
          )}
        </div>
        {suggestedBooks?.length > 0 ? (
          <div
            className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          >
            <label
              className={classNames(styles.bookSuggestedHeading, "mt-4 mb-4")}
            >
              You Might Also Want To Buy
            </label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start flex-wrap mt-4 position-relative",
                styles.bookListContainer
              )}
              id="cart-suggested-book-list"
            >
              {suggestedBooks?.map((item: any, indx: any) => {
                return (
                  <BookPriceCard
                    item={item}
                    key={indx}
                    index={indx}
                    parentElementId="cart-suggested-book-list"
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        <Footer />
      </div>
    </>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const [cartRes, suggestionRes] = await Promise.all([
    fetch(BaseURL + Endpoint.kid.cart.list, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),

    fetch(BaseURL + Endpoint.kid.book.hardCopySuggestion + `?take=5`, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
  ]);
  const [cartList, suggestion] = await Promise.all([
    cartRes.json(),
    suggestionRes.json(),
  ]);
  return { props: { cartList, suggestion, user: req?.cookies?.user } };
});

export default Cart;
