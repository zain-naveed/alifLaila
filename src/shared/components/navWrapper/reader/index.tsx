import { useState } from "react";
import ReaderHeader from "shared/components/header/reader";
import ReaderSideCanvas from "shared/components/sideCanvas/reader";

const ReaderNavWrapper = () => {
  const [isSideCanvas, setIsSideCanvas] = useState<boolean>(false);
  return (
    <>
      <ReaderSideCanvas isOpen={isSideCanvas} setIsOpen={setIsSideCanvas} />
      <ReaderHeader setIsSideCanvas={setIsSideCanvas} />
    </>
  );
};

export default ReaderNavWrapper;
