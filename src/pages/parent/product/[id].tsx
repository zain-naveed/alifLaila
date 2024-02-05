import {
  BookIcon2,
  ChevDownIcon,
  DefaultBookImg,
  NoReviewIcon,
  ShopBagIcon,
  defaultAvatar,
} from "assets";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BookPriceCard from "shared/components/common/bookPriceCard";
import CardQuantity from "shared/components/common/cartQuantity";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import NoContentCard from "shared/components/common/noContentCard";
import { toastMessage } from "shared/components/common/toast";
import ReviewItem from "shared/components/kid/reviewItem";
import OptionsDropDown from "shared/dropDowns/options";
import WriteReview from "shared/modal/review";
import { setCartSlice } from "shared/redux/reducers/cartSlice";
import { kidPanelConstant } from "shared/routes/routeConstant";
import {
  getBookReviewList,
  getRatingStats,
} from "shared/services/kid/bookService";
import { addToCart, getCartCount } from "shared/services/kid/cartService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { classNames, withError } from "shared/utils/helper";
import { ReviewFilters } from "shared/utils/pageConstant/kid/productConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";
import ReviewItemLoader from "shared/loader/pageLoader/kid/reviewItemLoader";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import PublishingHouse from "shared/components/common/publishingHouse";
import { roles } from "shared/utils/enum";

