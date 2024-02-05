import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { headerItems, readerHeaderItems } from "shared/utils/constants";
import { roles } from "shared/utils/enum";
import styles from "../style.module.scss";

const FooterList = () => {
  const { login } = useSelector((state: any) => state.root);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("/");
  useEffect(() => {
    setActiveTab(location.pathname);
  }, []);
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-center gap-3 gap-sm-4 flex-wrap"
      )}
    >
      <>
        {login?.isLoggedIn && login?.user?.role === roles.reader ? (
          <>
            {readerHeaderItems.map((item, ind) => {
              return (
                <label
                  className={classNames(
                    styles.listItemtext,
                    activeTab === item?.route && styles.activeItem
                  )}
                  key={ind}
                  onClick={() => {
                    router.push(item?.route);
                  }}
                >
                  {item?.name}
                </label>
              );
            })}
          </>
        ) : (
          <>
            {headerItems.map((item, ind) => {
              return (
                <label
                  className={classNames(
                    styles.listItemtext,
                    activeTab === item?.route && styles.activeItem
                  )}
                  key={ind}
                  onClick={() => {
                    router.push(item?.route);
                  }}
                >
                  {item?.name}
                </label>
              );
            })}
          </>
        )}
      </>
    </div>
  );
};

export default FooterList;
