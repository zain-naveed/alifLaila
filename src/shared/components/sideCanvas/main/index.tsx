import { CrossIcon, LogoIcon } from "assets";
import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "shared/components/common/customButton";
import { forms } from "shared/modal/auth/constants";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { headerItems } from "shared/utils/constants";
import styles from "./style.module.scss";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
}

const SideCanvas = ({ isOpen, setIsOpen }: SideCanvasProps) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<string>("/");

  function handleClick(e: any) {
    const elem: any = document.getElementById("sideCanvas2");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  const handleShowAuthModal = () => {
    setIsOpen(false);
    dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
  };

  useEffect(() => {
    let elem: any = document.getElementById("backDropContainer2");
    elem.addEventListener("click", (event: any) => {
      handleClick(event);
    });
    setActiveTab(location?.pathname);
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(styles.backDropContainer, "d-xl-none")}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropContainer2"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="sideCanvas2"
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center px-4 py-4"
          )}
        >
          <LogoIcon className={classNames(styles.logoStyle)} />
          <div
            className={classNames(styles.crossIconContainer)}
            onClick={() => {
              setIsOpen(false);
            }}
            role="button"
          >
            <CrossIcon />
          </div>
        </div>

        <div className={classNames("d-flex flex-column p-4")}>
          {headerItems.map((Item, ind) => {
            return (
              <Link
                className={classNames(
                  "d-flex align-items-center justify-content-start",
                  styles.itemContainer
                )}
                key={ind}
                role="button"
                href={Item?.route}
              >
                <Item.Icon
                  className={classNames(
                    styles.routeIconStyle,
                    activeTab !== Item?.route && styles.inActiveIcon
                  )}
                />
                <label
                  className={classNames(
                    styles.listItemtext,
                    activeTab === Item?.route && styles.activeItem
                  )}
                >
                  {Item?.name}
                </label>
              </Link>
            );
          })}
          <CustomButton
            title="Get Started"
            containerStyle={classNames(styles.btnContainer, "d-flex d-sm-none")}
            onClick={handleShowAuthModal}
          />
        </div>
      </div>
    </div>
  );
};

export default SideCanvas;
