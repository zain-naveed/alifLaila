import classNames from "classnames";
import styles from "../style.module.scss";
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

  return (
    <Link
      href={path ? path : ""}
      className={classNames(
        isActive ? styles.activeNavItemContainer : styles.navItemContainer
      )}
    >
      {Icon ? (
        <Image src={Icon} alt="" className={classNames(styles.icon)} />
      ) : null}
      <div className={!path ? styles.logout : styles.heading} role="button">
        {title}
      </div>
    </Link>
  );
};

export default NavItem;
