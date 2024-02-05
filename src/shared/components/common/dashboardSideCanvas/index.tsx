import { LogoIcon } from "assets";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { checkActivePath, classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
const NavItem = dynamic(() => import("./navItem"), { ssr: false });

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  sidebarArr: Array<{
    path?: string;
    title: string;
    Icon: any;
  }>;
  handleClose: () => void;
}

const DashboardSideCanvas = ({
  isOpen,
  setIsOpen,
  sidebarArr,
  handleClose,
}: SideCanvasProps) => {
  const router = useRouter();
  const [cookie] = useCookies();
  const [isActiveIndx, setActiveIndx] = useState<number>(
    checkActivePath(cookie?.user?.role, router.pathname)
  );

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
  }, [router?.pathname]);

  useEffect(() => {
    setActiveIndx(
      checkActivePath(
        cookie?.user?.role,
        router.pathname,
        cookie?.user?.status,
        cookie?.user?.is_partner_enabled
      )
    );
    // eslint-disable-next-line
  }, [router?.pathname, cookie?.user?.role, cookie?.user?.is_partner_enabled]);

  return (
    <div
      className={classNames(styles.backDropContainer, "d-md-none")}
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
            "d-flex justify-content-center align-items-center px-4 py-4"
          )}
        >
          <LogoIcon className={classNames(styles.logoStyle)} />
        </div>
        <div>
          {sidebarArr.map(
            (
              item: {
                path?: string;
                title: string;
                Icon: any;
              },
              inx: number
            ) => {
              return (
                <NavItem
                  {...item}
                  isActive={isActiveIndx == inx ? true : false}
                  key={inx}
                />
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSideCanvas;
