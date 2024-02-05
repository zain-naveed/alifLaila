import {
  BackArrow2Icon,
  CartIcon,
  ChevDownIcon,
  Coins,
  DashoboardLogoutIcon,
  KidNotificationIcon,
  MenuIcon,
  SearchIcon,
  defaultAvatar,
} from "assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import useDebounce from "shared/customHook/useDebounce";
import NotificationDropDown from "shared/dropDowns/notification";
import OptionsDropDown from "shared/dropDowns/options";
import ConfirmationModal from "shared/modal/confimation";
import SelectPlanModal from "shared/modal/selectPlan";
import { resetAuthReducer } from "shared/redux/reducers/authModalSlice";
import { resetCart, setCartSlice } from "shared/redux/reducers/cartSlice";
import { resetLoginUser, setLoginUser } from "shared/redux/reducers/loginSlice";
import {
  resetPlanReducer,
  setShowPlanModal,
} from "shared/redux/reducers/planModalSlice";
import { setSearchSlice } from "shared/redux/reducers/searchSlice";
import { setSidebarStatus } from "shared/redux/reducers/sideBarSlice";
import {
  parentPanelConstant,
  routeConstant,
} from "shared/routes/routeConstant";
import { LogoutUser } from "shared/services/authService";
import { getCartCount } from "shared/services/kid/cartService";
import { getWallet } from "shared/services/kid/walletService";
import { roles } from "shared/utils/enum";
import { classNames } from "shared/utils/helper";
import { TabsEnums } from "shared/utils/pageConstant/parent/settingsConstants";
import BreadCrumb from "../breadCrumb";
import { toastMessage } from "../toast";
import styles from "./style.module.scss";
import { getCurrentPlan } from "shared/services/kid/plansService";

interface Props {
  openMobile: () => void;
}

