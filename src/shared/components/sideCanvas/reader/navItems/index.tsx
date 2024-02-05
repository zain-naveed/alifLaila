import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  familyReaderHeaderItems,
  readerHeaderItems,
} from "shared/utils/constants";
import { kidAccountRole } from "shared/utils/enum";
import styles from "../style.module.scss";

const NavItemsList = () => {
  const {
    login: { kidRole },
  } = useSelector((state: any) => state.root);
  const [activeTab, setActiveTab] = useState<string>("/");

  useEffect(() => {
    setActiveTab(location.pathname);
  }, []);

  return (
    <div className={classNames("d-flex flex-column p-4")}>
      {kidRole === kidAccountRole.family ? (
        <>
          {familyReaderHeaderItems?.map((Item, ind) => {
            return (
              <Link
                className={classNames(
                  "d-flex align-items-center justify-content-start",
                  styles.itemContainer
                )}
                key={ind}
                role="button"
                href={Item?.route}
              >
                <Item.Icon
                  className={classNames(
                    styles.routeIconStyle,
                    activeTab !== Item?.route && styles.inActiveIcon
                  )}
                />
                <label
                  className={classNames(
                    styles.listItemtext,
                    activeTab === Item?.route && styles.activeItem
                  )}
                  key={ind}
                >
                  {Item?.name}
                </label>
              </Link>
            );
          })}
        </>
      ) : (
        <>
          {readerHeaderItems?.map((Item, ind) => {
            return (
              <Link
                className={classNames(
                  "d-flex align-items-center justify-content-start",
                  styles.itemContainer
                )}
                key={ind}
                role="button"
                href={Item?.route}
              >
                <Item.Icon
                  className={classNames(
                    styles.routeIconStyle,
                    activeTab !== Item?.route && styles.inActiveIcon
                  )}
                />
                <label
                  className={classNames(
                    styles.listItemtext,
                    activeTab === Item?.route && styles.activeItem
                  )}
                  key={ind}
                >
                  {Item?.name}
                </label>
              </Link>
            );
          })}
        </>
      )}
    </div>
  );
};

export default NavItemsList;
