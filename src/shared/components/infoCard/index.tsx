import classNames from "classnames";
import styles from "./style.module.scss";

interface InfoCardProps {
  index: number;
  Icon: any;
  title: string;
  content: string;
  color: string;
}

const InfoCard = ({ Icon, title, content, color }: InfoCardProps) => {
  return (
    <div
      className={classNames(
        "col-12 col-lg-4 pb-4"
        // styles.containerStyle
      )}
    >
      <div
        className={classNames(
          "d-flex flex-column justify-content-center align-items-center",
          styles.container
        )}
        style={{ borderColor: color }}
      >
        <Icon className={classNames(styles.iconStyle)} />
        <label className={classNames(styles.title,"pt-4 pb-3")} style={{ color: color }}>
          {title}
        </label>
        <label className={classNames(styles.subTitle)}>{content}</label>
      </div>
    </div>
  );
};

export default InfoCard;
