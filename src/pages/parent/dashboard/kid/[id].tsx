import classNames from "classnames";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import AllBooks from "shared/components/parent/kidProfileScreenComponents/allBooks";
import Badges from "shared/components/parent/kidProfileScreenComponents/badges";
import Completed from "shared/components/parent/kidProfileScreenComponents/completed";
import OnGoing from "shared/components/parent/kidProfileScreenComponents/onGoing";
import Pending from "shared/components/parent/kidProfileScreenComponents/pending";
import ProfileInfo from "shared/components/parent/kidProfileScreenComponents/profileInfo";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { parentPanelConstant } from "shared/routes/routeConstant";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnums,
} from "shared/utils/pageConstant/parent/kidProfileConstants";
import { parentPathConstants } from "shared/utils/sidebarConstants/parentConstants";

const KidProfile = ({
  keyword,
  profileData,
  progressData,
  badgesData,
  achivementData,
  languageData,
  genreData,
  ageRangeData,
  booksList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: parentPanelConstant?.kidProfile.path.replace(
        ":id",
        String(router?.query?.id)
      ),
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
    if (!profileData?.status) {
      router.back();
    }
  }, []);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Dashboard",
            action: () => {
              router.push(parentPanelConstant.dashboard.path);
            },
          },
          {
            title: profileData?.data?.reader?.full_name,
          },
        ],
      })
    );
  }, []);

  return (
    <>
      {activeTab === TabsEnums.assign ? (
        <AllBooks
          title="Assign Books"
          isInProfile
          ageRangeData={ageRangeData}
          languageData={languageData}
          genreData={genreData}
          profileData={profileData}
          booksList={booksList?.data}
          kidId={String(router?.query?.id)}
        />
      ) : (
        <DashboardWraper navigationItems={parentPathConstants}>
          <ProfileInfo profileData={profileData} showBottomBorder={false} />
          <CustomTab
            tabs={Tabs}
            activeTab={activeTab}
            handleActiveTab={handleActiveTab}
          />
          <div className={classNames("my-4 my-sm-5")}>
            {activeTab === TabsEnums.pending ? (
              <Pending progress={progressData?.data} />
            ) : activeTab === TabsEnums.ongoing ? (
              <OnGoing progress={progressData?.data} />
            ) : activeTab === TabsEnums.completed ? (
              <Completed progress={progressData?.data} />
            ) : (
              activeTab === TabsEnums.badges && (
                <Badges
                  achivementData={achivementData?.data}
                  badgesData={badgesData?.data}
                />
              )
            )}
          </div>
        </DashboardWraper>
      )}
    </>
  );
};

export default KidProfile;

export const getServerSideProps = withError<{
  keyword: any;
  profileData?: any;
  progressData?: any;
  badgesData?: any;
  languageData?: any;
  genreData?: any;
  ageRangeData?: any;
  booksList?: any;
  achivementData?: any;
}>(async ({ req, res, query, params }) => {
  let sort = "pending";
  if (query?.keyword === TabsEnums.pending) {
    sort = "pending";
  } else if (query?.keyword === TabsEnums.ongoing) {
    sort = "incomplete";
  } else if (query?.keyword === TabsEnums.completed) {
    sort = "complete";
  }
  if (TabsEnums.assign === query?.keyword) {
    const [profileRes, languageRes, genreRes, ageRangeRes, booksListRes] =
      await Promise.all([
        fetch(BaseURL + Endpoint.parent.kids.profile + params?.id, {
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }),
        fetch(BaseURL + Endpoint.partner.book.languateList),
        fetch(BaseURL + Endpoint.partner.book.genreList),
        fetch(BaseURL + Endpoint.partner.book.ageRange),
        fetch(BaseURL + Endpoint.kid.book.all, {
          method: "POST",
          body: JSON.stringify({ kid_id: params?.id }),
          headers: {
            Authorization: "Bearer " + req.cookies.token,
            "Content-Type": "application/json",
          },
          cache: "no-cache",
        }),
      ]);
    const [profileData, languageData, genreData, ageRangeData, booksList] =
      await Promise.all([
        profileRes.json(),
        languageRes.json(),
        genreRes.json(),
        ageRangeRes.json(),
        booksListRes.json(),
      ]);
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        profileData,
        languageData,
        genreData,
        ageRangeData,
        booksList,
      },
    };
  } else if (TabsEnums.badges === query?.keyword) {
    const [profileRes, badgesRes, achivementRes] = await Promise.all([
      fetch(BaseURL + Endpoint.parent.kids.profile + params?.id, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      fetch(BaseURL + Endpoint.kid.badges.listAll, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      fetch(BaseURL + Endpoint.parent.kids.badges + params?.id, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    ]);
    const [profileData, badgesData, achivementData] = await Promise.all([
      profileRes.json(),
      badgesRes.json(),
      achivementRes.json(),
    ]);
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        badgesData,
        profileData,
        achivementData,
      },
    };
  } else {
    const [profileRes, progressRes] = await Promise.all([
      fetch(BaseURL + Endpoint.parent.kids.profile + params?.id, {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
      fetch(BaseURL + Endpoint.parent.kids.progress + params?.id, {
        method: "POST",
        body: JSON.stringify({ sort_by: sort }),
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }),
    ]);
    const [profileData, progressData] = await Promise.all([
      profileRes.json(),
      progressRes.json(),
    ]);
    return {
      props: {
        keyword: query?.keyword ? query?.keyword : Tabs[0],
        profileData,
        progressData,
      },
    };
  }
});
