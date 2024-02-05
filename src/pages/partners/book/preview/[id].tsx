import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import BookView from "shared/components/common/bookView";
import MobileView from "shared/components/common/mobileView";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";

function BookPreview({
  resp,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role;
  const { width, height } = useWindowDimensions();

  return (
    <>
      {(width <= 576 || height <= 400) && typeof window !== "undefined" ? (
        <MobileView />
      ) : (
        <BookView
          bookResponse={resp}
          showRating={false}
          viewQuiz={true}
          showBuyActions={false}
          kid_role={kid_role}
        />
      )}
    </>
  );
}

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const response = await fetch(
    BaseURL +
      endpoint +
      Endpoint.partner.book.bookPreviewAll +
      params?.id +
      `/all`,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const resp = await response.json();

  return { props: { resp, user: req?.cookies?.user } };
});

export default dynamic(() => Promise.resolve(BookPreview), {
  ssr: false,
});
