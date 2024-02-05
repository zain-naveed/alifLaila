import { CopyIcon } from "assets";
import classNames from "classnames";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import styles from "./style.module.scss";
import { plansDurationEnum } from "shared/utils/enum";

interface Props {
  plan: any;
  setStep: (val: number) => void;
}

const BankDetails = ({ setStep, plan }: Props) => {
  //@ts-ignore
  const handleCopyToClipboard = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toastMessage("success", "Copied Successfully");
      })
      .catch((error) => {});
  };

  function handleSubmit() {
    setStep(2);
  }

  return (
    <div className={classNames("d-flex flex-column w-100 align-items-center")}>
      <div className={classNames(styles.statsContainer, "mx-4")}>
        <div className={classNames("d-flex flex-column align-items-start")}>
          <label className={classNames(styles.statsTitle)}>Plan Type</label>

          <label className={classNames(styles.statsValue)}>
            {
              //@ts-ignore
              plansDurationEnum[plan?.duration]
            }
          </label>
        </div>
        <div className={classNames("d-flex flex-column align-items-start")}>
          <label className={classNames(styles.statsTitle)}>Amount</label>
          <label className={classNames(styles.statsValue)}>
            Rs.{" "}
            {plan?.is_discounted
              ? Math.trunc(plan?.discounted_price)
              : Math.trunc(plan?.price)}
          </label>
        </div>
        <div className={classNames("d-flex flex-column align-items-start")}>
          <label className={classNames(styles.statsTitle)}>Coins</label>
          <label className={classNames(styles.statsValue)}>
            {Math.trunc(plan?.coins)}
          </label>
        </div>
      </div>
      <div className={classNames(styles.seperator)} />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-4"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row align-items-center w-100 gap-0 gap-sm-3"
          )}
        >
          <CustomInput
            label="Bank Name"
            placeholder="Enter Bank Name"
            customLabelStyle={classNames(styles.customLabelStyle)}
            customInputContainer={classNames(styles.customInputContainerStyle)}
            customInputStyle={classNames(styles.customInputStyle)}
            value={"United Bank Limited"}
            readOnly
            readOnlyColor="#fffbf3"
          />
          <CustomInput
            label="Account Title"
            placeholder="Enter Account Title"
            required
            customLabelStyle={classNames(styles.customLabelStyle)}
            customInputContainer={classNames(styles.customInputContainerStyle)}
            customInputStyle={classNames(styles.customInputStyle)}
            value={"Ehya Education Services"}
            readOnly
            readOnlyColor="#fffbf3"
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column flex-sm-row align-items-center w-100 gap-0 gap-sm-3"
          )}
        >
          <CustomInput
            label="Account No."
            placeholder="Enter Account Number"
            required
            customLabelStyle={classNames(styles.customLabelStyle)}
            customInputContainer={classNames(styles.customInputContainerStyle)}
            customInputStyle={classNames(styles.customInputStyle)}
            IconDirection="right"
            Icon={CopyIcon}
            customIconStyle={classNames(styles.customInputIconStyle)}
            handleIconClick={() => {
              handleCopyToClipboard("305284572");
            }}
            value={"305284572"}
            readOnly
            readOnlyColor="#fffbf3"
          />
          <CustomInput
            label="Branch No."
            placeholder="Enter Branch Number"
            required
            customLabelStyle={classNames(styles.customLabelStyle)}
            customInputContainer={classNames(styles.customInputContainerStyle)}
            customInputStyle={classNames(styles.customInputStyle)}
            value={"1307"}
            readOnly
            readOnlyColor="#fffbf3"
          />
        </div>
        <CustomInput
          label="IBAN"
          placeholder="Enter IBAN"
          required
          customLabelStyle={classNames(styles.customLabelStyle)}
          customInputContainer={classNames(styles.customInputContainerStyle)}
          customInputStyle={classNames(styles.customInputStyle)}
          IconDirection="right"
          Icon={CopyIcon}
          customIconStyle={classNames(styles.customInputIconStyle)}
          handleIconClick={() => {
            handleCopyToClipboard("PK62UNIL0109000305284572");
          }}
          value={"PK62UNIL0109000305284572"}
          readOnly
          readOnlyColor="#fffbf3"
        />
        <div className="d-flex w-75 align-items-center mt-2">
          <label className={classNames(styles.line)}></label>
          <label className={classNames("px-2", styles.greyLabel)}>Or</label>
          <label className={classNames(styles.line)}></label>
        </div>
        <label className={classNames(styles.descriptionWarning,"mt-3 mb-4")}>If you have purchased our membership card, upload its picture</label>
        
        <CustomButton
          title="Upload Screenshot"
          containerStyle={classNames(styles.btnStyle)}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </div>
  );
};

export default BankDetails;
