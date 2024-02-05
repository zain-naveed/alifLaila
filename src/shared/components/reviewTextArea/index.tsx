import { SendIcon } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  required: boolean;
  error: string;
  placeholder: string;
  onChange: any;
  handleSubmit:()=>void
}

const ReviewTextArea = ({
  label,
  required,
  error,
  value,
  placeholder,
  onChange,
  handleSubmit
}: Partial<InputProps>) => {
  return (
    <div className="position-relative mb-3 w-100">
      <div className="d-flex flex-column">
        <label className={classNames(styles.inputLabel)}>
          {label} {!!required && <label className={styles.asterik}>*</label>}
        </label>
        <div className={classNames(styles.inputContainer)}>
          <textarea
            onChange={onChange}
            placeholder={placeholder}
            className={classNames(styles.inputStyle)}
            value={value}
          />
          <button onClick={handleSubmit} className={classNames(styles.reviewButton)}>
            Send
            <SendIcon />
          </button>
        </div>
      </div>
      {!!error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default ReviewTextArea;
