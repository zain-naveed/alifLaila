import {
  BackArrow2Icon,
  CartIcon,
  Coins,
  DashoboardLogoutIcon,
  KidNotificationIcon,
  LogoIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "assets";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toastMessage } from "shared/components/common/toast";
import useWindowDimensions from "shared/customHook/usWindowDimentions";
import useDebounce from "shared/customHook/useDebounce";
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
import { kidPanelConstant, routeConstant } from "shared/routes/routeConstant";
import { LogoutUser } from "shared/services/authService";
import { getCartCount } from "shared/services/kid/cartService";
import { readerHeaderItems } from "shared/utils/constants";
import { kidAccountRole } from "shared/utils/enum";
import { classNames } from "shared/utils/helper";
import { ProfileTabsEnums } from "shared/utils/pageConstant/kid/profileConstant";
import CoinsCount from "./coinsCount";
import styles from "./style.module.scss";
import { getUser } from "shared/services/kid/userService";
import { getCurrentPlan } from "shared/services/kid/plansService";

const NavItemsList = dynamic(() => import("./navItems"), {
  ssr: false,
  loading: () => {
    return (
      //show default options with no actions
      <>
        <div className={classNames("d-none d-lg-flex gap-3 gap-xxl-4")}>
          {readerHeaderItems.map((item, ind) => {
            return (
              <label className={classNames(styles.listItemtext)} key={ind}>
                {item?.name}
              </label>
            );
          })}
        </div>
      </>
    );
  },
});

const CartCount = dynamic(() => import("./cartCount"), {
  ssr: false,
});

const ProfileDropDown = dynamic(() => import("shared/dropDowns/profile"), {
  ssr: false,
});

