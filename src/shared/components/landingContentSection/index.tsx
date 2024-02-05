import classNames from "classnames";
import Image from "next/image";
import styles from "./style.module.scss";
import { ParentWave, SchoolWave } from "assets";
interface Props {
  isParentLanding?: any;
  contentImg: any;
  contentArr: Array<any>;
}

function LandingContentSection(props: Props) {
  const { isParentLanding, contentImg, contentArr } = props;

  return (
    <div className={classNames("d-flex flex-column")}>
      <Image
        src={isParentLanding ? ParentWave : SchoolWave}
        alt="wave"
        className={classNames("w-100 mt-5", styles.waveStyle)}
      />
      <div
        className={classNames(
          isParentLanding ? styles.bg1 : styles.bg2,
          styles.learningCont,
          "mt-0 mb-0"
        )}
      >
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 w-100 mt-0 mb-0"
          )}
        >
          <div
            className={classNames(
              "row p-0 m-0 w-100",
              !isParentLanding ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={classNames(
                "col-12 col-md-6 d-flex align-items-center justify-content-center justify-content-center"
              )}
            >
              <Image
                src={contentImg}
                alt="publisher-asset-1"
                className={classNames(styles.asset1)}
              />
            </div>
            <div
              className={classNames(
                "col-12 col-md-6 d-flex flex-column align-items-center justify-content-center mt-4 mt-md-0 position-relative"
              )}
            >
              <div
                className={classNames(
                  styles.contentSubContainer,
                  "gap-xl-4 gap-3 d-flex flex-column"
                )}
              >
                {isParentLanding ? (
                  <label className={classNames(styles.contentTitle, "mb-2")}>
                    Need Full{" "}
                    <label className={classNames(styles.highlighted3)}>
                      Benefits?
                    </label>{" "}
                    Must-Have
                    <label className={classNames(styles.highlighted)}>
                      Aliflaila
                    </label>
                  </label>
                ) : (
                  <label className={classNames(styles.contentTitle, "mb-2")}>
                    Achieve so much more with
                    <label className={classNames(styles.highlighted4)}>
                      AlifLaila
                    </label>
                  </label>
                )}

                <div
                  className={classNames("d-flex flex-column gap-xl-5 gap-4")}
                >
                  {contentArr?.map((Itm, inx) => {
                    return (
                      <div
                        className={classNames(
                          "d-flex align-items-center gap-2"
                        )}
                        key={inx}
                      >
                        <Itm.Icon className={styles.contentIcon} />
                        <label className={styles.contentLabel}>
                          {Itm.paragraph}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={isParentLanding ? ParentWave : SchoolWave}
        alt="wave"
        className={classNames("w-100 mb-5", styles.rotate, styles.waveStyle)}
      />
    </div>
  );
}

export default LandingContentSection;
