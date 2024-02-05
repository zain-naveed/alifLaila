import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef } from "react";
import Footer from "shared/components/footer";
import FeatureListCard from "shared/components/homeScreenComponents/featureListCard";
import KidBookListingCard from "shared/components/homeScreenComponents/kidBooksListCard";
import NewArrivalList from "shared/components/homeScreenComponents/newArrivalList";
import ProgressBookList from "shared/components/homeScreenComponents/progressBookList";
import SuggestionList from "shared/components/homeScreenComponents/suggestionList";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import styles from "./style.module.scss";
import { withError } from "shared/utils/helper";

const Home = ({
  featureList,
  progress,
  newArrival,
  genres,
  suggestion,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);

  return (
    <>
      <ReaderNavWrapper />
      <div
        style={{ backgroundColor: "rgb(252,252,252)" }}
        className={classNames(styles.topLevelContainer)}
        ref={bodyRef}
      >
        {featureList?.data?.length > 0 ? (
          <FeatureListCard list={featureList?.data} />
        ) : null}

        {progress?.data?.data?.length > 0 ? (
          <ProgressBookList progress={progress} />
        ) : null}
        {newArrival?.data?.data?.length > 0 ? (
          <NewArrivalList newArrival={newArrival} />
        ) : null}
        <KidBookListingCard genres={genres} />
        {suggestion?.data?.data?.length > 0 ? (
          <SuggestionList suggestion={suggestion} />
        ) : null}
        <Footer showDownload />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res }) => {
  const [featureListRes, progressRes, newArrivalRes, genreRes, suggestionRes] =
    await Promise.all([
      fetch(BaseURL + Endpoint.partner.feature.featuredBooks, {
        cache: "no-cache",
      }),
      fetch(BaseURL + Endpoint.kid.book.progress + `?page=1`, {
        method: "POST",
        body: JSON.stringify({ sort_by: "incomplete" }),
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + Endpoint.kid.book.newArrival + `?page=1`, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + Endpoint.partner.book.genreList, { cache: "no-cache" }),
      fetch(BaseURL + Endpoint.kid.book.suggestion + `?page=1`, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
    ]);
  const [featureList, progress, newArrival, genres, suggestion] =
    await Promise.all([
      featureListRes.json(),
      progressRes.json(),
      newArrivalRes.json(),
      genreRes.json(),
      suggestionRes.json(),
    ]);
  return { props: { featureList, progress, newArrival, genres, suggestion } };
});

export default Home;
