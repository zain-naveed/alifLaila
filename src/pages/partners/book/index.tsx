import { CatalogueIcon, FilterLines, SearchIcon } from "assets";
import { InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import DashboardWraper from "shared/components/common/dashboardWrapper";
import Heading from "shared/components/common/heading";
import Pagination from "shared/components/common/pagination";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import EarningCard from "shared/components/earningCard";
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
import { BaseURL, Endpoint } from "shared/utils/endpoints";
import { accountStatus, roles } from "shared/utils/enum";
import { classNames, withError } from "shared/utils/helper";
import {
  independentAuthorPathConstants,
  partnerAuthorPathConstant,
  publisherPartnerEnabledPathConstants,
  publisherPathConstants,
} from "shared/utils/sidebarConstants/partnerConstants";
import styles from "./style.module.scss";

function MyBook({
  bookListRes,
  statsData,
  userCookie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const isPartnerAuthor = JSON.parse(
    userCookie ? userCookie : "{}"
  )?.is_partner_enabled;
  const {
    login: { user },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const isParentEnabled = JSON.parse(userCookie ?? '{}')?.is_partner_enabled_server;
  const [currentPage, setCurrentPage] = useState(1);
  const [filterSidebar, setFilterSidebar] = useState<boolean>(false);
  const [bookList, setBookList] = useState<Array<any>>(bookListRes?.data?.data);
  const [totalPage, setTotalPage] = useState<number>(bookListRes?.data?.total);
  const [search, setSearch] = useState<string>("");
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isInitialPageLoad, setIsInitialPageLoad] = useState<boolean>(true);
  const [ageRangeList, setAgeRangeList] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [filterDetail, setFilterDetail] = useState<any>(null);

  const closeFilters = () => setFilterSidebar(!filterSidebar);
  const openFilter = () => setFilterSidebar(!filterSidebar);

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
    getPubliserBook(formBody, currentPage)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            setBookList(data?.data);
            setTotalPage(data?.total);
          }
        } else {
          toastMessage("error", message);
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
    setIsInitialPageLoad(false);
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

  const applyResetFilter = () => {
    setCurrentPage(1);
    setIsInitialPageLoad(false);
    setFilterDetail(null);
    closeFilters();
  };

  useEffect(() => {
    if (!isInitialPageLoad) {
      getPublisherBook();
    }
  }, [searchVal, filterDetail, currentPage]);

  useEffect(() => {
    // for getl all List
    getAllList();
  }, []);

  useEffect(() => {
    dispatch(
      setBreadCrumb({
        crumbs: [
          {
            title: "My Books",
          },
        ],
      })
    );
  }, []);

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
        user?.role === roles.publisher
          ? isParentEnabled
          ? publisherPartnerEnabledPathConstants
          : publisherPathConstants
          : user?.role === roles.author && isPartnerAuthor
          ? partnerAuthorPathConstant
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
      <div className="row mb-4 gap-3 gap-md-0">
        <div className={classNames("col-md-6")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Total Premium Books"
            price={statsData?.data?.premium_books}
            remaining={
              isPartnerAuthor ? null : statsData?.data?.remaining_limit
            }
          />
        </div>
        <div className={classNames("col-md-6")}>
          <EarningCard
            Icon={CatalogueIcon}
            heading="Total Free Books"
            price={statsData?.data?.free_books}
          />
        </div>
      </div>
      <div className={classNames(styles.tableMain, "mb-4")}>
        <div
          className={classNames(
            "d-flex align-items-start gap-3 align-items-lg-center justify-content-between flex-column flex-lg-row px-4 py-4"
          )}
        >
          <div className={classNames("d-flex flex-column align-items-start")}>
            <Heading heading="My Books" headingStyle={styles.bookMainHeading} />
            <Title
              title="Manage your uploaded books here."
              titleStyle={styles.bookMainTitle}
            />
          </div>
          <div
            className={classNames("d-flex flex-wrap align-items-center gap-3")}
          >
            <div className={classNames(styles.searchContainer, "d-flex")}>
              <SearchIcon className={classNames(styles.searchIconStyle)} />
              <input
                className={classNames(styles.searchInputStyle, "ps-2")}
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setIsInitialPageLoad(false);
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
            {!isPartnerAuthor ? (
              <CustomButton
                title="Add New"
                containerStyle={classNames(styles.buttonMain)}
                onClick={() => {
                  if (user?.status === accountStatus.approved) {
                    router.push(partnersPanelConstant.addBook.path);
                  } else {
                    toastMessage(
                      "error",
                      "You are not authorized to upload book. If this issue persist, please contact support"
                    );
                  }
                }}
              />
            ) : null}
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
              setIsInitialPageLoad(false);
              setCurrentPage(page);
            }}
          />
        ) : null}
      </div>
    </DashboardWraper>
  );
}

export const getServerSideProps = withError(async ({ req, res }) => {
  const endpoint = JSON.parse(
    req?.cookies?.user ? req?.cookies?.user : "{}"
  )?.endpoint;
  const [resp, statsRes] = await Promise.all([
    fetch(BaseURL + endpoint + Endpoint.partner.book.allBook + `?page=1`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      next: { revalidate: 3600 },
    }),
    fetch(BaseURL + endpoint + Endpoint.partner.book.bookStats, {
      headers: {
        Authorization: "Bearer " + req.cookies.token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
  ]);

  const [bookListRes, statsData] = await Promise.all([
    resp.json(),
    statsRes.json(),
  ]);
  return { props: { userCookie: req?.cookies?.user, bookListRes, statsData } };
});

export default MyBook;
