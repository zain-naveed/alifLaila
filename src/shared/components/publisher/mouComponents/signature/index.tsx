import classNames from "classnames";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import CustomRadioButton from "shared/components/common/customRadioButton";
import styles from "./style.module.scss";
import UploadCover from "../../uploadCover";

interface SignatureInterface {
  setFieldValue: (args: string, args1: any) => any;
  errorMsg: string;
}

const Signature = ({ setFieldValue, errorMsg }: SignatureInterface) => {
  let signautureRef: any = useRef(null);
  const [isDrawSignature, setIsDrawSignature] = useState<boolean>(true);
  const [fileCover, setFileCover] = useState<any>(null);

  const trim = () => {
    setFieldValue(
      "signature",
      signautureRef.getTrimmedCanvas().toDataURL("image/png")
    );
  };

  const toggle = (val: number) => {
    if (val === 1) {
      setIsDrawSignature(true);
    } else {
      setIsDrawSignature(false);
    }
    setFileCover(null);
    setFieldValue("signature", "");
  };

  const clearSignature = () => {
    signautureRef.clear();
    setFieldValue("signature", "");
  };

  return (
    <div
      className={classNames(
        "d-flex flex-column align-items-start w-100 row p-0 m-0"
      )}
    >
      <label className={classNames(styles.sginTitle)}>
        Signature <span>*</span>
      </label>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start my-3 gap-3"
        )}
      >
        <CustomRadioButton
          label="Draw Signature"
          isActive={isDrawSignature}
          onClick={() => toggle(1)}
        />
        <CustomRadioButton
          label="Upload Image"
          isActive={!isDrawSignature}
          onClick={() => toggle(2)}
        />
      </div>

      {isDrawSignature ? (
        <>
          <div className={classNames("p-0 m-0 position-relative")}>
            <SignatureCanvas
              penColor="black"
              dotSize={3}
              onEnd={(event) => {
                trim();
              }}
              ref={(ref) => {
                //@ts-ignore
                signautureRef = ref;
              }}
              canvasProps={{
                className: classNames(styles.signature, "col-12 p-0 m-0 "),
              }}
            />
            <label
              className={classNames(styles.clearLabel)}
              onClick={clearSignature}
            >
              Clear
            </label>
          </div>
          {errorMsg ? <span className="error">{errorMsg}</span> : null}
        </>
      ) : (
        <div className={classNames("p-0 m-0")}>
          <UploadCover
            fileCover={fileCover}
            setFileCover={setFileCover}
            formikSetFieldValue={setFieldValue}
            required={true}
            error={errorMsg}
            formikKey="signature"
            placeholder={"Click to upload your signature image"}
            customContainer={classNames(styles.signature, "mt-0")}
          />
        </div>
      )}
    </div>
  );
};

export default Signature;
