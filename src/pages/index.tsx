import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import React, { useRef } from "react";
import Footer from "shared/components/footer";
import HeroCard from "shared/components/homeScreenComponents/HeroCard";
import BookListingCard from "shared/components/homeScreenComponents/bookListingCard";
import ContentCard from "shared/components/homeScreenComponents/contentCard";
import FlowCard from "shared/components/homeScreenComponents/flowCard";
import PlansCard from "shared/components/homeScreenComponents/plansCard";
import Testimonials from "shared/components/homeScreenComponents/testimonail";
import WhyAlifLailaCard from "shared/components/homeScreenComponents/whyAlifLailaCard";
import MainNavWrapper from "shared/components/navWrapper/main";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import styles from "./style.module.scss";
import NewsLetter from "shared/components/common/newsLetter";
import { HeroContent } from "shared/utils/pageConstant/landingPageConstant";

const Home = ({
  feedBacks,
  genres,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <MainNavWrapper />

      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <HeroCard slides={HeroContent} />
        <ContentCard />
        <div style={{ backgroundColor: "rgb(251,251,251)" }}>
          <BookListingCard genres={genres} />
          <FlowCard />
          <WhyAlifLailaCard />
          <PlansCard />
          {feedBacks?.data?.length > 0 ? (
            <Testimonials feedBacks={feedBacks?.data} />
          ) : null}
          <NewsLetter />
          <Footer showDownload />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req }) => {
  const [feedbackRes, genreRes] = await Promise.all([
    fetch(BaseURL + Endpoint.kid.feedback.feedback, {
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + Endpoint.partner.book.genreList, {
      cache: "no-cache",
    }),
  ]);
  const [feedBacks, genres] = await Promise.all([
    feedbackRes.json(),
    genreRes.json(),
  ]);
  return { props: { feedBacks, genres } };
});

export default React.memo(Home);
