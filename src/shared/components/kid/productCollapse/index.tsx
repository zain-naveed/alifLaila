import classNames from "classnames";
import { useEffect } from "react";
import styles from "./style.module.scss";

interface Props {
  isCollapse: boolean;
  onClick: () => void;
  description: string;
  heading: string;
  Expand: any;
  HidIcon: any;
  collapseId: string;
}

function ProductCollapse(props: Props) {
  const {
    isCollapse,
    onClick,
    description,
    heading,
    HidIcon,
    Expand,
    collapseId,
  } = props;

  useEffect(() => {
    let divItem = document.getElementById(collapseId);
    if (divItem) {
      if (divItem.clientHeight == 0) {
        divItem.style.height = "auto";
      }
      let height = divItem.clientHeight;
      divItem.style.height = height + 20 + "px";
    }
  }, [isCollapse]);
  return (
    <>
      <div onClick={onClick} className={classNames(styles.collapseHeading)}>
        <span>{heading}</span>
        {isCollapse ? <Expand /> : <HidIcon />}
      </div>
      <div
        id={collapseId}
        className={classNames(
          styles.collapseItem,
          isCollapse ? styles.hide : styles.open
        )}
      >
        {description}
      </div>
    </>
  );
}

export default ProductCollapse;
