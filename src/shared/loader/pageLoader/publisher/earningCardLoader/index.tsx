import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";
const EarningCardLoader = () => {
  return <BoxLoader iconStyle={classNames(styles.cardContainer)} />;
};

export default EarningCardLoader;
