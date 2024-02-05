import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

function PublisherCardLoader() {
  return <BoxLoader iconStyle={classNames(styles.publisherCard, "mt-4")} />;
}

export default PublisherCardLoader;
