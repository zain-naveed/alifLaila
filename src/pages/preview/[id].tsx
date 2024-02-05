import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import BookView from "shared/components/common/bookView";
import MobileView from "shared/components/common/mobileView";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";

function BookPreview({
  resp,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role;
  const { width, height } = useWindowDimensions();

  return (
    <>
      {(width <= 576 || height <= 400) && typeof window !== "undefined" ? (
        <MobileView />
      ) : (
        <BookView
          bookResponse={resp}
          showRating
          kid_role={kid_role}
          isPublic={true}
        />
      )}
    </>
  );
}

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const response = await fetch(
    BaseURL + Endpoint.general.publicPreview + params?.id,
    {
      next: { revalidate: 3600 },
    }
  );
  const resp = await response.json();

  return {
    props: { resp, user: req?.cookies?.user ? req?.cookies?.user : null },
  };
});

export default dynamic(() => Promise.resolve(BookPreview), {
  ssr: false,
});
