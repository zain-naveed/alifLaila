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
    <div className={classNames("d-none d-lg-flex gap-3 gap-xxl-4")}>
      {kidRole === kidAccountRole.family ? (
        <>
          {familyReaderHeaderItems?.map((item, ind) => {
            return (
              <Link
                className={classNames(
                  styles.listItemtext,
                  activeTab === item?.route && styles.activeItem
                )}
                key={ind}
                href={item?.route}
              >
                {item?.name}
              </Link>
            );
          })}
        </>
      ) : (
        <>
          {readerHeaderItems?.map((item, ind) => {
            return (
              <Link
                className={classNames(
                  styles.listItemtext,
                  activeTab === item?.route && styles.activeItem
                )}
                key={ind}
                href={item?.route}
              >
                {item?.name}
              </Link>
            );
          })}
        </>
      )}
    </div>
  );
};

export default NavItemsList;