function ProductDetail({
  product,
  ratingStats,
  suggestion,
  ratings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const bookDetail = product?.data;
  const [ratingCount, setRatingCount] = useState<any>(
    ratingStats?.data?.total_ratings
  );
  const [ratingAverage, setRatingAvg] = useState<any>(
    ratingStats?.data?.avg_rating
  );
  const [ratingsList, setRatingList] = useState<any>(
    ratingStats?.data?.ratings
  );
  const suggestedBooks = suggestion?.data;
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const reviewPageRef = useRef<number>(1);
  const reviewsRef = useRef<[]>([]);
  const [quantityCount, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<[]>([]);
  const [activeFilter, setActiveFilter] = useState<any>(ReviewFilters[0]);
  const [filterOptions, setFilterOptions] = useState<boolean>(false);
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [addToCartLoading, setAddToCartLoading] = useState<boolean>(false);
  const [reviewLoadMore, setReviewLoadMore] = useState<boolean>(false);
  const [openReviewModal, setReviewModal] = useState<boolean>(false);
  const [initialLoading, setInitialLaoding] = useState<boolean>(false);

  const handleCLose = () => setReviewModal(!openReviewModal);
  const openReviewModalHandler = () => setReviewModal(!openReviewModal);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: ReviewFilters[0].label,
      Icon: null,
      action: () => {
        setActiveFilter(ReviewFilters[0]);
        reviewPageRef.current = 1;
        reviewsRef.current = [];
        setInitialLaoding(true);
        handleGetReviewList(ReviewFilters[0].value);
      },
    },
    {
      title: ReviewFilters[1].label,
      Icon: null,
      action: () => {
        setActiveFilter(ReviewFilters[1]);
        reviewPageRef.current = 1;
        reviewsRef.current = [];
        setInitialLaoding(true);
        handleGetReviewList(ReviewFilters[1].value);
      },
    },
    {
      title: ReviewFilters[2].label,
      Icon: null,
      action: () => {
        setActiveFilter(ReviewFilters[2]);
        reviewPageRef.current = 1;
        reviewsRef.current = [];
        setInitialLaoding(true);
        handleGetReviewList(ReviewFilters[2].value);
      },
    },
    {
      title: ReviewFilters[3].label,
      Icon: null,
      action: () => {
        setActiveFilter(ReviewFilters[3]);
        reviewPageRef.current = 1;
        reviewsRef.current = [];
        setInitialLaoding(true);
        handleGetReviewList(ReviewFilters[3].value);
      },
    },
    {
      title: ReviewFilters[4].label,
      Icon: null,
      action: () => {
        setActiveFilter(ReviewFilters[4]);
        reviewPageRef.current = 1;
        reviewsRef.current = [];
        setInitialLaoding(true);
        handleGetReviewList(ReviewFilters[4].value);
      },
    },
  ];

  const handleGetReviewStats = () => {
    getRatingStats({
      type: 1, // 1 = hard_copy, 2 = soft_copy
      id: Number(router.query.id),
    })
      .then(({ data: { data, status } }) => {
        if (status) {
          setRatingCount(data?.total_ratings);
          setRatingAvg(data?.avg_rating);
          setRatingList(data?.ratings);
        }
      })
      .catch((err) => {});
  };

  const handleGetReviewList = (filter: string) => {
    getBookReviewList({
      type: 1, // 1 = hard_copy, 2 = soft_copy
      page: reviewPageRef.current,
      id: Number(router.query.id),
      filter: filter,
    })
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            if (data?.current_page === data?.last_page) {
              setReviewLoadMore(false);
            } else {
              setReviewLoadMore(true);
            }
            let cloneReviews: any = [...reviewsRef.current];
            cloneReviews = [...cloneReviews, ...data?.data];
            setReviews(cloneReviews);
            reviewsRef.current = cloneReviews;
          }
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setReviewLoading(false);
        setInitialLaoding(false);
      });
  };

  const handleAddToCart = () => {
    setAddToCartLoading(true);
    let formData = new FormData();
    formData.append("book_id", String(router.query.id));
    formData.append("quantity", String(quantityCount));
    addToCart(formData)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
          handleCartCount();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setAddToCartLoading(false);
      });
  };

  const handleCartCount = () => {
    getCartCount()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(setCartSlice({ count: data }));
        }
      })
      .catch((err) => {});
  };

  const handleReview = () => {
    const { data } = ratings;
    if (data) {
      reviewPageRef.current = data?.current_page;
      if (data?.current_page === data?.last_page) {
        setReviewLoadMore(false);
      } else {
        setReviewLoadMore(true);
      }
      setReviews(data?.data);
      reviewsRef.current = data?.data;
    }
  };

  useEffect(() => {
    if (router.query.id) {
      const { data, status, message } = product;
      if (!status) {
        toastMessage("error", message);
        router.push(kidPanelConstant.books.path);
      }
      handleReview();
    }
  }, [router.query.id]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Product",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper navigationItems={parentPathConstants}>
      {/* ------------------product detail section------------ */}
      <div
        className={classNames(
          "d-flex justify-content-center flex-column flex-md-row align-items-center align-items-md-start gap-5 gap-md-5 mt-4 mb-5"
        )}
      >
        <div
          className={classNames(styles.bookDetailsContainer, "px-0 px-sm-3")}
        >
          <object
            data={bookDetail?.cover_photo}
            type="image/png"
            className={classNames(styles.bookImage, "pointer")}
          >
            <Image
              src={DefaultBookImg}
              alt="Image Not Found"
              width={553}
              height={628}
              className={styles.bookImage}
            />
          </object>
        </div>
        <div className={styles.bookDetailItemContainer}>
          <div
            className={classNames(styles.seperator, "d-flex flex-column gap-3")}
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-start justify-content-start gap-2"
                )}
              >
                <BookIcon2 className={classNames(styles.bookIcon, "mt-1")} />
                <label className={classNames(styles.bookDetailHeading)}>
                  {bookDetail?.title}
                </label>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-start justify-content-start gap-1"
                )}
              >
                <img
                  src={
                    bookDetail?.partner?.role === roles.author
                      ? bookDetail?.partner?.profile_picture
                      : bookDetail?.partner?.publishing_logo
                      ? bookDetail?.partner?.publishing_logo
                      : defaultAvatar.src
                  }
                  alt="profile-avatar"
                  className={classNames(styles.pubAvatar)}
                  height={28}
                  width={28}
                />
                <label className={classNames(styles.pubName)}>
                  <PublishingHouse item={bookDetail} />
                </label>
              </div>
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              <span className={classNames(styles.bookPrice)}>
                Rs. {Math.trunc(bookDetail?.price)}
              </span>
              <p className={classNames(styles.taxDetail)}>
                Tax included. Shipping calculated at checkout.
              </p>
            </div>
          </div>

          <div
            className={classNames(
              styles.seperator,
              "d-flex align-items-center justify-content-between py-4 gap-3"
            )}
          >
            <CardQuantity
              value={quantityCount}
              increment={() => {
                setQuantity(quantityCount + 1);
              }}
              decrement={() => {
                if (quantityCount > 1) {
                  setQuantity(quantityCount - 1);
                }
              }}
            />
            <CustomButton
              title="Add to Cart"
              containerStyle={classNames(styles.bookCartBtn, "gap-2")}
              onClick={handleAddToCart}
              loading={addToCartLoading}
              IconDirction="left"
              Icon={ShopBagIcon}
              iconStyle={classNames(styles.shopIcon)}
            />
          </div>

          <div
            className={classNames(
              "d-flex align-items-center justify-content-between flex-wrap w-100 py-4 gap-3 gap-xl-4",
              styles.statContainer
            )}
          >
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.detailTitle)}>
                Age Range
              </label>
              <label className={classNames(styles.statLabel)}>
                {bookDetail?.age_range?.min}-{bookDetail?.age_range?.max}
              </label>
            </div>
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.detailTitle)}>
                No. of Pages
              </label>
              <label className={classNames(styles.statLabel)}>
                {bookDetail?.total_pages}
              </label>
            </div>
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.detailTitle)}>Quiz</label>
              <label className={classNames(styles.statLabel)}>
                {bookDetail?.is_quiz ? "Yes" : "No"}
              </label>
            </div>
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.detailTitle)}>Language</label>
              <label className={classNames(styles.statLabel)}>
                {bookDetail?.language?.name}
              </label>
            </div>
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.detailTitle)}>Genre</label>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-start gap-2 flex-wrap"
                )}
              >
                {bookDetail?.genres?.map((itm: any, inx: any) => {
                  return (
                    <label className={classNames(styles.statLabel)} key={inx}>
                      {itm?.name}
                      {inx !== bookDetail?.genres?.length - 1 ? ", " : ""}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------review section------------ */}
      <div className={classNames(styles.reviewMainContainer, "p-3 p-sm-4")}>
        <WriteCustomerReview
          Click={openReviewModalHandler}
          heading="Reviews & Ratings"
          is_purchased={bookDetail?.is_purchased}
        />
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row align-items-center justify-content-start gap-4 py-4",
            styles.ratingStatsContainer
          )}
        >
          <div
            className={classNames(
              "d-flex flex-column align-items-center justify-content-center"
            )}
          >
            <label className={classNames(styles.ratings)}>
              {ratingAverage}/5
            </label>
            <label className={classNames(styles.totalRatings)}>
              From {ratingCount} Review
              {ratingCount > 1 || ratingCount === 0 ? "s" : ""}
            </label>
          </div>
          <div className={classNames(styles.seperator3)} />
          <div
            className={classNames(
              "d-flex flex-column align-items-center justify-content-between",
              styles.h100
            )}
          >
            {Object.keys(ratingsList)
              .reverse()
              .map((itm: any, inx: number) => {
                return (
                  <RatingStat
                    ratingAverage={ratingsList[itm]?.percentage}
                    ratingCount={itm}
                    key={inx}
                  />
                );
              })}
          </div>
        </div>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100"
          )}
        >
          <label className={classNames(styles.totalRatings)}>
            {ratingCount} review
            {ratingCount > 1 || ratingCount === 0 ? "s" : ""}
          </label>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-end gap-3 position-relative"
            )}
          >
            <label className={classNames(styles.totalRatings)}>Sort by:</label>
            <div
              className={classNames(
                "d-flex align-items-center justify-content-end gap-1 "
              )}
              role="button"
              onClick={() => {
                setFilterOptions(!filterOptions);
              }}
            >
              <label className={classNames(styles.totalRatings)} role="button">
                {activeFilter?.label}
              </label>
              <ChevDownIcon className={classNames(styles.chevIcon)} />
            </div>
            <OptionsDropDown
              options={options}
              openSelection={filterOptions}
              setOpenSelection={setFilterOptions}
              customContainer={styles.optionsContainer}
            />
          </div>
        </div>
        <div className={classNames(styles.seperator2, "mt-3")} />
        {initialLoading ? (
          <>
            {Array.from(Array(4).keys()).map((i, ii) => {
              return <ReviewItemLoader key={ii} />;
            })}
          </>
        ) : (
          <>
            {reviews?.length ? (
              <>
                {reviews.map((item, index) => {
                  return <ReviewItem key={index} item={item} />;
                })}
                {reviewLoadMore ? (
                  <CustomButton
                    loading={reviewLoading}
                    title="Load More"
                    containerStyle={classNames(styles.loadMore, "mt-4")}
                    onClick={() => {
                      setReviewLoading(true);
                      reviewPageRef.current = reviewPageRef.current + 1;
                      handleGetReviewList("");
                    }}
                  />
                ) : null}
              </>
            ) : (
              <div className={classNames("mt-5")}>
                <NoContentCard
                  customContainer={
                    "d-flex flex-column align-items-center gap-3"
                  }
                  Icon={NoReviewIcon}
                  label1="No Customer Reviews"
                  label2="There is no data available in the “Customer Reviews” "
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* ------------------book Suggestion section------------ */}
      <div className={classNames("mt-5 mb-5")}>
        <label className={classNames(styles.bookSuggestedHeading)}>
          You Might Also Want To Buy
        </label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start flex-wrap mt-4 position-relative",
            isShown ? styles.bookListContainer2 : styles.bookListContainer
          )}
          id="product-suggested-book-list"
        >
          {suggestedBooks?.map((item: any, indx: any) => {
            return (
              <BookPriceCard
                item={item}
                key={indx}
                index={indx}
                parentElementId="product-suggested-book-list"
                isParentModule
              />
            );
          })}
        </div>
      </div>
      <WriteReview
        open={openReviewModal}
        handleClose={handleCLose}
        ratings={reviews}
        setRatings={setReviews}
        handleGetReviewStats={handleGetReviewStats}
      />
    </DashboardWraper>
  );
}

