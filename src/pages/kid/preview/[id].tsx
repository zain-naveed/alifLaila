import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import BookView from "shared/components/common/bookView";
import MobileView from "shared/components/common/mobileView";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";

function BookPreview({
  resp,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role;
  const handleBuyHardCopy = () => {
    router.push(
      kidPanelConstant.product.path.replace(":id", resp?.data?.book?.id)
    );
  };

  return (
    <>
      {(width <= 576 || height <= 400) && typeof window !== "undefined" ? (
        <MobileView />
      ) : (
        <BookView
          bookResponse={resp}
          handleBuyHardCopy={handleBuyHardCopy}
          showRating
          kid_role={kid_role}
        />
      )}
    </>
  );
}

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const response = await fetch(
    BaseURL + Endpoint.kid.book.bookPreview + params?.id,
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
