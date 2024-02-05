import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRef, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import CustomButton from "shared/components/common/customButton";
import PublicPlansCard from "shared/components/common/publicPlansCard";
import Footer from "shared/components/footer";
import NavWrapper from "shared/components/navWrapper";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import styles from "./style.module.scss";
import NoContentCard from "shared/components/common/noContentCard";
import PromotionalPlans from "shared/components/common/promotionalPlans";

const Plans = ({
  resp: { data },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);
  const [individual, setIndividual] = useState<any[]>(
    data?.individual?.regular ? [...data?.individual?.regular.slice(0, 3)] : []
  );
  const [family, setFamily] = useState<any[]>(
    data?.family?.regular ? [...data?.family?.regular.slice(0, 3)] : []
  );
  useScroll(bodyRef);

  const [showMoreIndividual, setShowMoreIndividual] = useState<boolean>(
    data?.individual?.regular?.length > 3 ? true : false
  );

  const [showMoreFamily, setShowMoreFamily] = useState<boolean>(
    data?.individual?.regular?.length > 3 ? true : false
  );

  return (
    <>
      <NavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <div className={classNames(styles.headerContainer)}>
          <div
            className={classNames(
              styles.customContainer,
              "px-3 px-sm-0 d-flex w-100"
            )}
          >
            <div
              className={classNames(
                styles.contentContainer,
                "d-flex flex-column align-items-center justify-content-center gap-3"
              )}
            >
              <label className={classNames(styles.mainHeading)}>
                <span>Membership</span> plans
              </label>
              <label className={classNames(styles.subTitle)}>
                Choose a plan that meets your preferences – take your reading
                experience to the next level.
              </label>
            </div>
          </div>
        </div>

        <div className={classNames(" mt-4")}>
          <PromotionalPlans plans={data?.promotional} isPadding />
        </div>

        {individual?.length > 0 || family?.length > 0 ? (
          <>
            {individual?.length > 0 ? (
              <div
                className={classNames(
                  styles.customContainer,
                  " px-3 px-sm-0 w-100"
                )}
              >
                <h1 className={classNames(styles.title)}>
                  For Individual Account
                </h1>
                <ResponsiveMasonry
                  columnsCountBreakPoints={{ 350: 1, 510: 2, 992: 3, 1300: 3 }}
                  className={classNames("mb-3")}
                >
                  <Masonry
                    gutter="20px"
                    className={classNames(
                      "d-flex align-items-start justify-content-center"
                    )}
                  >
                    {individual?.map((plan, inx) => {
                      return <PublicPlansCard {...plan} key={inx} />;
                    })}
                  </Masonry>
                </ResponsiveMasonry>
                {showMoreIndividual ? (
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-center"
                    )}
                  >
                    <CustomButton
                      title="See More"
                      containerStyle={classNames(styles.seeMore)}
                      onClick={() => {
                        setIndividual(data?.individual?.regular);
                        setShowMoreIndividual(false);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div
              className={classNames(
                styles.familyPlans,
                "mt-3 mt-md-4 mt-xxl-5"
              )}
            >
              {family?.length > 0 ? (
                <div
                  className={classNames(
                    styles.customContainer,
                    " px-3 px-sm-0 w-100"
                  )}
                >
                  <h1
                    className={classNames(styles.title)}
                    style={{ color: "#9A469B" }}
                  >
                    For Family Account
                  </h1>
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      350: 1,
                      510: 2,
                      992: 3,
                      1300: 3,
                    }}
                    className={classNames("mb-3")}
                  >
                    <Masonry
                      gutter="20px"
                      className={classNames(
                        "d-flex align-items-start justify-content-center"
                      )}
                    >
                      {family?.map((plan, inx) => {
                        return (
                          <PublicPlansCard {...plan} key={inx} isFamilyPlan />
                        );
                      })}
                    </Masonry>
                  </ResponsiveMasonry>
                  {showMoreFamily ? (
                    <div
                      className={classNames(
                        "d-flex align-items-center justify-content-center"
                      )}
                    >
                      <CustomButton
                        title="See More"
                        containerStyle={classNames(styles.seeMore)}
                        onClick={() => {
                          setFamily(data?.family?.regular);
                          setShowMoreFamily(false);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}
              <Footer showDownload />
            </div>
          </>
        ) : (
          <div className="mt-5">
            <NoContentCard
              label1="No Data found"
              label2="There are no plans available"
            />
            <Footer showDownload />
          </div>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const response = await fetch(BaseURL + Endpoint.general.plans, {
    next: { revalidate: 3600 },
  });
  const resp = await response.json();
  return { props: { resp } };
});

export default Plans;
