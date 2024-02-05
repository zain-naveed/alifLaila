import { useEffect } from "react";

export const useScroll = (ref: any) => {
  function scrollFunction() {
    //@ts-ignore

    let headerElem = document.getElementById("header");
    if (
      //@ts-ignore
      ref?.current?.scrollTop > 50
    ) {
      //@ts-ignore
      headerElem.style.height = "70px";
      //@ts-ignore
      ref.current.style.height = "calc(100vh - 70px)";
    } else {
      //@ts-ignore
      headerElem.style.height = "94px";
      //@ts-ignore
      ref.current.style.height = "calc(100vh - 94px)";
    }
  }

  useEffect(() => {
    //@ts-ignore

    ref?.current?.addEventListener("scroll", scrollFunction);

    return () => {
      //@ts-ignore
      ref?.current?.removeEventListener("scroll", scrollFunction);
    };
  }, []);
};
