import { useState } from "react";

export const useOnScroll = (elemId: string): [boolean, () => void] => {
  const [endReach, setEndReach] = useState<boolean>(false);

  const onScroll = () => {
    const element: any = document.getElementById(elemId);
    let checkHeight = element.scrollHeight;
    let onReachEnd = element.scrollTop + element.offsetHeight;
    if (
      Math.floor(onReachEnd) === checkHeight ||
      Math.ceil(onReachEnd) === checkHeight
    ) {
      setEndReach(true);
    } else {
      setEndReach(false);
    }
  };

  return [endReach, onScroll];
};
