import { LogoIcon, MenuIcon } from "assets";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import AuthModal from "shared/modal/auth";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { routeConstant } from "shared/routes/routeConstant";
import { headerItems } from "shared/utils/constants";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import Link from "next/link";

const MainHeader = ({ setIsSideCanvas }: any) => {
  const {
    auth,
    login: { isLoggedIn },
  } = useSelector((state: any) => state.root);
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>("/");

  const handleShowAuthModal = () => {
    if (isLoggedIn) {
      router.push("/");
    } else {
      dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
    }
  };

  useEffect(() => {
    setActiveTab(location.pathname);
  }, []);

  return (
    <div className={classNames(styles.topLevelContainer)} id="header">
      <div
        className={classNames(
          styles.customContainer,
          "w-100 d-flex justify-content-between px-3 px-sm-0"
        )}
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center"
          )}
        >
          <LogoIcon
            className={classNames(styles.logoStyle)}
            role="button"
            onClick={() => {
              router.push(routeConstant.home.path);
            }}
          />
        </div>
        <div
          className={classNames(
            "d-flex justify-content-end align-items-center  "
          )}
        >
          <div className={classNames("d-none d-md-flex")}>
            {headerItems.map((item, ind) => {
              return (
                <Link
                  href={item?.route}
                  className={classNames(
                    styles.listItemtext,
                    activeTab === item?.route && styles.activeItem
                  )}
                  key={ind}
                >
                  {item?.name}
                </Link>
              );
            })}
          </div>
        </div>
        <div className={classNames("d-flex align-items-center")}>
          <CustomButton
            title="Get Started"
            containerStyle={classNames(
              styles.btnContainer,
              activeTab === routeConstant.parent.path && styles.greenBtn,
              activeTab === routeConstant.partners.path && styles.primaryBtn,
              "d-none d-sm-flex"
            )}
            onClick={handleShowAuthModal}
          />
          <MenuIcon
            className={classNames(styles.menuIconStyle, "d-flex d-md-none")}
            onClick={() => {
              setIsSideCanvas(true);
            }}
          />
        </div>
      </div>
      <AuthModal show={auth.showModal} activeModal={auth.activeModal} />
    </div>
  );
};

export default MainHeader;
