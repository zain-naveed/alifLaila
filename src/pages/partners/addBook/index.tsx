import { useEffect, useState } from "react";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import { LoadingAnimation } from "assets";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Animation from "shared/components/common/animation";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import Form1 from "./form/form1";
import Form2 from "./form/form2";
import styles from "./style.module.scss";
import { roles } from "shared/utils/enum";
import { InferGetServerSidePropsType } from "next";
const bookStepConstant = {
  form1: 0,
  form2: 1,
};

function AddBook({
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const account_role = JSON.parse(user ? user : "{}")?.role;
  const isParentEnabled = JSON.parse(user ?? '{}')?.is_partner_enabled_server;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [bookSwitch, setBookSwitch] = useState<number>(bookStepConstant.form1);

  useEffect(() => {
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
            title: "Add New",
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
            heading="Add New Book"
            headingStyle={classNames(styles.bookHeading, "mb-3")}
          />
          <BookStepper
            bookSwitch={bookSwitch}
            setBookSwitch={setBookSwitch}
            setLoading={setLoading}
            account_role={account_role}
          />
        </div>
      </DashboardWraper>
    </>
  );
}
interface stepperInterface {
  bookSwitch: number;
  setBookSwitch: (val: any) => void;
  setLoading: (val: boolean) => void;
  account_role: number;
}

const BookStepper = ({
  bookSwitch,
  setBookSwitch,
  setLoading,
  account_role,
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
          form1Detail={form1Detail}
          next={next}
          setForm1Detail={setForm1Detail}
        />
      );
    case bookStepConstant.form2:
      return (
        <Form2
          form1Detail={form1Detail}
          previous={previous}
          setForm1Detail={setForm1Detail}
          setLoading={setLoading}
          account_role={account_role}
        />
      );

    default:
      return (
        <Form1
          form1Detail={form1Detail}
          next={next}
          setForm1Detail={setForm1Detail}
        />
      );
  }
};

export const getServerSideProps = withError(async ({ req, res }) => {
  return {
    props: {
      user: req?.cookies?.user,
    },
  };
});

export default AddBook;
