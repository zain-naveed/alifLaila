import classNames from "classnames";
import Heading from "../common/heading";
import styles from "./style.module.scss";
interface Props {
  Icon: any;
  title: string;
  ButtonHeading: string;
  onClick: () => void;
  buttonStyle: any;
}

function SocialButton(props: Partial<Props>) {
  const { Icon, title, ButtonHeading, onClick, buttonStyle } = props;

  return (
    <button
      onClick={onClick}
      className={classNames(buttonStyle ? buttonStyle : styles.button)}
    >
      <div>
        <Icon className={styles.iconWdith} />
      </div>
      <div className={classNames(styles.textContainer)}>
        <span className={styles.textTitle}>{title}</span>
        <Heading heading={ButtonHeading} headingStyle={styles.textHeading} />
      </div>
    </button>
  );
}

export default SocialButton;
