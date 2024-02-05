import { AboutAlifLaila, SchoolAsset1, SchoolAssets2 } from "assets";
import classNames from "classnames";
import HeaderSection from "shared/components/common/headerSection";
import Footer from "shared/components/footer";
import InfoCard from "shared/components/infoCard";
import LandingContentSection from "shared/components/landingContentSection";
import MainNavWrapper from "shared/components/navWrapper/main";
import {
  ContentData,
  StaticInfo,
} from "shared/utils/pageConstant/schoolConstant";
import styles from "./style.module.scss";
import { useRef } from "react";
import { useScroll } from "shared/customHook/useScoll";
import Image from "next/image";

const School = () => {
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <MainNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <HeaderSection isBg2 />
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 w-100 mt-5"
          )}
        >
          <label className={classNames(styles.label, "w-100 text-centerpt-4")}>
            <label className={classNames(styles.highlighted3)}>AlifLaila</label>{" "}
            <label className={classNames(styles.highlighted2)}>
              - the First Choice of Schools
            </label>
          </label>
          <div className="text-center pb-5 pt-3">
            <label className={styles.subLabel}>
              Enrich classrooms with captivating stories
            </label>
            <br />
            <label className={styles.subLabel}>
              Nurture holistic development
            </label>
          </div>
          <div className={classNames("row")}>
            {StaticInfo.map((itm, inx) => {
              return <InfoCard {...itm} index={inx} key={inx} />;
            })}
          </div>
        </div>
        <LandingContentSection
          isParentLanding={false}
          contentImg={SchoolAssets2}
          contentArr={ContentData}
        />
        <div
          className={classNames(
            styles.customContainer,
            "d-flex flex-lg-row flex-column mb-5 gap-4 align-items-center w-100 px-3 px-sm-0"
          )}
        >
          <Image
            src={AboutAlifLaila}
            alt="about"
            className={classNames("w-100 pb-lg-0 mb-3", styles.aboutImg)}
          />

          <div className="w-100">
            <label
              className={classNames(styles.label, "text-left")}
              style={{ textAlign: "left" }}
            >
              <span className={styles.highlighted2}>At</span>{" "}
              <span className={styles.highlighted3}>AlifLaila,</span>{" "}
              <span className={styles.highlighted2}>
                we offer educators a path to greater flexibility & impact
                through
              </span>{" "}
              <span className={styles.highlighted1}>individual accounts.</span>
            </label>

            <label className={classNames(styles.aboutDescription)}>
              With an individual account, teachers have the freedom to nurture
              the joy of reading in children of all ages on a larger scale.
            </label>

            <label className={classNames(styles.aboutDescription)}>
              It's the perfect choice for educators looking to inspire and
              engage with a diverse range of students, igniting a love for both
              local and global literature that knows no bounds.
            </label>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default School;
