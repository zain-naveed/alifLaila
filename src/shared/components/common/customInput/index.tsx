import classNames from "classnames";
import styles from "./style.module.scss";
import {
  ForwardRefRenderFunction,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { HidePasswordIcon, ShowPasswordIcon } from "assets";
import { isNumberCheck } from "shared/utils/helper";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  error: string;
  notRequiredMargin?: boolean;
  customLabelStyle: any;
  customInputStyle: any;
  customInputContainer: any;
  customIconStyle: any;
  isPassword: boolean;
  Icon: any;
  isDate: boolean;
  isNumber?: boolean;
  formikKey?: string;
  setFieldValue?: (val: any, val2: any) => void;
  IconDirection: string;
  handleIconClick?: () => void;
  readOnlyColor?: string;
}

const CustomInput: ForwardRefRenderFunction<any, Partial<InputProps>> = (
  {
    label,
    required,
    error,
    value,
    placeholder,
    type,
    onChange,
    notRequiredMargin,
    onKeyDown,
    customLabelStyle,
    customInputStyle,
    customInputContainer,
    customIconStyle,
    isPassword,
    readOnly,
    Icon,
    onPaste,
    isDate,
    defaultValue,
    min,
    isNumber,
    formikKey,
    setFieldValue,
    IconDirection = "left",
    handleIconClick,
    readOnlyColor,
  },
  ref
) => {
  const [inputType, setInputType] = useState<string>(type ? type : "");
  const dateRef: any = useRef(null);
  const [width, setWidth] = useState<number | undefined>(0);
  const direction = {
    left: "left",
    right: "right",
  };

  const handleResizeObserver = () => {
    const elem = document.getElementById("input-container");
    setWidth(elem?.clientWidth ? elem?.clientWidth : 0);
  };

  const handleKeyPress = (e: any) => {
    if (e.code !== "Backspace") {
      if (!isNumberCheck(e)) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleOnChange = (value: string) => {
    const text = value.replace(/[^\d\S.]/g, "");
    if (text === "") {
      setFieldValue?.(formikKey, "");
      return;
    }
    setFieldValue?.(formikKey, value);
  };

  useEffect(() => {
    let topElem: any = document.getElementById("input-container");
    const observer: any = new ResizeObserver(handleResizeObserver).observe(
      topElem
    );
    return () => {
      observer?.unobserve(topElem);
    };
  }, []);
  return (
    <div
      className={classNames(
        "position-relative w-100",
        notRequiredMargin ? "" : error ? "mb-0" : "mb-3"
      )}
    >
      <div className="d-flex flex-column">
        {label ? (
          <label
            className={classNames(
              styles.inputLabel,
              customLabelStyle && customLabelStyle
            )}
          >
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
        ) : null}

        <div
          className={classNames(
            styles.inputContainer,
            "gap-2",
            readOnly ? styles.readonly : "",
            customInputContainer && customInputContainer
          )}
          style={readOnlyColor ? { background: readOnlyColor } : {}}
          id="input-container"
        >
          {IconDirection === direction.left ? (
            Icon ? (
              <Icon
                onClick={handleIconClick}
                className={classNames(customIconStyle)}
              />
            ) : null
          ) : null}

          {!!isDate ? (
            <>
              <div className={`${styles.dateInputToggle}`}>
                <label
                  htmlFor="dateInput"
                  role={"button"}
                  className={`${styles.dateInputToggleButton}`}
                />
                <input
                  defaultValue={defaultValue}
                  type={type}
                  id="dateInput"
                  name="dateInput"
                  disabled={readOnly}
                  placeholder={placeholder}
                  className={`${styles.dateInputStyle}`}
                  value={value}
                  ref={dateRef}
                  onChange={onChange}
                  min={min}
                />
              </div>
              <input
                defaultValue={defaultValue}
                type={"text"}
                disabled={readOnly}
                placeholder={placeholder}
                className={`${styles.date_disable_cursor} ${styles.inputStyle} ${styles.dateInputTextStyle}`}
                value={value}
                onClick={() => {
                  dateRef.current.showPicker();
                }}
              />
            </>
          ) : isNumber ? (
            <input
              ref={ref}
              defaultValue={defaultValue}
              type={"text"}
              placeholder={placeholder}
              className={classNames(
                styles.inputStyle,
                customInputStyle && customInputStyle,
                readOnly ? styles.readonly : ""
              )}
              value={value}
              onChange={(e) => handleOnChange(e.target.value)}
              onKeyDown={handleKeyPress}
              readOnly={readOnly}
              onPaste={onPaste}
            />
          ) : (
            <input
              ref={ref}
              defaultValue={defaultValue}
              type={inputType}
              placeholder={placeholder}
              className={classNames(
                styles.inputStyle,
                customInputStyle && customInputStyle,
                readOnly ? styles.readonly : ""
              )}
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              readOnly={readOnly}
              onPaste={onPaste}
            />
          )}
          {isPassword &&
            (inputType === "password" ? (
              <HidePasswordIcon
                role="button"
                onClick={() => setInputType("text")}
                className={classNames(styles.iconStyle)}
              />
            ) : (
              <ShowPasswordIcon
                role="button"
                onClick={() => setInputType("password")}
                className={classNames(styles.iconStyle)}
              />
            ))}

          {IconDirection === direction.right ? (
            Icon ? (
              <Icon
                onClick={handleIconClick}
                className={classNames(customIconStyle)}
              />
            ) : null
          ) : null}
        </div>
      </div>
      {!!error && (
        <div className={classNames(styles.error)} style={{ maxWidth: width }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default forwardRef(CustomInput);
