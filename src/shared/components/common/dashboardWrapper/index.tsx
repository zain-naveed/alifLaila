import dynamic from "next/dynamic";
import { useState } from "react";
import { useSelector } from "react-redux";
import DashboardSideCanvas from "shared/components/common/dashboardSideCanvas";
import { classNames } from "shared/utils/helper";
import DashboardSidebar from "../dashboardSidebar";
import styles from "./style.module.scss";
const DashboardHeader = dynamic(
  () => import("shared/components/common/dashboardHeader"),
  {
    ssr: false,
  }
);
interface Props {
  children: any;
  navigationItems: Array<{
    path?: string;
    title: string;
    Icon: any;
  }>;
}

function DashboardWraper(props: Props) {
  const { children, navigationItems } = props;
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);
  const [isSideCanvas, setIsSideCanvas] = useState<boolean>(false);
  const handleOpen = () => {
    setIsSideCanvas(!isSideCanvas);
  };
  const handleMobileSideClose = () => setIsSideCanvas(false);
  return (
    <div className={classNames(styles.topLevelContainer, "p-0 m-0 ")}>
      <DashboardSideCanvas
        handleClose={handleMobileSideClose}
        isOpen={isSideCanvas}
        setIsOpen={setIsSideCanvas}
        sidebarArr={navigationItems}
      />
      <div
        className={classNames(
          styles.sideNavContainer,
          isShown ? styles.sideNavFull : styles?.sideNavHalf
        )}
        id="sideNav"
      >
        <DashboardSidebar sidebarArr={navigationItems} />
      </div>
      <div id="mainContainer" className={classNames(styles.mainContainer)}>
        <DashboardHeader openMobile={handleOpen} />
        <div id="container-padding" className={styles.containerPadding}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardWraper;
