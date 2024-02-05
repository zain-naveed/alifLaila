import { LogoIcon } from "assets";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { checkActivePath, classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
const NavItem = dynamic(() => import("./navItem"), { ssr: false });

interface Props {
  sidebarArr: Array<any>;
}

function DashboardSidebar(props: Props) {
  const { sidebarArr } = props;
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const [cookie, setCookie] = useCookies();
  const router = useRouter();
  const [isActiveIndx, setActiveIndx] = useState<number>(
    checkActivePath(cookie?.user?.role, router.pathname)
  );

  useEffect(() => {
    setActiveIndx(
      checkActivePath(
        cookie?.user?.role,
        router.pathname,
        cookie?.user?.status,
        cookie?.user?.is_partner_enabled,
        cookie?.user?.is_partner_enabled_server
      )
    );
    // eslint-disable-next-line
  }, [router?.pathname, cookie?.user?.role, cookie?.user?.is_partner_enabled]);

  return (
    <>
      <div className="text-center w-100">
        <LogoIcon
          className={classNames(
            isShown ? styles.navbrand : styles.navBrandHalf
          )}
        />
        <div
          className={classNames(
            isShown ? styles.sideNavFull : styles.sideNavHalf
          )}
        >
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
                  isActive={isActiveIndx === inx ? true : false}
                  key={`publisher-${inx}`}
                />
              );
            }
          )}
        </div>
      </div>
    </>
  );
}

export default DashboardSidebar;
