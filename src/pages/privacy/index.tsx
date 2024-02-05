import classNames from "classnames";
import React, { useRef } from "react";
import Footer from "shared/components/footer";
const NavWrapper = dynamic(() => import("shared/components/navWrapper"), {
  ssr: false,
});
import styles from "./style.module.scss";
import TermsHeaderSection from "shared/components/common/termsHeaderSection";
import dynamic from "next/dynamic";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import { InferGetServerSidePropsType } from "next";
import moment from "moment";
import NoContentCard from "shared/components/common/noContentCard";

const Privacy = ({
  resp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <NavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <TermsHeaderSection
          label="Privacy Policy"
          subtitle="Your privacy is important to us at Alif Laila. We respect your privacy regarding any information we may collect from you across our website."
        />
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 mt-4 w-100"
          )}
        >
          <div className={classNames(styles.contentContainer)}>
            {resp?.data?.content ? (
              <>
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-start gap-2 mb-3"
                  )}
                >
                  <label className={classNames(styles.updatedTitle)}>
                    Last update at:
                  </label>
                  <label className={classNames(styles.updatedSubTitle)}>
                    {moment(resp?.data?.updated_at).format("D MMM YYYY")}
                  </label>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: resp?.data?.content }}
                />
              </>
            ) : (
              <NoContentCard
                label1="No Data found"
                label2="There is no privacy available"
              />
            )}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async () => {
  const response = await fetch(BaseURL + Endpoint.general.privacy);
  const resp = await response.json();

  return { props: { resp } };
});

export default Privacy;
