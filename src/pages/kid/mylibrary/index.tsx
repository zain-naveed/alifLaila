import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CustomTab from "shared/components/common/customTabs";
import Footer from "shared/components/footer";
import Favourites from "shared/components/kid/libraryComponents/favourites";
import MyBooks from "shared/components/kid/libraryComponents/myBooks";
import SharedBooks from "shared/components/kid/libraryComponents/sharedBooks";
import ReaderNavWrapper from "shared/components/navWrapper/reader";
import { useScroll } from "shared/customHook/useScoll";
import { kidPanelConstant } from "shared/routes/routeConstant";
import { kidAccountRole } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import {
  FamilyLibraryTabs,
  FamilyLibraryTabsEnums,
  LibraryTabs,
  LibraryTabsEnums,
} from "shared/utils/pageConstant/kid/libraryConstant";
import styles from "./style.module.scss";

const MyLibrary = ({
  keyword,
  user,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const kid_role = JSON.parse(user ? user : "{}")?.kid_role;
  const bodyRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<string | any>(
    keyword
      ? keyword
      : kid_role === kidAccountRole.individual
      ? LibraryTabs[0]
      : FamilyLibraryTabs[0]
  );

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: kidPanelConstant?.mylibrary.path,
      query: { keyword: val },
    });
  };

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
    } else {
      setActiveTab(
        kid_role === kidAccountRole.individual
          ? LibraryTabs[0]
          : FamilyLibraryTabs[0]
      );
    }
  }, [router?.query]);

  useScroll(bodyRef);

  return (
    <>
      <ReaderNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 mt-4 w-100"
          )}
        >
          <label className={classNames(styles.title, "mb-4")}>My Library</label>
          <CustomTab
            tabs={
              kid_role === kidAccountRole.individual
                ? LibraryTabs
                : FamilyLibraryTabs
            }
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          {kid_role === kidAccountRole.individual ? (
            <>
              {activeTab === LibraryTabsEnums?.favourites ? (
                <Favourites />
              ) : (
                <MyBooks />
              )}
            </>
          ) : (
            <>
              {activeTab === FamilyLibraryTabsEnums?.favourites ? (
                <Favourites />
              ) : activeTab === FamilyLibraryTabsEnums?.shared ? (
                <SharedBooks />
              ) : (
                <MyBooks />
              )}
            </>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = withError(async ({ req, res, query }) => {
  return {
    props: {
      keyword: query?.keyword ? query?.keyword : LibraryTabs[0],
      user: req?.cookies?.user,
    },
  };
});

export default MyLibrary;
