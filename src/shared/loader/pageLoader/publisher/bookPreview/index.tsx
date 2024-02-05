import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import styles from "./style.module.scss";

interface Props {}
function BookPreviewLoading(props: Props) {
  //   var pages = "";
  const {} = props;

  return <BoxLoader iconStyle={classNames(styles.singlePage)} />;
}

export default BookPreviewLoading;
