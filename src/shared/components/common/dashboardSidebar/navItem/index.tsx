import classNames from "classnames";
import React from "react";
import styles from "../style.module.scss";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";

interface navItemInterface {
  path?: string;
  title: string;
  isActive: boolean;
  Icon: any;
}
const NavItem = (props: navItemInterface) => {
  const { title, isActive, Icon, path } = props;
  const {
    sidebar: { isShown },
  } = useSelector((state: any) => state.root);

  return (
    <Link
      className={classNames(
        isActive ? styles.activeNavItemContainer : styles.navItemContainer
      )}
      href={path ? path : ""}
    >
      {Icon ? (
        <Image src={Icon} alt="" className={classNames(styles.icon)} />
      ) : null}

      <label
        className={classNames(
          isShown ? (!path ? styles.logout : styles.heading) : "d-none"
        )}
        role="button"
      >
        {title}
      </label>
    </Link>
  );
};

export default NavItem;
