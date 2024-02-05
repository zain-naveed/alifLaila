import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import SinglePlansCard from "shared/components/common/plansCard";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";
import dynamic from "next/dynamic";
import PromotionalPlans from "shared/components/common/promotionalPlans";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { withError } from "shared/utils/helper";
const CurrentPlan = dynamic(
  () => import("shared/components/parent/plansScreenComponents/currentPlan"),
  { ssr: false }
);

const Plans = ({
  resp: { data },
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch();
  const promotionals = data?.family?.promotional
    ? [...data?.family?.promotional]
    : [];
  const regulars = data?.family?.regular ? [...data?.family?.regular] : [];
  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Membership Plans",
          },
        ],
      })
    );
  }, []);
  return (
    <DashboardWraper navigationItems={parentPathConstants}>
      {/* -------------------Header------------------- */}

      <div
        className={classNames(
          "d-flex align-items-center justify-content-between mt-3 mb-5 w-100"
        )}
      >
        <label className={classNames(styles.membershipTitle)}>
          Membership Plans
        </label>
        <CurrentPlan />
      </div>

      {/* -------------------Promotional Slider------------------- */}

      <PromotionalPlans plans={promotionals} />

      {/* -------------------Title------------------- */}

      <div
        className={classNames(
          "d-flex align-items-center justify-content-center my-5"
        )}
      >
        <label className={classNames(styles.title)}>
          For Family <span>Accounts</span>
        </label>
      </div>

      {/* -------------------Regular Plans List------------------- */}
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 350: 1, 700: 2, 992: 3, 1300: 3 }}
        className={classNames("mb-4")}
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
    </DashboardWraper>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const response = await fetch(
    BaseURL + Endpoint.general.plans + `?category=2`,
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
