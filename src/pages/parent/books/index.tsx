import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import FeatureListCard from "shared/components/homeScreenComponents/featureListCard";
import BookList from "shared/components/parent/booksScreenComponents/bookList";
import GenreBookListingCard from "shared/components/parent/booksScreenComponents/genreBooksListing";
import AllBooks from "shared/components/parent/kidProfileScreenComponents/allBooks";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/parent/booksConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";
import styles from "./styles.module.scss";
import AgeRangeBooks from "shared/components/parent/booksScreenComponents/ageRangeBooks";

function Books({
  keyword,
  languageData,
  genreData,
  ageRangeData,
  booksList,
  progress,
  newArrival,
  featureList,
  ageRangeList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );

  useEffect(() => {
    if (router?.query?.keyword) {
      setActiveTab(router?.query?.keyword);
      if (router?.query?.keyword === TabsEnums.allBooks) {
        dispatch(
          setBreadCrumb({
            crumbs: [
              {
                title: "Books",
                action: () => {
                  router.push(parentPanelConstant.books.path);
                },
              },
              {
                title: "All Books",
              },
            ],
          })
        );
      } else {
        dispatch(
          setBreadCrumb({
            crumbs: [
              {
                title: "Books",
                action: () => {
                  router.push(parentPanelConstant.books.path);
                },
              },
            ],
          })
        );
      }
    } else {
      setActiveTab(Tabs[0]);
      dispatch(
        setBreadCrumb({
          crumbs: [
            {
              title: "Books",
              action: () => {
                router.push(parentPanelConstant.books.path);
              },
            },
          ],
        })
      );
    }
  }, [router?.query]);

  return (
    <>
      {activeTab === TabsEnums.allBooks ? (
        <AllBooks
          title="All Books"
          ageRangeData={ageRangeData}
          languageData={languageData}
          genreData={genreData}
          booksList={booksList?.data}
        />
      ) : (
        <DashboardWraper navigationItems={parentPathConstants}>
          <div className={classNames(styles.topContainer)}>
            {featureList?.data?.length > 0 ? (
              <FeatureListCard list={featureList?.data} isInParent />
            ) : null}

            {progress?.data?.data?.length > 0 ? (
              <div className={classNames("mt-4")}>
                <BookList
                  response={progress}
                  id="parent-continue-reading-books-list-card"
                  isProgress={true}
                />
              </div>
            ) : null}
            {newArrival?.data?.data?.length > 0 ? (
              <>
                <div className={classNames(styles.seperator)} />
                <BookList
                  response={newArrival}
                  id="parent-new-arrival-books-list-card"
                />
              </>
            ) : null}

            <GenreBookListingCard genres={genreData} />
            {ageRangeList?.data ? (
              <>
                {Object.keys(ageRangeList?.data).map((itm, inx) => {
                  return (
                    <AgeRangeBooks
                      id={`parent-kid-suggestion-list-${inx}`}
                      response={ageRangeList}
                      ageId={itm}
                      index={inx}
                      key={inx}
                    />
                  );
                })}
              </>
            ) : null}
          </div>
        </DashboardWraper>
      )}
    </>
  );
}

export const getServerSideProps = withError<{
  keyword: any;
  languageData?: any;
  genreData?: any;
  ageRangeData?: any;
  booksList?: any;
  progress?: any;
  newArrival?: any;
  featureList?: any;
  ageRangeList?: any;
}>(async ({ req, res, query }) => {
  if (TabsEnums.allBooks === query?.keyword) {
    const [languageRes, genreRes, ageRangeRes, booksListRes] =
      await Promise.all([
        fetch(BaseURL + Endpoint.partner.book.languateList),
        fetch(BaseURL + Endpoint.partner.book.genreList),
        fetch(BaseURL + Endpoint.partner.book.ageRange),
        fetch(BaseURL + Endpoint.kid.book.all, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }),
      ]);
    const [languageData, genreData, ageRangeData, booksList] =
      await Promise.all([
        languageRes.json(),
        genreRes.json(),
        ageRangeRes.json(),
        booksListRes.json(),
      ]);

    return {
      props: {
        languageData,
        genreData,
        ageRangeData,
        booksList,
        keyword: query?.keyword ? query?.keyword : Tabs[0],
      },
    };
  } else {
    const [
      featureListRes,
      progressRes,
      newArrivalRes,
      genreRes,
      ageRangeListRes,
    ] = await Promise.all([
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
        cache: "no-cache",
      }),
      fetch(BaseURL + Endpoint.kid.book.newArrival + `?page=1`, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        next: { revalidate: 3600 },
      }),
      fetch(BaseURL + Endpoint.partner.book.genreList),
      fetch(BaseURL + Endpoint.parent.kids.ageRangelist, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        cache: "no-cache",
      }),
    ]);
    const [featureList, progress, newArrival, genreData, ageRangeList] =
      await Promise.all([
        featureListRes.json(),
        progressRes.json(),
        newArrivalRes.json(),
        genreRes.json(),
        ageRangeListRes.json(),
      ]);

    return {
      props: {
        featureList,
        progress,
        newArrival,
        genreData,
        ageRangeList,
        keyword: query?.keyword ? query?.keyword : Tabs[0],
      },
    };
  }
});

export default Books;
