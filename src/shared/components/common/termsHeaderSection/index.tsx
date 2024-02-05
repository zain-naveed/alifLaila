import classNames from "classnames";
import styles from "./style.module.scss";
interface TermsHeaderSectionProps {
  label: string;
  subtitle: string;
}

const TermsHeaderSection = ({ label, subtitle }: TermsHeaderSectionProps) => {
  return (
    <div className={classNames(styles.headerContainer)}>
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex w-100"
        )}
      >
        <div
          className={classNames(
            styles.contentContainer,
            "d-flex flex-column align-items-center justify-content-center gap-3"
          )}
        >
          <label className={classNames(styles.mainHeading)}>{label}</label>
          <label className={classNames(styles.subTitle)}>{subtitle}</label>
        </div>
      </div>
    </div>
  );
};

export default TermsHeaderSection;
