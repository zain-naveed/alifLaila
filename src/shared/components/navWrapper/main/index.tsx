import { useState } from "react";
import MainHeader from "shared/components/header/main";
import SideCanvas from "shared/components/sideCanvas/main";

const MainNavWrapper = () => {
  const [isSideCanvas, setIsSideCanvas] = useState<boolean>(false);
  return (
    <>
      <SideCanvas isOpen={isSideCanvas} setIsOpen={setIsSideCanvas} />
      <MainHeader setIsSideCanvas={setIsSideCanvas} />
    </>
  );
};

export default MainNavWrapper;
