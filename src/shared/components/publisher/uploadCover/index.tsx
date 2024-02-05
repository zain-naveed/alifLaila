import { useState } from "react";
import { BookUploadIcon, CoverMediaUploadIcon, closeImg } from "assets";
import Image from "next/image";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import { checkFileType, classNames, formatBytes } from "shared/utils/helper";
import Progress from "../progress";
import styles from "./style.module.scss";
import CropModal from "shared/modal/crop";

interface InputProps {
  label?: string;
  required: boolean;
  error?: string;
  setFileCover: any;
  fileCover: any;
  formikSetFieldValue: any;
  formikKey: string;
  customContainer?: any;
  placeholder?: any;
  shoudlCrop?: boolean;
}

function UploadCover({
  label,
  error,
  required,
  formikSetFieldValue,
  fileCover,
  setFileCover,
  formikKey,
  customContainer,
  placeholder,
  shoudlCrop,
}: InputProps) {
  const [coverPic, setCoverPic] = useState<any>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState(Date.now());


  const handleShowCropper = () => {
    setShowCropper(true);
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
  };

  const handleUpload = (e: any) => {
    let file = e.target.files[0];
    if (checkFileType(file?.type)) {
      if (shoudlCrop) {
        let url = URL.createObjectURL(file);
        setCoverPic(url);
        handleShowCropper();
      } else {
        setFileCover(file);
        formikSetFieldValue(formikKey, file);
      }
    } else {
      toastMessage("error", "Only JPG, JPEG, PNG are supported");
    }
  };

  const handleSaveAction = (croppedFile: any) => {
    handleCloseCropper();
    setFileCover(croppedFile);
    formikSetFieldValue(formikKey, croppedFile);
  };

  const removeFile = () => {
    setCoverPic(null);
    setFileCover(null);
    formikSetFieldValue(formikKey, null);
    setInputKey(Date.now()); 
  };

  return (
    <>
      <input
        type={"file"}
        onChange={(e) => handleUpload(e)}
        className="d-none"
        id="cover"
        accept="image/*"
        key={inputKey}
      />
      <div className="position-relative mb-3 w-100">
        <div className="d-flex flex-column">
          {label ? (
            <label className={classNames(styles.inputLabel)}>
              {label}{" "}
              {!!required && <label className={styles.asterik}>*</label>}
            </label>
          ) : null}

          {fileCover ? (
            <ActivePreview
              fileName={fileCover?.name ? fileCover?.name : "Cover"}
              fileSize={fileCover?.size ? fileCover?.size : "200000"}
              removeFile={() => removeFile()}
            />
          ) : (
            <DefaultPreview
              placeholder={placeholder}
              customContainer={customContainer}
            />
          )}
        </div>

        {!!error && <div className={styles.error}>{error}</div>}
      </div>
      <CropModal
        show={showCropper}
        handleClose={handleCloseCropper}
        coverPic={coverPic}
        aspectRatio={230 / 335}
        handleAction={handleSaveAction}
        isVerticalOrientation
      />
    </>
  );
}
const DefaultPreview = ({ placeholder, customContainer }: any) => {
  return (
    <label className={"pointer"} htmlFor="cover">
      <div
        className={classNames(
          styles.bookUploadContainer,
          customContainer && customContainer,
          "d-flex justify-content-center align-items-center"
        )}
      >
        <div className={classNames("text-center")}>
          <BookUploadIcon />
          <div className={classNames(styles.bookUploadContent)}>
            <span className={classNames(styles.uploadText)}>
              {placeholder ? placeholder : "Click to upload Cover Photo"}
            </span>
          </div>
        </div>
      </div>
    </label>
  );
};
interface ActivePreviewProps {
  removeFile: () => void;
  fileName: string | any;
  fileSize: number | any;
}
const ActivePreview = (props: ActivePreviewProps) => {
  const { removeFile, fileName, fileSize } = props;
  const parseFileSize = () => {
    return formatBytes(fileSize);
  };
  return (
    <>
      <label>
        <div className={classNames(styles.bookUploadActivePreview)}>
          <CoverMediaUploadIcon className="me-3" />
          <div className="mt-2">
            <div className="d-flex justify-content-between">
              <div>
                <Heading
                  heading={fileName}
                  headingStyle={styles.coverHeading}
                />
                <Title title={parseFileSize()} titleStyle={styles.coverTitle} />
              </div>
              <div
                onClick={removeFile}
                role={"button"}
                className={classNames(styles.closeImageContainer, "pointer")}
              >
                <Image src={closeImg} alt="Image Not found" />
              </div>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </label>
    </>
  );
};

export default UploadCover;
