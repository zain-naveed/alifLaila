import {
  ArrowBook,
  Ballons,
  PartnerVector,
  Pointer,
  PublisherAsset1,
  PublisherTypewriter,
  SearchIcon,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import AuthorCard from "shared/components/authorCard";
import CustomButton from "shared/components/common/customButton";
import NoContentCard from "shared/components/common/noContentCard";
import Footer from "shared/components/footer";
import MainNavWrapper from "shared/components/navWrapper/main";
import PublisherCard from "shared/components/publisherCard";
import useDebounce from "shared/customHook/useDebounce";
import PublisherCardLoader from "shared/loader/pageLoader/kid/publisherCardLoader";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { getPublishersList } from "shared/services/kid/publisherService";
import { publisherContentData } from "shared/utils/constants";
import { roles } from "shared/utils/enum";
import styles from "./style.module.scss";
import { useScroll } from "shared/customHook/useScoll";
import { useRouter } from "next/router";
import { Tab, Tabs } from "react-bootstrap";
import { tabsConstant } from "shared/utils/pageConstant/landingPageConstant";
import { getAuthorList } from "shared/services/generalService";

const Publishers = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pageRef = useRef<number>(1);
  const pageAuthorRef = useRef<number>(1);
  const publishersRef = useRef<[]>([]);
  const authorRef = useRef<[]>([]);
  const bodyRef = useRef<any>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [loadMoreAuthor, setLoadMoreAuthor] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAuthor, setLoadingAuthor] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(false);
  const [initialLoadingAuthor, setInitialLoadingAuthor] =
    useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [searchAuthor, setSearchAuthor] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueAuthor, setSearchValueAuthors] = useState<string>("");
  const [publishers, setPublishers] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>(tabsConstant[0].title);

  const handleShowAuthModal = (form: number, role: number) => {
    dispatch(
      setLoginUser({
        user: { role: role },
        token: null,
        isLoggedIn: false,
      })
    );
    dispatch(setAuthReducer({ showModal: true, activeModal: form }));
  };

  const getPublishers = () => {
    getPublishersList({ page: pageRef.current, search: searchValue })
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            if (data?.current_page === data?.last_page) {
              setLoadMore(false);
            } else {
              setLoadMore(true);
            }
            let clonePublihsers: any = [...publishersRef.current];
            clonePublihsers = [...clonePublihsers, ...data?.data];
            setPublishers(clonePublihsers);
            publishersRef.current = clonePublihsers;
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setInitialLoading(false);
        setLoading(false);
      });
  };

  useDebounce(
    () => {
      setSearchValue(search);
    },
    [search],
    800
  );

  const getAuthors = () => {
    getAuthorList({ page: pageAuthorRef.current, search: searchValue })
      .then(({ data: { data, status, message } }) => {
        if (status) {
          if (data) {
            if (data?.current_page === data?.last_page) {
              setLoadMoreAuthor(false);
            } else {
              setLoadMoreAuthor(true);
            }
            let cloneAuthors: any = [...authorRef.current];
            cloneAuthors = [...cloneAuthors, ...data?.data];
            setAuthors(cloneAuthors);
            authorRef.current = cloneAuthors;
          }
        }
      })
      .catch((err) => {})
      .finally(() => {
        setInitialLoadingAuthor(false);
        setLoadingAuthor(false);
      });
  };

  useDebounce(
    () => {
      setSearchValueAuthors(searchAuthor);
    },
    [searchAuthor],
    800
  );

  useScroll(bodyRef);

  useEffect(() => {
    pageRef.current = 1;
    publishersRef.current = [];
    setPublishers([]);
    setInitialLoading(true);
    getPublishers();
  }, [searchValue]);

  useEffect(() => {
    pageAuthorRef.current = 1;
    authorRef.current = [];
    setAuthors([]);
    setInitialLoadingAuthor(true);
    getAuthors();
  }, [searchValueAuthor]);

  return (
    <>
      <MainNavWrapper />
      <div className={classNames(styles.topMainContainer)} ref={bodyRef}>
        <div className={classNames(styles.publishHeaderContainer)}>
          <div
            className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          >
            <div className={classNames("d-flex align-items-center")}>
              <div className={classNames("d-flex flex-column gap-2 py-3")}>
                <label className={styles.mainHeading}>
                  Welcome to AlifLaila,{" "}
                  <span>Where Books Transcend Borders!</span>
                </label>

                <p className={classNames(styles.subtitle)}>
                  Join AlifLaila and present your work to worldwide readership.
                  Register now to feature your books, connect with readers, and
                  amplify your reach.
                </p>

                <div className={classNames("d-flex gap-3 mt-2")}>
                  <CustomButton
                    title="Join as Publisher"
                    containerStyle={classNames(styles.publisher)}
                    onClick={() =>
                      handleShowAuthModal(forms.signup, roles.publisher)
                    }
                  />
                  <CustomButton
                    title="Join as Author"
                    containerStyle={classNames(styles.joinAuthor)}
                    onClick={() =>
                      handleShowAuthModal(forms.signup, roles.author)
                    }
                  />
                </div>

                <label className={classNames(styles.subtitle, "mt-3")}>
                  Already have an account?{" "}
                  <span
                    role="button"
                    onClick={() =>
                      handleShowAuthModal(forms.login, roles.publisher)
                    }
                  >
                    Login
                  </span>
                </label>
              </div>
              <PartnerVector
                className={classNames(styles.icon, "d-none d-lg-inline")}
              />
            </div>
          </div>
        </div>

        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          style={{ marginTop: "80px" }}
        >
          <Tabs
            defaultActiveKey={activeTab}
            className={classNames("ps-5", styles.tabsHeading)}
            onClick={(e: any) => setActiveTab(e?.target?.innerHTML)}
          >
            {tabsConstant?.map((tab) => {
              return (
                <Tab eventKey={tab?.title} key={tab?.title} title={tab?.title}>
                  <div className={styles.tabsContainer}>
                    <div className="d-lg-flex d-md-block d-sm-block d-block">
                      {tab.title === "Publisher" ? (
                        <>
                          <div className="d-flex align-items-center">
                            <label
                              className={classNames(styles.tabHeading, "me-5")}
                            >
                              <span className={styles.secondary}>
                                Easy Publishing
                              </span>{" "}
                              <span className={styles.primary}>
                                - Seamless Connectivity with Readers
                              </span>
                            </label>
                          </div>
                          <Image
                            src={PublisherTypewriter}
                            alt="typewriter"
                            className={styles.tabIcon}
                          />
                        </>
                      ) : (
                        <>
                          <div className="d-flex align-items-center">
                            <label className={styles.tabHeading}>
                              <span className={styles.secondary}>
                                Choose AlifLaila
                              </span>{" "}
                              <span className={styles.primary}>
                                As your publishing partner{" "}
                              </span>{" "}
                              <span className={styles.tertiary}>
                                - Trust us
                              </span>{" "}
                              <span className={styles.primary}>
                                To value your
                              </span>{" "}
                              <span className={styles.secondary}>
                                Creativity and reward
                              </span>{" "}
                              <span className={styles.primary}>
                                {" "}
                                You For It!
                              </span>
                            </label>
                          </div>
                          <Image
                            src={Ballons}
                            className={styles.tabIcon1}
                            alt="ballons"
                          />
                        </>
                      )}
                    </div>

                    <div className="row mt-5">
                      {tab.pointers.map((item: any) => {
                        return (
                          <div
                            className="col-12 col-md-6 d-flex mb-4"
                            key={item.title}
                          >
                            <Pointer className={styles.pointer} />
                            <div>
                              <label className={styles.pointerHeading}>
                                {item.title}
                              </label>
                              <label className={styles.pointerDescription}>
                                {item.description}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Tab>
              );
            })}
          </Tabs>
        </div>

        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 my-5 w-100"
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between"
            )}
          >
            <label className={classNames(styles.contentTitle)}>
              Our Publishers
            </label>
            <div
              className={classNames(
                styles.searchContainer,
                " px-3 align-self-start"
              )}
            >
              <div className={classNames("w-100 d-flex  align-items-center")}>
                <SearchIcon className={classNames(styles.iconStyle)} />
                <input
                  placeholder="Search by publication house name"
                  className={classNames(styles.searchInput, "ms-1")}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className={classNames(
              styles.cardsList,
              "d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap w-100"
            )}
          >
            {initialLoading ? (
              Array.from(Array(8).keys()).map((itm, inx) => {
                return <PublisherCardLoader key={inx} />;
              })
            ) : (
              <>
                {publishers?.length > 0 ? (
                  <>
                    {publishers?.map((item, inx) => {
                      return <PublisherCard {...item} key={inx} />;
                    })}
                  </>
                ) : (
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-center w-100 mt-5"
                    )}
                  >
                    <NoContentCard label1="No Publisher Found" />
                  </div>
                )}
                {loadMore && !initialLoading ? (
                  <div
                    className={classNames(
                      "w-100 d-flex align-items-center justify-content-center"
                    )}
                  >
                    <CustomButton
                      title="View All"
                      containerStyle={classNames(styles.viewAllbtn)}
                      onClick={() => {
                        setLoading(true);
                        pageRef.current = pageRef.current + 1;
                        getPublishers();
                      }}
                      loading={loading}
                      disabled={loading}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className={classNames(styles.seperator)} />
        <div
          className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
        >
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between "
            )}
          >
            <label className={classNames(styles.contentTitle)}>
              Our Authors
            </label>
            <div
              className={classNames(
                styles.searchContainer,
                " px-3 align-self-start"
              )}
            >
              <div className={classNames("w-100 d-flex  align-items-center")}>
                <SearchIcon className={classNames(styles.iconStyle)} />
                <input
                  placeholder="Search by authors name"
                  className={classNames(styles.searchInput, "ms-1")}
                />
              </div>
            </div>
          </div>

          <div
            className={classNames(
              styles.cardsList,
              "d-flex align-items-center justify-content-center justify-content-sm-start flex-wrap"
            )}
          >
            {authors?.length > 0 ? (
              <>
                {authors.map((itm, inx) => {
                  return (
                    <AuthorCard
                      key={inx}
                      item={itm}
                      isPublication={
                        itm?.associate_with ? itm?.associate_with : null
                      }
                    />
                  );
                })}
              </>
            ) : (
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center w-100 mt-5"
                )}
              >
                <NoContentCard label1="No Authors Found" />
              </div>
            )}

            <div
              className={classNames(
                "w-100 d-flex align-items-center justify-content-center"
              )}
            >
              {loadMoreAuthor && !initialLoadingAuthor ? (
                <div
                  className={classNames(
                    "w-100 d-flex align-items-center justify-content-center"
                  )}
                >
                  <CustomButton
                    title="View All"
                    containerStyle={classNames(styles.viewAllbtn)}
                    onClick={() => {
                      setLoadingAuthor(true);
                      pageAuthorRef.current = pageAuthorRef.current + 1;
                      getAuthors();
                    }}
                    loading={loadingAuthor}
                    disabled={loadingAuthor}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Publishers;
