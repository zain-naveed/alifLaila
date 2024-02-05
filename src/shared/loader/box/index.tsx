import classNames from "classnames";
import styles from "./style.module.scss";
interface Props {
  height?: number;
  width?: number;
  iconStyle?: any;
  style?: any;
}

function BoxLoader(props: Props) {
  return (
    <>
      <div
        className={classNames(
          styles.skeletonLoader,
          styles.short_clip,
          props.iconStyle ? props.iconStyle : ""
        )}
        style={props?.style}
      ></div>
    </>
  );
}

export default BoxLoader;
