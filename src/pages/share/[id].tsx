import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef } from "react";
import NoContentCard from "shared/components/common/noContentCard";
import MainNavWrapper from "shared/components/navWrapper/main";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import styles from "./style.module.scss";
import { badgesTypes } from "shared/utils/enum";

const SharePage = ({
  resp,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const badgeDetail = resp?.data;
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <Head>
        <meta
          property="og:title"
          content={
            badgeDetail?.type === badgesTypes.reading_streak
              ? `I earned This badge by completing ${badgeDetail?.name}`
              : badgeDetail?.type === badgesTypes.super_reader
              ? `I earned This badge by becoming a ${badgeDetail?.name}`
              : badgeDetail?.type === badgesTypes.quiz_whiz
              ? `I earned This badge by completing Quiz Challenges`
              : "I earned This badge by becoming Genre Guru"
          }
        />
        <meta property="og:description" content={badgeDetail?.description} />
        <meta property="og:image" content={badgeDetail?.image} />
      </Head>
      <MainNavWrapper />
      <div className={classNames(styles.topContainer)} ref={bodyRef}>
        {badgeDetail ? (
          <div
            className={classNames(
              styles.badgeContainer,
              "p-4 p-lg-4 p-xl-4 p-xxl-5"
            )}
          >
            <label className={classNames(styles.title)}>
              {badgeDetail?.type === badgesTypes.reading_streak
                ? `I earned This badge by completing ${badgeDetail?.name}`
                : badgeDetail?.type === badgesTypes.super_reader
                ? `I earned This badge by becoming a ${badgeDetail?.name}`
                : badgeDetail?.type === badgesTypes.quiz_whiz
                ? `I earned This badge by completing Quiz Challenges`
                : "I earned This badge by becoming Genre Guru"}
            </label>
            <div
              className={classNames(
                styles.badgeInfoContainer,
                "px-3 pb-3 mt-3"
              )}
            >
              <Image
                src={badgeDetail?.image}
                alt=""
                className={classNames(styles.badge)}
                height={224}
                width={224}
              />

              <label className={classNames(styles.level)}>
                Level {badgeDetail?.level}
              </label>
              <label className={classNames(styles.badgeName)}>
                {badgeDetail?.name}
              </label>
              <label className={classNames(styles.badgeDesc)}>
                {badgeDetail?.description}
              </label>
            </div>
          </div>
        ) : (
          <NoContentCard label1="No Badge Found" />
        )}
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const response = await fetch(
    BaseURL + Endpoint.kid.share.getShareInfo + params?.id,
    {
      next: { revalidate: 3600 },
    }
  );
  const resp = await response.json();

  return { props: { resp } };
});

export default SharePage;
