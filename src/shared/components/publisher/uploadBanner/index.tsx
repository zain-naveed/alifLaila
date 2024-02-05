import {
  BookUploadIcon,
  CoverMediaUploadIcon,
  CrossIcon,
  closeImg,
} from "assets";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import CropModal from "shared/modal/crop";
import { checkFileType, classNames, formatBytes } from "shared/utils/helper";
import Progress from "../progress";
import styles from "./style.module.scss";
interface InputProps {
  label: string;
  required: boolean;
  error?: string;
  setFileCover: any;
  fileCover: any;
  formikSetFieldValue?: any;
  onBannerChange?: any;
  value: any;
}

function UploadBanner(props: InputProps) {
  const {
    label,
    error,
    required,
    formikSetFieldValue,
    fileCover,
    setFileCover,
    onBannerChange,
    value,
  } = props;

  const [coverPic, setCoverPic] = useState<any>(null);
  const [showCropper, setShowCropper] = useState<boolean>(false);

  const handleShowCropper = () => {
    setShowCropper(true);
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
  };

  const handleUpload = (e: any) => {
    let file: File | any = e?.target?.files?.[0];
    if (file) {
      if (file.size > 50000000) {
        toastMessage("error", "File size should be less than 50MB");
        return;
      } else if (!checkFileType(file.type)) {
        toastMessage("error", "Only JPG, JPEG, PNG are supported");
        return;
      }
      let url = URL.createObjectURL(file);
      setCoverPic(url);
      handleShowCropper();
    }
  };

  const handleSaveAction = (croppedFile: any) => {
    handleCloseCropper();
    setFileCover(croppedFile);
    if (formikSetFieldValue) {
      formikSetFieldValue("uploadCover", croppedFile);
    }
    onBannerChange(croppedFile);
  };

  const removeFile = () => {
    setFileCover(null);
    onBannerChange(null);
    if (formikSetFieldValue) {
      formikSetFieldValue("uploadCover", null);
    }
  };

  return (
    <>
      <input
        type={"file"}
        onChange={(e) => handleUpload(e)}
        className="d-none"
        id="cover"
        accept="image/*"
      />
      <div className="position-relative mb-3 w-100">
        <div className="d-flex flex-column">
          <label className={classNames(styles.inputLabel)}>
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
          {fileCover ? (
            <ActivePreview
              fileName={fileCover?.name}
              fileSize={fileCover?.size}
              removeFile={() => removeFile()}
            />
          ) : value ? (
            <div className={classNames("position-relative")}>
              <img
                src={value}
                alt=""
                height={126}
                width={720}
                className={classNames(styles.bookCover)}
              />
              <div
                className={classNames(styles.crossContainer)}
                onClick={() => {
                  removeFile();
                }}
              >
                <CrossIcon />
              </div>
            </div>
          ) : (
            <DefaultPreview />
          )}
        </div>

        {!!error && <div className={styles.error}>{error}</div>}
      </div>
      <CropModal
        show={showCropper}
        handleClose={handleCloseCropper}
        coverPic={coverPic}
        aspectRatio={1440 / 300}
        handleAction={handleSaveAction}
      />
    </>
  );
}
const DefaultPreview = () => {
  return (
    <label className={"pointer"} htmlFor="cover">
      <div
        className={classNames(
          styles.bookUploadContainer,
          "d-flex justify-content-center align-items-center"
        )}
      >
        <div className={classNames("text-center")}>
          <BookUploadIcon />
          <div className={classNames(styles.bookUploadContent)}>
            <span className={classNames(styles.uploadText)}>
              Click to upload your banner image
            </span>
            <span className={classNames("ms-2", styles.dragText)}>
              or drag and drop
            </span>
            <p>{"SVG, PNG, JPG or GIF (max. 800x400px)"} </p>
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
                <Image src={closeImg} alt="image Not found" />
              </div>
            </div>
            <Progress value={100} />
          </div>
        </div>
      </label>
    </>
  );
};

export default dynamic(() => Promise.resolve(UploadBanner), {
  ssr: false,
});