const ReaderHeader = ({ setIsSideCanvas }: any) => {
  const {
    login: { currentPlan, isLoggedIn, kidRole, token },
    search: { search },
    plan: { showModal },
  } = useSelector((state: any) => state.root);
  const {loginUser} = useSelector((state: any) => state.root)
  const router = useRouter();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [cookie, setCookie] = useCookies();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [openSelection, setOpenSelection] = useState<boolean>(false);
  const [show, setShowLogout] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConfirmation = () => {
    setOpenSelection(false);
    setShowLogout(true);
  };

  const handleClose = () => setShowLogout(!show);

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

  const handleCartCount = () => {
    getCartCount()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(setCartSlice({ count: data }));
        }
      })
      .catch((err) => {});
  };

  const handleEnterKey = (e: any) => {
    if (e.key === "Enter") {
      router?.push({
        pathname: kidPanelConstant.search.path,
        query: { text: search },
      });
    }
  };

  const handleShowPlanSelector = () => {
    dispatch(setShowPlanModal({ showModal: true, reachLimit: false }));
  };

  const handleGetProfileInfo = () => {
    getUser()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(
            setLoginUser({
              user: { token: token, ...data },
            })
          );
        } else {
          toastMessage("Error", message);
        }
      })
      .catch((err) => {});
  };

  const handleGetCurrentPlan = () => {
    getCurrentPlan()
      .then(({ data: { data, message, status } }) => {
        if (status) {
          dispatch(
            setLoginUser({
              ...loginUser,
              currentPlan: data,
              remainingCoins: data?.current_wallet?.remaining_coins ,
            })
          );
        }
      })
      .catch((err) => {})
  };

  useDebounce(
    () => {
      if (location.pathname === kidPanelConstant.search.path && search === "") {
        router?.push({
          pathname: kidPanelConstant.search.path,
          query: { text: search },
        });
      } else if (search !== "" && search !== router?.query?.text) {
        router?.push({
          pathname: kidPanelConstant.search.path,
          query: { text: search },
        });
      }
    },
    [search],
    800
  );

  useEffect(() => {
    if (
      location.pathname !== kidPanelConstant.search.path &&
      router?.query?.text === undefined
    ) {
      dispatch(setSearchSlice({ search: "" }));
    }
  }, []);

  useEffect(() => {
    let timeout: any = null;
    if (isLoggedIn) {
      timeout = setTimeout(() => {
        if (!currentPlan && !showModal && kidRole !== kidAccountRole.family) {
          handleShowPlanSelector();
        }
      }, 1800000);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isLoggedIn]);

  useEffect(() => {
    handleCartCount();
    handleGetProfileInfo();
    handleGetCurrentPlan();
  }, []);

  useEffect(() => {
    if (width > 767) {
      setShowSearch(false);
    }
  }, [width]);

  return (
    <div
      className={classNames(styles.topLevelContainer)}
      style={{ backgroundColor: "#fffbf3" }}
      id="header"
    >
      <div
        className={classNames(
          styles.customContainer,
          "w-100 d-flex justify-content-between px-3 px-sm-0 w-100"
        )}
      >
        {showSearch ? (
          <div
            className={classNames(
              "d-flex d-md-none align-items-center justify-content-between w-100 gap-4"
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
          <>
            <div
              className={classNames(
                "d-flex justify-content-between align-items-center gap-4 gap-md-3 gap-xxl-4"
              )}
            >
              <LogoIcon
                className={classNames(styles.logoStyle)}
                role="button"
                onClick={() => {
                  router.push(kidPanelConstant.home.path);
                }}
              />
              <div
                className={classNames("d-flex d-md-none")}
                onClick={() => setShowSearch(true)}
              >
                <SearchIcon
                  className={classNames(styles.searchIconStyle2)}
                  role="button"
                />
              </div>
              <div
                className={classNames(
                  styles.searchContainer,
                  " d-none d-md-flex px-3 position-relative"
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
            <div
              className={classNames(
                "d-flex align-items-center gap-3 gap-xxl-4"
              )}
            >
              <div
                className={classNames(
                  "d-flex justify-content-end align-items-center  "
                )}
              >
                <NavItemsList />
              </div>
              <div
                className={classNames(
                  "d-sm-flex align-items-center gap-1 gap-xxl-2 d-none"
                )}
                role="button"
                onClick={() => {
                  router.push({
                    pathname: kidPanelConstant.profile.path,
                    query: { keyword: ProfileTabsEnums.myWallet },
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
                  className={classNames("d-flex flex-column align-items-start")}
                >
                  <CoinsCount />
                </div>
              </div>
              <div
                className={classNames(
                  "d-flex align-items-center gap-3 gap-xxl-4"
                )}
              >
                {/* <div className={classNames("position-relative")}>
                  <KidNotificationIcon
                    className={classNames(styles.iconStyle)}
                    role="button"
                    onClick={() => {
                      router.push(kidPanelConstant.notifications.path);
                    }}
                  />
                </div> */}
                <div
                  className={classNames("position-relative")}
                  onClick={() => {
                    router.push(kidPanelConstant.cart.path);
                  }}
                >
                  <Image
                    src={CartIcon}
                    alt="cart-icon"
                    className={classNames(styles.iconStyle)}
                    role="button"
                  />
                  <CartCount />
                </div>
                <div className={classNames("position-relative")}>
                  <UserIcon
                    className={classNames(styles.iconStyle)}
                    onClick={() => {
                      setOpenSelection(!openSelection);
                    }}
                    role="button"
                  />
                  {openSelection && (
                    <ProfileDropDown
                      openSelection={openSelection}
                      setOpenSelection={setOpenSelection}
                      handleConfirmation={handleConfirmation}
                    />
                  )}
                </div>
              </div>
              <MenuIcon
                className={classNames(styles.menuIconStyle, "d-flex d-lg-none")}
                onClick={() => {
                  setIsSideCanvas(true);
                }}
              />
            </div>
          </>
        )}
      </div>
      {show ? (
        <ConfirmationModal
          Icon={DashoboardLogoutIcon}
          heading="Are you sure you want to Logout?"
          open={show}
          loading={loading}
          actionButtonText="Yes, Logout"
          handleClose={handleClose}
          handleSubmit={handleLogout}
        />
      ) : null}
      <SelectPlanModal show={showModal} />
    </div>
  );
};

export default ReaderHeader;
