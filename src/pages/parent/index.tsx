import classNames from "classnames";
import HeaderSection from "shared/components/common/headerSection";
import InfoCard from "shared/components/infoCard";
import {
  ArrowDownside,
  ArrowUpside,
  ParentAbout1,
  ParentAbout2,
  ParentAbout3,
  ParentAbout4,
  ParentAsset1,
  PublisherAsset2,
} from "assets";
import Footer from "shared/components/footer";
import LandingContentSection from "shared/components/landingContentSection";
import MainNavWrapper from "shared/components/navWrapper/main";
import {
  ContentData,
  StaticInfo,
} from "shared/utils/pageConstant/parent/parentConstants";
import styles from "./style.module.scss";
import { useRef } from "react";
import { useScroll } from "shared/customHook/useScoll";
import Image from "next/image";

const Parents = () => {
  const bodyRef = useRef<any>(null);
  useScroll(bodyRef);
  return (
    <>
      <MainNavWrapper />
      <div className={classNames(styles.topLevelContainer)} ref={bodyRef}>
        <HeaderSection isParent />
        <div
          className={classNames(
            styles.customContainer,
            "px-3 px-sm-0 w-100 mt-5"
          )}
        >
          <label
            className={classNames(styles.label, "w-100 text-center pt-4 pb-5")}
          >
            <label className={classNames(styles.highlighted1)}>
              Parents Initiative{" "}
            </label>{" "}
            <label className={classNames(styles.highlighted2)}>
              {" "}
              to Nurture Kids'{" "}
            </label>{" "}
            <label className={classNames(styles.highlighted3)}>
              {" "}
              Imagination
            </label>
          </label>
          <div className={classNames("row")}>
            {StaticInfo.map((itm, inx) => {
              return <InfoCard {...itm} index={inx} key={inx} />;
            })}
          </div>
        </div>
        <LandingContentSection
          isParentLanding={true}
          contentImg={PublisherAsset2}
          contentArr={ContentData}
        />
        {/* <ParentGuide /> */}
        <Footer showDownload />
      </div>
    </>
  );
};

export default Parents;

const ParentGuide = () => {
  return (
    <div
      className={classNames(styles.customContainer, "w-100 text-center pb-3")}
    >
      <div>
        <label className={styles.label1}>
          <label className={styles.highlighted3}>Getting Started:</label>{" "}
          <label className={styles.highlighted2}>
            A Parent's Guide to Joining
          </label>{" "}
          <label className={styles.highlighted1}>AlifLaila</label>
        </label>
      </div>

      <div className="d-block d-lg-flex justify-content-center mt-5 mb-5">
        <div className="mt-lg-0 mt-3 d-flex flex-column align-items-center justify-content-center">
          <Image
            src={ParentAbout1}
            alt="parent-guide"
            className={styles.aboutImage}
          />
          <label className={classNames(styles.aboutLabel)}>
            Get membership
          </label>
        </div>
        <div className="d-none d-lg-flex align-items-end">
          <ArrowUpside className="w-100" />
        </div>
        <div className="mt-lg-0 mt-3 d-flex flex-column align-items-center justify-content-center">
          <Image
            src={ParentAbout2}
            alt="parent-guide"
            className={styles.aboutImage}
          />
          <label className={classNames(styles.aboutLabel)}>
            Create Profiles
          </label>
        </div>
        <div className="d-none d-lg-flex">
          <ArrowDownside className="w-100" />
        </div>
        <div className="mt-lg-0 mt-3 d-flex flex-column align-items-center justify-content-center">
          <Image
            src={ParentAbout3}
            alt="parent-guide"
            className={styles.aboutImage}
          />
          <label className={classNames(styles.aboutLabel)}>Assign Books</label>
        </div>
        <div className="d-none d-lg-flex align-items-end">
          <ArrowUpside className="w-100 " />
        </div>
        <div className="mt-lg-0 mt-3 d-flex flex-column align-items-center justify-content-center">
          <Image
            src={ParentAbout4}
            alt="parent-guide"
            className={styles.aboutImage}
          />
          <label className={classNames(styles.aboutLabel)}>
            Let kids start reading the books
          </label>
        </div>
      </div>
    </div>
  );
};
