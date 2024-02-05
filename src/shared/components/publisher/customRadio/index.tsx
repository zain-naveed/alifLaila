import styles from "./style.module.scss";

const CustomRadio = ({
  label,
  required,
  arr,
  handleCheck,
  active,
  name,
}: Partial<{
  name: string;
  label: string;
  arr: Array<any>;
  required: boolean;
  handleCheck: (args?: any) => any;
  active: string | number | any;
}>) => {
  return (
    <>
      <label htmlFor="asd" className={styles.label}>
        {label} {!!required && <label className={styles.asterik}>*</label>}
      </label>
      <div className="d-flex align-items-center mb-3">
        {arr?.map((item: { label: string; value: number }, inx: number) => {
          return (
            <div
              className="me-4 d-flex align-items-center"
              key={`${item.label}-radio-${inx}`}
            >
              <input
                type={"radio"}
                name={name}
                className={styles.input}
                id={item.label}
                onChange={() => {
                  if (handleCheck) {
                    handleCheck(item);
                  }
                }}
                checked={active == item.value}
              />
              <label htmlFor={item.label} className={styles.radio_label}>
                {item.label}
              </label>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CustomRadio;
