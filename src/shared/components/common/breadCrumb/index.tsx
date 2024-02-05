import { BreadCrumbIcon } from "assets";
import { useSelector } from "react-redux";
import styles from "./style.module.scss";
import classNames from "classnames";
import dynamic from "next/dynamic";

const BreadCrumb = () => {
  const {
    breadcrumb: { crumbs },
  } = useSelector((state: any) => state.root);
  return (
    <>
      <div className="d-flex align-items-center">
        {crumbs.map(
          (item: { title: string; action?: () => void }, indx: number) => {
            return (
              <div
                key={indx}
                className={classNames("d-flex align-items-center")}
              >
                <div
                  className={
                    crumbs.length == 1
                      ? styles.breadCrumbActive
                      : indx < crumbs.length - 1
                      ? styles.breadCrumbDefault
                      : styles.breadCrumbActive
                  }
                  key={indx}
                  onClick={item?.action}
                  role="button"
                >
                  {item?.title}
                </div>
                {crumbs.length - 1 > indx ? <BreadCrumbIcon /> : null}
              </div>
            );
          }
        )}
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(BreadCrumb), {
  ssr: false,
});
