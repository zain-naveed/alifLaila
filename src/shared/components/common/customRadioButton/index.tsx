import classNames from "classnames";
import styles from "./style.module.scss";

interface CustomRadioButtonProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  customCheckContainer?: any;
  customLabelStyle?: any;
  customDotStyle?: any;
}

const CustomRadioButton = ({
  label,
  isActive,
  onClick,
  customCheckContainer,
  customDotStyle,
  customLabelStyle,
}: CustomRadioButtonProps) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start gap-2"
      )}
      onClick={onClick}
      role="button"
    >
      <div
        className={classNames(
          customCheckContainer ? customCheckContainer : styles?.checkContainer,
          isActive && styles.activeCheckContainer
        )}
      >
        {isActive ? (
          <div
            className={classNames(
              customDotStyle ? customDotStyle : styles.dotStyle
            )}
          />
        ) : null}
      </div>
      <span
        className={classNames(
          customLabelStyle ? customLabelStyle : styles.labelStyle
        )}
      >
        {label}
      </span>
    </div>
  );
};

export default CustomRadioButton;
