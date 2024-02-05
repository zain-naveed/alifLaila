import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { Spinner } from "react-bootstrap";

interface BtnProps extends React.HTMLProps<HTMLButtonElement> {
  containerStyle: any;
  Icon: any;
  iconStyle: any;
  loading?: boolean;
  IconDirction: string;
  disabled?: boolean;
}

const CustomButton = ({
  title,
  onClick,
  containerStyle,
  Icon,
  iconStyle,
  loading,
  IconDirction,
  disabled,
  style,
}: Partial<BtnProps>) => {
  const direction = {
    left: "left",
    right: "right",
  };
  return (
    <button
      className={classNames(
        styles.customBtnContainer,
        containerStyle && containerStyle,
        disabled && styles.noAction
      )}
      onClick={onClick}
      disabled={disabled || loading}
      type="submit"
      style={style}
    >
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <>
          {IconDirction === direction.left ? (
            Icon ? (
              <Icon className={iconStyle ? iconStyle : ""} />
            ) : null
          ) : null}

          <span>{title}</span>
          {IconDirction === direction.right ? (
            Icon ? (
              <Icon className={iconStyle ? iconStyle : ""} />
            ) : null
          ) : null}
        </>
      )}
    </button>
  );
};

export default CustomButton;
