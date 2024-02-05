import { CrossIcon, LogoIcon } from "assets";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import styles from "./style.module.scss";
const CoinsCoint = dynamic(() => import("./coinsCount"), { ssr: false });
const NavItemsList = dynamic(() => import("./navItems"), {
  ssr: false,
});

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
}

const ReaderSideCanvas = ({ isOpen, setIsOpen }: SideCanvasProps) => {
  function handleClick(e: any) {
    const elem: any = document.getElementById("sideCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem: any = document.getElementById("backDropContainer");
    elem.addEventListener("click", (event: any) => {
      handleClick(event);
    });

    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(styles.backDropContainer, "d-xl-none")}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropContainer"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="sideCanvas"
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
        <div
          className={classNames(
            "d-flex d-sm-none align-items-center justify-content-between px-4"
          )}
        >
          <label className={classNames(styles.totalCoinsLabel)}>
            Total Coins
          </label>
          <CoinsCoint />
        </div>

        <NavItemsList />
      </div>
    </div>
  );
};

export default ReaderSideCanvas;
