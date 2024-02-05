import classNames from "classnames";
import styles from "./style.module.scss";

interface HeaderSectionProps {
  isPlans?: boolean;
  title: string;
  subTitle: string;
  isBadges?: boolean;
}

const KidHeaderSection = ({
  isPlans,
  title,
  subTitle,
  isBadges,
}: HeaderSectionProps) => {
  return (
    <div
      className={classNames(
        isBadges
          ? styles.headerContainer2
          : isPlans
          ? styles.plansHeaderContainer
          : styles.headerContainer,
        "d-flex align-items-center justify-content-start w-100"
      )}
    >
      <div
        className={classNames(
          styles.customContainer,
          styles.mainContainer,
          "px-3 px-sm-0 gap-1 w-100"
        )}
      >
        <label
          className={classNames(styles.mainHeading)}
          style={isPlans ? { color: "#9A469B" } : {}}
        >
          {title}
        </label>
        <label
          className={classNames(styles.subHeading)}
          style={isPlans ? { color: "#0F1106" } : {}}
        >
          {subTitle}
        </label>
      </div>
    </div>
  );
};

export default KidHeaderSection;
