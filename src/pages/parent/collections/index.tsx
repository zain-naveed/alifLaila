import { FilterLines } from "assets";
import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Favourites from "shared/components/parent/collectionComponents/favourite";
import MyBooks from "shared/components/parent/collectionComponents/myBooks";
import Shared from "shared/components/parent/collectionComponents/shared";
import OptionsDropDown from "shared/dropDowns/options";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { myyBooksList } from "shared/services/kid/bookService";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { SortFilters } from "shared/utils/pageConstant/kid/libraryConstant";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/parent/collectionsConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./style.module.scss";
import { withError } from "shared/utils/helper";

function Collections({
  keyword,
  myBooksData,
  favBooksData,
  sharedBooksData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );
  const [booksData, setBooksData] = useState<any>(myBooksData?.data);
  const [intialLoading, setIntialLoading] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: SortFilters[0].label,
      Icon: null,
      action: () => {
        handleGetMyBooksList(SortFilters[0].value);
      },
    },
    {
      title: SortFilters[1].label,
      Icon: null,
      action: () => {
        handleGetMyBooksList(SortFilters[1].value);
      },
    },
    {
      title: SortFilters[2].label,
      Icon: null,
      action: () => {
        handleGetMyBooksList(SortFilters[2].value);
      },
    },
  ];

  const handleGetMyBooksList = (sort: any) => {
    setIntialLoading(true);
    myyBooksList(
      {
        sort_by: sort,
      },
      1
    )
      .then(({ data }) => {
        setBooksData(data?.data);
      })
      .catch((err) => {})
      .finally(() => {
        setIntialLoading(false);
      });
  };

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: parentPanelConstant?.collections.path,
      query: { keyword: val },
    });
  };

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
    } else {
      setActiveTab(Tabs[0]);
    }
  }, [router?.query]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "My Collections",
          },
        ],
      })
    );
  }, []);

  return (
    <DashboardWraper navigationItems={parentPathConstants}>
      <div className={classNames("d-flex flex-column")}>
        <h1 className={classNames(styles.heading, "m-0 mt-4 mb-4 mb-sm-5")}>
          My Collections
        </h1>
        <div className={classNames("position-relative")}>
          <CustomTab
            tabs={Tabs}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          {activeTab === TabsEnums.myBooks ? (
            <div className={classNames(styles.filterContainer)}>
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center gap-1 position-relative w-100"
                )}
              >
                <FilterLines
                  className={classNames(styles.filterIcon)}
                  onClick={() => {
                    setOpenSelection(!openSelection);
                  }}
                />
                <label
                  className={classNames(styles.filterLabel)}
                  onClick={() => {
                    setOpenSelection(!openSelection);
                  }}
                >
                  Filters
                </label>
                <OptionsDropDown
                  options={options}
                  openSelection={openSelection}
                  setOpenSelection={setOpenSelection}
                  customContainer={styles.optionsContainer}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className={classNames("mt-4")}>
          {activeTab === TabsEnums.myBooks ? (
            <MyBooks data={booksData} intialLoading={intialLoading} />
          ) : activeTab === TabsEnums.favourites ? (
            <Favourites data={favBooksData?.data} />
          ) : (
            <Shared data={sharedBooksData?.data} />
          )}
        </div>
      </div>
    </DashboardWraper>
  );
}

export const getServerSideProps = withError<{
  keyword: any;
  myBooksData?: any;
  favBooksData?: any;
  sharedBooksData?: any;
}>(async ({ res, req, query }) => {
  if (TabsEnums.favourites === query?.keyword) {
    const listRes = await fetch(BaseURL + Endpoint.kid.book.bookFavList, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    const favBooksData = await listRes.json();
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        favBooksData,
      },
    };
  } else if (TabsEnums.shared === query?.keyword) {
    const listRes = await fetch(BaseURL + Endpoint.kid.book.sharedBooks, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    const sharedBooksData = await listRes.json();
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        sharedBooksData,
      },
    };
  } else {
    const listRes = await fetch(BaseURL + Endpoint.kid.book.myBooks, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
    const myBooksData = await listRes.json();
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        myBooksData,
      },
    };
  }
});

export default Collections;
