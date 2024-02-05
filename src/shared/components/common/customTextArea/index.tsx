import classNames from "classnames";
import styles from "./style.module.scss";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  required: boolean;
  error: string;
  placeholder: string;
  onChange: any;
  customLabelStyle: any;
  customInputStyle: any;
  customInputContainer: any;
}

const CustomTextArea = ({
  label,
  required,
  error,
  value,
  placeholder,
  onChange,
  customLabelStyle,
  customInputStyle,
  customInputContainer,
}: Partial<InputProps>) => {
  return (
    <div className="position-relative mb-3 w-100">
      <div className="d-flex flex-column">
        <label
          className={classNames(
            styles.inputLabel,
            customLabelStyle && customLabelStyle
          )}
        >
          {label} {!!required && <label className={styles.asterik}>*</label>}
        </label>
        <div
          className={classNames(
            styles.inputContainer,
            customInputContainer && customInputContainer
          )}
        >
          <textarea
            onChange={onChange}
            placeholder={placeholder}
            className={classNames(
              styles.inputStyle,
              customInputStyle && customInputStyle
            )}
            value={value}
          />
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default CustomTextArea;
