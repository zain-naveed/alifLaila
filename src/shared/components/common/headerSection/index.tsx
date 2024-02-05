import classNames from "classnames";
import styles from "./style.module.scss";
import CustomButton from "../customButton";
import { ParentVector, SchoolVector } from "assets";

interface HeaderSectionProps {
  isParent?: boolean;
  isBg2?: boolean;
  isBooksScreen?: boolean;
  isPlansScreen?: boolean;
}

const HeaderSection = ({
  isParent,
  isBg2,
  isBooksScreen,
  isPlansScreen,
}: HeaderSectionProps) => {
  return (
    <div
      className={classNames(
        isBg2 ? styles.headerContainer2 : styles.headerContainer,
        "align-items-center align-items-md-end"
      )}
    >
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex position-relative w-100 mt-0 mt-md-auto",
          isParent ? "mb-0 mb-md-auto" : "mb-0"
        )}
      >
        <div className={classNames("d-flex w-100")}>
          {isPlansScreen ? (
            <label className={classNames(styles.mainHeading)}>
              Plans For{" "}
              <label className={classNames(styles.highlighted1)}>
                individual account
              </label>{" "}
              &{" "}
              <label className={classNames(styles.highlighted2)}>
                Family Account
              </label>
            </label>
          ) : isBooksScreen ? (
            <label className={classNames(styles.mainHeading)}>
              Delve into world of{" "}
              <label className={classNames(styles.highlighted1)}>
                enchanting stories
              </label>{" "}
              All at your{" "}
              <label className={classNames(styles.highlighted2)}>
                fingertips
              </label>
            </label>
          ) : isParent ? (
            <div
              className={classNames(
                "d-flex align-items-center w-100 justify-content-between "
              )}
            >
              <div className={styles.parentTextContainer}>
                <label className={classNames(styles.mainHeading)}>
                  <label className={classNames(styles.highlighted1)}>
                    Read Together.
                  </label>{" "}
                  Create{" "}
                  <label className={classNames(styles.highlighted2)}>
                    Memories
                  </label>{" "}
                  that Last{" "}
                  <label className={classNames(styles.highlighted2)}>
                    a Lifetime.
                  </label>
                </label>
              </div>
              <ParentVector
                className={classNames(styles.vector2, "d-none d-md-inline")}
              />
            </div>
          ) : (
            <div
              className={classNames(
                "d-flex align-items-center w-100 justify-content-between"
              )}
            >
              <div
                className={classNames(
                  "d-flex flex-column align-items-start justify-content-center"
                )}
              >
                <label className={classNames(styles.mainHeading)}>
                  <span className={classNames(styles.highlighted2)}>
                    Join AlifLaila
                  </span>{" "}
                  - Together we can{" "}
                  <span
                    className={classNames(
                      styles.mainHeading,
                      styles.highlighted1
                    )}
                  >
                    Enrich Learning{" "}
                  </span>
                </label>
                <CustomButton
                  title="Join as School"
                  containerStyle={classNames(styles.btnStyle)}
                />
              </div>
              <SchoolVector
                className={classNames(styles.vector, "d-none d-md-inline")}
                style={{ height: "100%" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSection;