interface writeReview {
  heading: string;
  Click?: () => void;
  is_purchased: boolean;
}

const WriteCustomerReview = (props: writeReview) => {
  const { heading, Click, is_purchased } = props;
  return (
    <>
      <div
        className={classNames(
          "d-flex flex align-items-center justify-content-between"
        )}
      >
        <label className={classNames(styles.reviewHeading)}>{heading}</label>
        {is_purchased ? (
          <CustomButton
            title="Write review"
            onClick={Click}
            containerStyle={styles.reviewButton}
          />
        ) : null}
      </div>
    </>
  );
};

interface RatingStatProps {
  ratingCount: number;
  ratingAverage: number;
}

const RatingStat = ({ ratingCount, ratingAverage }: RatingStatProps) => {
  return (
    <div
      className={classNames(
        "d-flex  align-items-center justify-content-start gap-1"
      )}
    >
      <label className={classNames(styles.ratingLabel)}>{ratingCount}</label>
      <div className={classNames(styles.progressContainer)}>
        <div
          className={classNames(styles.achiveContainer)}
          style={{ width: `${ratingAverage}%` }}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const [productRes, ratingRes, suggestionRes, ratingsListRes] =
    await Promise.all([
      fetch(BaseURL + Endpoint.kid.book.getBook + params?.id, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(
        BaseURL +
          Endpoint.kid.book.ratingStats +
          `?book_id=${params?.id}&type=1`,
        {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          next: { revalidate: 3600 },
        }
      ),
      fetch(BaseURL + Endpoint.kid.book.hardCopySuggestion + `?take=5`, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(
        BaseURL +
          Endpoint.kid.book.bookReviewList +
          `?book_id=${params?.id}&type=1&page=1`,
        {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          next: { revalidate: 3600 },
        }
      ),
    ]);
  const [product, ratingStats, suggestion, ratings] = await Promise.all([
    productRes.json(),
    ratingRes.json(),
    suggestionRes.json(),
    ratingsListRes.json(),
  ]);
  return { props: { product, ratingStats, suggestion, ratings } };
});

export default ProductDetail;
