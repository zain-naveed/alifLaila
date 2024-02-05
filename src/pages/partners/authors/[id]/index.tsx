import {
  BooksIcon,
  FilterLines,
  GlobeIcon2,
  MailIcon,
  MarkerIcon,
  PencilIcon,
  PhoneIcon2,
  SearchIcon,
  defaultAvatar,
} from "assets";
import classNames from "classnames";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import CustomTab from "shared/components/common/customTabs";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import Payments from "shared/components/publisher/authorsProfileComponents/payments";
import BookFilterSidebar from "shared/components/publisher/bookFilterSidebar";
import { bookStatusArr } from "shared/components/publisher/bookFilterSidebar/constant";
import BookTable from "shared/components/publisher/bookTable";
import useDebounce from "shared/customHook/useDebounce";
import { setBreadCrumb } from "shared/redux/reducers/breadCrumbSlice";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import {
  getAgeRangeList,
  getGenreList,
  getPubliserBook,
} from "shared/services/publisher/bookService";
import { roles } from "shared/utils/enum";
import { withError } from "shared/utils/helper";
import {
  Tabs,
  TabsEnum,
} from "shared/utils/pageConstant/partner/authorsScreenConstants";
import {
  independentAuthorPathConstants,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import AddAuthorModal from "shared/modal/addAuthor";
import { getAuthorsBook } from "shared/services/publisher/authorsService";

const AuthorProfile = ({
  keyword,
  userCookie,
  profileData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const isPartnerAuthor = JSON.parse(
    userCookie ? userCookie : "{}"
  )?.is_partner_enabled;

  const [profileInfo, setProfileInfo] = useState<any>(profileData?.data);
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string | any>(
    keyword ? keyword : Tabs[0]
  );
  const isParentEnabled = JSON.parse(userCookie ?? '{}')?.is_partner_enabled_server;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSidebar, setFilterSidebar] = useState<boolean>(false);
  const [bookList, setBookList] = useState<Array<any>>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [ageRangeList, setAgeRangeList] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [filterDetail, setFilterDetail] = useState<any>(null);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState<boolean>(false);

  const closeFilters = () => setFilterSidebar(!filterSidebar);
  const openFilter = () => setFilterSidebar(!filterSidebar);

  const handleShowModal = () => {
    setShowAddAuthorModal(true);
  };
  const handleCloseModal = () => {
    setShowAddAuthorModal(false);
  };

  const getPublisherBook = () => {
    let formBody = new FormData();

    formBody.append("search", searchVal);
    if (filterDetail?.age_range) {
      formBody.append("age_range", filterDetail?.age_range);
    }
    if (filterDetail?.status === 0 || filterDetail?.status) {
      formBody.append("status", filterDetail?.status);
    }
    if (filterDetail?.genre) {
      filterDetail?.genre?.forEach((element: any) => {
        formBody.append("genres[]", element?.id);
      });
    }
    setLoading(true);
    getAuthorsBook(formBody, currentPage, router.query.id)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            setBookList(data?.data);
            setTotalPage(data?.total);
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllList = () => {
    Promise.all([getAgeRangeList(), getGenreList()])
      .then((values) => {
        const [ageRange, genreList] = values;
        const ageData = ageRange?.data?.data.map((item: any) => {
          item["value"] = item.text;
          item["label"] = item.text;
          return item;
        });

        const tagsData = genreList?.data?.data;
        setAgeRangeList(ageData);
        setTagList(tagsData);
      })
      .catch((err) => {});
  };

  const applyFilter = (genre?: any, age?: any, status?: any) => {
    setCurrentPage(1);
    let obj: any = {};
    if (age) {
      let getAgeDetail = ageRangeList.find((item: any) => item.value === age);
      obj["age_range"] = getAgeDetail?.id;
    }
    if (status !== "") {
      let bookStatus: any = bookStatusArr.find(
        (item: any) => item.value === status
      );
      obj["status"] = bookStatus?.serverValue;
    }
    if (genre && genre.length) {
      obj["genre"] = genre;
    }
    setFilterDetail(obj);
    closeFilters();
  };

  const handleActiveTab = (val: string) => {
    router?.push({
      pathname: partnersPanelConstant.authorProfile.path.replace(
        ":id",
        String(router?.query?.id)
      ),
      query: { keyword: val },
    });
  };

  const applyResetFilter = () => {
    setCurrentPage(1);
    setFilterDetail(null);
    closeFilters();
  };

  const handleAddAction = (obj: any) => {
    setProfileInfo(obj);
    handleCloseModal();
  };

  useEffect(() => {
    if (keyword === TabsEnum.allBooks) {
      getPublisherBook();
    }
  }, [searchVal, filterDetail, currentPage, keyword]);

  useEffect(() => {
    if (keyword === TabsEnum.allBooks) {
      getAllList();
    }
  }, [keyword]);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "Authors",
            action: () => {
              router.push(partnersPanelConstant.authors.path);
            },
          },
          { title: "Aaliyah Omar" },
        ],
      })
    );
  }, []);

  useEffect(() => {
    if (keyword) {
      setActiveTab(keyword);
      if (keyword === TabsEnum.allBooks) {
        setCurrentPage(1);
        setBookList([]);
        setTotalPage(0);
        setFilterDetail(null);
      }
    } else {
      setActiveTab(Tabs[0]);
    }
  }, [keyword]);

  useDebounce(
    () => {
      setCurrentPage(1);
      setSearchVal(search);
    },
    [search],
    800
  );

  return (
    <DashboardWraper
      navigationItems={
        role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : independentAuthorPathConstants
      }
    >
      <BookFilterSidebar
        setIsOpen={setFilterSidebar}
        isOpen={filterSidebar}
        ageRangeList={ageRangeList}
        tagList={tagList}
        applyFilter={applyFilter}
        applyResetFilter={applyResetFilter}
      />
      <div className={classNames(styles.infoContainer, "mb-4")}>
        <div
          className={classNames(
            styles.contentContainer,
            "gap-3 flex-column flex-sm-row"
          )}
        >
          <img
            src={
              profileInfo?.author?.profile_picture
                ? profileInfo?.author?.profile_picture
                : defaultAvatar.src
            }
            alt=""
            className={classNames(styles.avt)}
            height={56}
            width={56}
          />
          <div
            className={classNames(
              "d-flex flex-column align-items-center align-items-sm-start gap-1"
            )}
          >
            <div className={classNames("d-flex align-items-center gap-2")}>
              <label className={classNames(styles.title)}>
                {profileInfo?.author?.full_name}
              </label>
              <PencilIcon
                className={classNames(styles.editIcon)}
                onClick={handleShowModal}
              />
            </div>
            <div className={classNames("d-flex align-items-center gap-2")}>
              <MarkerIcon className={classNames(styles.markerIcon)} />
              <label className={classNames(styles.address)}>
                {profileInfo?.author?.address
                  ? profileInfo?.author?.address
                  : "N/A"}
              </label>
            </div>
          </div>
        </div>
        <div className={classNames(styles.detailsContainer, "gap-4 flex-wrap")}>
          <div className={classNames("d-flex align-items-center gap-2")}>
            <GlobeIcon2 className={classNames(styles.detailIcon)} />
            <label className={classNames(styles.detailLabel)}>
              {profileInfo?.author?.website}
            </label>
          </div>
          <div className={classNames("d-flex align-items-center gap-2")}>
            <BooksIcon className={classNames(styles.detailIcon)} />
            <label className={classNames(styles.detailLabel)}>
              {profileInfo?.total_books} Books
            </label>
          </div>
          <div className={classNames("d-flex align-items-center gap-2")}>
            <PhoneIcon2 className={classNames(styles.detailIcon)} />
            <label className={classNames(styles.detailLabel)}>
              {profileInfo?.author?.phone}
            </label>
          </div>
          <div className={classNames("d-flex align-items-center gap-2")}>
            <MailIcon className={classNames(styles.detailIcon)} />
            <label className={classNames(styles.detailLabel)}>
              {profileInfo?.email}
            </label>
          </div>
        </div>
      </div>
      <CustomTab
        tabs={Tabs}
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
        color="#9A469B"
      />
      {activeTab === TabsEnum.allBooks ? (
        <>
          <div className={classNames(styles.tableMain, "my-4")}>
            <div
              className={classNames(
                "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4"
              )}
            >
              <div
                className={classNames("d-flex flex-column align-items-start")}
              >
                <Heading
                  heading="Aliyah Books"
                  headingStyle={styles.bookMainHeading}
                />
                <Title
                  title="Aliyah Books list showing here"
                  titleStyle={styles.bookMainTitle}
                />
              </div>
              <div
                className={classNames(
                  "d-flex flex-wrap align-items-center gap-3"
                )}
              >
                <div className={classNames(styles.searchContainer, "d-flex")}>
                  <SearchIcon className={classNames(styles.searchIconStyle)} />
                  <input
                    className={classNames(styles.searchInputStyle, "ps-2")}
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                    }}
                  />
                </div>
                <CustomButton
                  title="Filters"
                  IconDirction="left"
                  Icon={FilterLines}
                  iconStyle={classNames(styles.iconStyle)}
                  containerStyle={classNames(styles.buttonFilter, "gap-1")}
                  onClick={openFilter}
                />
              </div>
            </div>
            <BookTable
              list={bookList}
              loading={loading}
              setBookList={setBookList}
              isPartnerAuthor={isPartnerAuthor}
            />

            {bookList ? (
              <Pagination
                className={styles.paginationBar}
                currentPage={currentPage}
                totalCount={totalPage}
                pageSize={24}
                onPageChange={(page: any) => {
                  setCurrentPage(page);
                }}
              />
            ) : null}
          </div>
        </>
      ) : (
        <Payments keyword={keyword} />
      )}
      <AddAuthorModal
        showModal={showAddAuthorModal}
        handleClose={handleCloseModal}
        handleAction={handleAddAction}
        isEdit
        user={profileInfo}
      />
    </DashboardWraper>
  );
};

export const getServerSideProps = withError<any>(
  async ({ req, query, params }) => {
    const endpoint = JSON.parse(
      req?.cookies?.user ? req?.cookies?.user : "{}"
    )?.endpoint;
    const profileRes = await fetch(
      BaseURL + endpoint + Endpoint.partner.authors.profile + params?.id,
      {
        headers: {
          Authorization: "Bearer " + req.cookies.token,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const profileData = await profileRes.json();
    if (query?.keyword === TabsEnum.paymentHistory) {
      return {
        props: {
          profileData,
          keyword: query?.keyword ? query?.keyword : Tabs[0],
          userCookie: req?.cookies?.user,
        },
      };
    } else {
      return {
        props: {
          profileData,
          keyword: query?.keyword ? query?.keyword : Tabs[0],
          userCookie: req?.cookies?.user,
        },
      };
    }
  }
);

export default AuthorProfile;
