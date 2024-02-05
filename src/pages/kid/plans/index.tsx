import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRef } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import SinglePlansCard from "shared/components/common/plansCard";
import PromotionalPlans from "shared/components/common/promotionalPlans";
import Footer from "shared/components/footer";
import KidHeaderSection from "shared/components/kid/headerSection";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import styles from "./style.module.scss";

const Plans = ({
  resp: { data },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);

  const promotionals = data?.individual?.promotional
    ? [...data?.individual?.promotional]
    : [];
  const regulars = data?.individual?.regular
    ? [...data?.individual?.regular]
    : [];

  useScroll(bodyRef);

  return (
    <>
      <ReaderNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <KidHeaderSection
          title="Membership Plans"
          subTitle="Open up a world of imagination and wonder with our digital library"
          isPlans
        />
        <div className={classNames(" mt-4")}>
          <PromotionalPlans plans={promotionals} isPadding />
        </div>
        {regulars?.length > 0 ? (
          <div
            className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          >
            <div
              className={classNames(
                "d-flex align-items-center justify-content-center"
              )}
            >
              <label className={classNames(styles.title, "mt-3 mb-3")}>
                For individual <span>Account</span>
              </label>
            </div>

            <ResponsiveMasonry
              columnsCountBreakPoints={{ 350: 1, 700: 2, 992: 3, 1300: 3 }}
              className={classNames("mb-3")}
            >
              <Masonry
                gutter="20px"
                className={classNames(
                  "d-flex align-items-start justify-content-center"
                )}
              >
                {regulars?.map((item, inx) => {
                  return <SinglePlansCard plan={item} key={inx} />;
                })}
              </Masonry>
            </ResponsiveMasonry>
          </div>
        ) : null}

        <Footer showDownload />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const response = await fetch(
    BaseURL + Endpoint.general.plans + `?category=1`,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const resp = await response.json();

  return { props: { resp } };
});

export default Plans;
