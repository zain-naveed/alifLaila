import { useEffect, useState } from "react";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";

import { LoadingAnimation } from "assets";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Animation from "shared/components/common/animation";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { bookStatusEnum, roles } from "shared/utils/enum";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import Form1 from "./form/form1";
import Form2 from "./form/form2";
import Form3 from "./form/form3";
import styles from "./style.module.scss";

const bookStepConstant = {
  form1: 0,
  form2: 1,
};

function EditBook({
  user,
  bookDetail,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [bookSwitch, setBookSwitch] = useState<number>(bookStepConstant.form1);

  useEffect(() => {
    if (!bookDetail?.status) {
      router.back();
    }
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "MY BOOKS",
            action: () => {
              router.push(partnersPanelConstant.book.path);
            },
          },
          {
            title: "Edit",
          },
        ],
      })
    );
  }, []);
  return (
    <>
      {loading ? <Animation animaton={LoadingAnimation} /> : null}
      <DashboardWraper
        navigationItems={
          role === roles.publisher
            ? isParentEnabled
            ? publisherPartnerEnabledPathConstants
            : publisherPathConstants
            : independentAuthorPathConstants
        }
      >
        <div className={classNames(styles.addBookContainer)}>
          <Heading
            heading="Edit Book"
            headingStyle={classNames(styles.bookHeading, "mb-3")}
          />
          {bookDetail?.data?.status === bookStatusEnum.published ||
          bookDetail?.data?.status === bookStatusEnum.approved ? (
            <Form3 bookDetails={bookDetail?.data} />
          ) : (
            <BookStepper
              bookSwitch={bookSwitch}
              setBookSwitch={setBookSwitch}
              details={bookDetail?.data}
              setLoading={setLoading}
            />
          )}
        </div>
      </DashboardWraper>
    </>
  );
}

interface stepperInterface {
  bookSwitch: number;
  setBookSwitch: any;
  details: any;
  setLoading: (val: boolean) => void;
}

const BookStepper = ({
  bookSwitch,
  setBookSwitch,
  details,
  setLoading,
}: stepperInterface) => {
  const [form1Detail, setForm1Detail] = useState<any>({});
  const next = () => {
    setBookSwitch(bookStepConstant.form2);
  };
  const previous = () => {
    setBookSwitch(bookStepConstant.form1);
  };

  switch (bookSwitch) {
    case bookStepConstant.form1:
      return (
        <Form1
          next={next}
          setForm1Detail={setForm1Detail}
          bookDetails={details}
          form1Detail={form1Detail}
        />
      );
    case bookStepConstant.form2:
      return (
        <Form2
          previous={previous}
          form1Detail={form1Detail}
          bookDetails={details}
          setForm1Detail={setForm1Detail}
          setLoading={setLoading}
        />
      );

    default:
      return (
        <Form1
          form1Detail={form1Detail}
          next={next}
          setForm1Detail={setForm1Detail}
          bookDetails={details}
        />
      );
  }
};

export const getServerSideProps = withError(async ({ req, res, params }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const bookRes = await fetch(
    BaseURL + endpoint + Endpoint.partner.book.bookDetail + params?.id,
    {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }
  );
  const bookDetail = await bookRes.json();

  return { props: { user: req?.cookies?.user, bookDetail } };
});

export default EditBook;