function DashboardHeader({ openMobile }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();
  const {
    login,
    sidebar: { isShown },
    cart: { count },
    plan: { showModal },
    search: { search },
  } = useSelector((state: any) => state.root);
  const [open, setOpen] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [headerDrop, setHeaderDrop] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { width } = useWindowDimensions();
  let openSidebarMobile = 1200;

  const options: {
    title: string;
    Icon: any;
    action: (arg: any) => any;
  }[] = [
    {
      title: "Logout",
      Icon: DashoboardLogoutIcon,
      action: () => {
        setOpen(true);
      },
    },
  ];

  const handleCartCount = () => {
    getCartCount()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(setCartSlice({ count: data }));
        }
      })
      .catch((err) => {});
  };

  const handleShowPlanSelector = () => {
    dispatch(setShowPlanModal({ showModal: true }));
  };

  const handleLogout = () => {
    setLoading(true);
    LogoutUser()
      .then(({ data: { status, message } }) => {
        if (status === true) {
          setCookie("user", "", {
            path: "/",
            maxAge: 0,
            sameSite: true,
          });
          setCookie("token", "", {
            path: "/",
            maxAge: 0,
            sameSite: true,
          });
          dispatch(resetPlanReducer());
          dispatch(resetAuthReducer());
          dispatch(resetLoginUser());
          dispatch(resetCart());
          router.push(routeConstant.home.path);
          handleClose();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err.message);
      })
      .finally(() => setLoading(false));
  };

  // const handleGetWallet = () => {
  //   getWallet()
  //     .then(({ data: { data, message, status } }) => {
  //       if (status) {
  //         dispatch(setLoginUser({ remainingCoins: data?.remaining_coins }));
  //       }
  //     })
  //     .catch((err) => {});
  // };

  

  const handleGetCurrentPlan = () => {
    getCurrentPlan()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(
            setLoginUser({
              ...login,
              currentPlan: data,
              remainingCoins: data?.current_wallet?.remaining_coins ,
            })
          );
        }
      })
      .catch((err) => {})
  };

  const handleClose = () => setOpen(!open);

  const handleEnterKey = (e: any) => {
    if (e.key === "Enter") {
      router?.push({
        pathname: parentPanelConstant.search.path,
        query: { text: search },
      });
    }
  };

  useEffect(() => {
    if (login?.user?.role === roles.parent) {
      handleCartCount();
      // handleGetWallet();
      handleGetCurrentPlan();
    }
  }, []);

  useEffect(() => {
    let timeout: any = null;
    if (login?.isLoggedIn && login?.user?.role === roles.parent) {
      timeout = setTimeout(() => {
        if (!login?.currentPlan && !showModal) {
          handleShowPlanSelector();
        }
      }, 1800000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [login?.isLoggedIn, login?.user?.role]);

  useEffect(() => {
    if (width > 992) {
      setShowSearch(false);
    }
  }, [width]);

  useEffect(() => {
    if (
      location.pathname !== parentPanelConstant.search.path &&
      router?.query?.text === undefined
    ) {
      dispatch(setSearchSlice({ search: "" }));
    }
  }, []);

  useDebounce(
    () => {
      if (
        location.pathname === parentPanelConstant.search.path &&
        search === ""
      ) {
        router?.push({
          pathname: parentPanelConstant.search.path,
          query: { text: search },
        });
      } else if (search !== "" && search !== router?.query?.text) {
        router?.push({
          pathname: parentPanelConstant.search.path,
          query: { text: search },
        });
      }
    },
    [search],
    800
  );

  return (
    <>
      <div className={classNames(styles.topLevelContainer)}>
        <div
          className={classNames(
            styles.customContainer,
            "w-100",
            styles.headerContainer
          )}
        >
          {showSearch ? (
            <div
              className={classNames(
                "d-flex d-lg-none align-items-center justify-content-start w-100 gap-3 me-3 w-100"
              )}
            >
              <BackArrow2Icon
                onClick={() => setShowSearch(false)}
                role="button"
              />
              <div
                className={classNames(
                  styles.searchContainer2,
                  "d-flex px-3 position-relative"
                )}
              >
                <div className={classNames("w-100 d-flex  align-items-center")}>
                  <SearchIcon className={classNames(styles.searchIconStyle)} />
                  <input
                    value={search}
                    placeholder="Search book by Title, Keywords, Author or Publisher name"
                    className={classNames(styles.searchInputStyle, "ms-1")}
                    onChange={(e) => {
                      dispatch(setSearchSlice({ search: e.target.value }));
                    }}
                    onKeyDown={(e) => handleEnterKey(e)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start"
              )}
            >
              <MenuIcon
                className={classNames(styles.menuIconStyle, "d-flex ")}
                onClick={(e: any) => {
                  e.stopPropagation();
                  if (openSidebarMobile < width) {
                    dispatch(setSidebarStatus({ isShown: !isShown }));
                  } else {
                    openMobile();
                  }
                }}
              />
              <BreadCrumb />
              {login?.user?.role === roles.parent ? (
                <div
                  className={classNames("d-flex d-lg-none ms-2")}
                  onClick={() => setShowSearch(true)}
                >
                  <SearchIcon
                    className={classNames(styles.searchIconStyle2)}
                    role="button"
                  />
                </div>
              ) : null}
            </div>
          )}

          {login?.user?.role === roles.parent ? (
            <div className={classNames("")}>
              <div
                className={classNames(
                  styles.searchContainer,
                  " d-none d-lg-flex px-3 position-relative ms-2"
                )}
              >
                <div className={classNames("w-100 d-flex  align-items-center")}>
                  <SearchIcon className={classNames(styles.searchIconStyle)} />
                  <input
                    value={search}
                    placeholder="Search Book"
                    className={classNames(styles.searchInputStyle, "ms-1")}
                    onChange={(e) => {
                      dispatch(setSearchSlice({ search: e.target.value }));
                    }}
                    onKeyDown={(e) => handleEnterKey(e)}
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div className={classNames("d-flex gap-3")}>
            {!showSearch ? (
              <div
                className={classNames(
                  " d-flex justify-content-end align-items-center gap-3"
                )}
              >
                {login?.user?.role === roles.parent ? (
                  <div
                    className={classNames(
                      "d-flex justify-content-end align-items-center gap-3"
                    )}
                  >
                    <div
                      className={classNames(
                        "d-sm-flex align-items-center gap-1 gap-xxl-2 d-none"
                      )}
                      role="button"
                      onClick={() => {
                        router.push({
                          pathname: parentPanelConstant.setting.path,
                          query: { keyword: TabsEnums.myWallet },
                        });
                      }}
                    >
                      <Image
                        src={Coins}
                        alt="coins-icon"
                        className={classNames(styles.coinsIcon)}
                        loading="lazy"
                      />
                      <div
                        className={classNames(
                          "d-flex flex-column align-items-start"
                        )}
                      >
                        <label
                          className={classNames(styles.totalCoinsLabel)}
                          role="button"
                        >
                          Total Coins
                        </label>
                        <label
                          className={classNames(styles.totalCoins)}
                          role="button"
                        >
                          {login?.remainingCoins && login?.remainingCoins > 0
                            ? login?.remainingCoins
                            : 0}
                        </label>
                      </div>
                    </div>
                    <div
                      className={classNames("position-relative")}
                      role="button"
                      onClick={() => {
                        router.push(parentPanelConstant.cart.path);
                      }}
                    >
                      {count > 0 ? (
                        <div className={classNames(styles.countContainer)}>
                          {count}
                        </div>
                      ) : null}

                      <Image
                        src={CartIcon}
                        alt=""
                        className={classNames(styles.cartIcon)}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div
              className={classNames(
                " d-flex justify-content-end align-items-center gap-3"
              )}
            >
              {/* <div className={classNames("position-relative")}>
                <KidNotificationIcon
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                  }}
                  className={classNames(styles.notificationIcon)}
                  role="button"
                />
                <NotificationDropDown
                  openSelection={showNotifications}
                  setOpenSelection={setShowNotifications}
                />
              </div> */}

              <div
                className={styles.avatarProfile}
                role={"button"}
                onClick={() => setHeaderDrop(true)}
              >
                <img
                  src={
                    login?.user?.role === roles.publisher
                      ? login?.user?.publisher?.profile_picture
                        ? login?.user?.publisher?.profile_picture
                        : defaultAvatar.src
                      : login?.user?.role === roles.parent
                      ? login?.user?.parent?.profile_picture
                        ? login?.user?.parent?.profile_picture
                        : defaultAvatar.src
                      : login?.user?.role === roles.author
                      ? login?.user?.author?.profile_picture
                        ? login?.user?.author?.profile_picture
                        : defaultAvatar.src
                      : defaultAvatar.src
                  }
                  width={40}
                  height={40}
                  alt="img"
                />

                <div className="ms-2 text-start">
                  <h5 className={styles.avatarName}>
                    {login?.user?.role === roles.publisher
                      ? login?.user?.publisher?.full_name
                      : login?.user?.role === roles.parent
                      ? login?.user?.parent?.full_name
                      : login?.user?.role === roles.author
                      ? login?.user?.author?.full_name
                      : "--"}
                  </h5>
                  <span className={styles.avatarEmail}>
                    {login?.user?.email}
                  </span>
                </div>
                <ChevDownIcon className={classNames(styles.chevIcon, "ms-2")} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <OptionsDropDown
        options={options}
        openSelection={headerDrop}
        setOpenSelection={setHeaderDrop}
        customContainer={styles.optionsContainer}
      />
      {open ? (
        <ConfirmationModal
          Icon={DashoboardLogoutIcon}
          heading="Are you sure you want to Logout?"
          open={open}
          loading={loading}
          actionButtonText="Yes, Logout"
          handleClose={handleClose}
          handleSubmit={handleLogout}
        />
      ) : null}
      <SelectPlanModal show={showModal} />
    </>
  );
}

export default DashboardHeader;
