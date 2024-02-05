import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

const SingleTestimonialLoader = () => {
  return <BoxLoader iconStyle={classNames(styles.testmonialContainer)} />;
};

export default SingleTestimonialLoader;
