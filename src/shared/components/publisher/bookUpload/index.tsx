import { BookUploadIcon, CoverMediaUploadIcon, closeImg } from "assets";
import axios from "axios";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import { uploadBook } from "shared/services/publisher/bookService";
import { checkFileIsPdf, classNames, formatBytes } from "shared/utils/helper";
import Progress from "../progress";
import styles from "./style.module.scss";

interface InputProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  required: boolean;
  error?: string;
  formikSetFieldValue: any;
  bookFiles: any;
  setBookFile: any;
  bookId?: any;
}
const BookUpload = (props: InputProps) => {
  const {
    label,
    error,
    required,
    formikSetFieldValue,
    bookFiles,
    setBookFile,
    value,
    bookId,
  } = props;
  const cancelTokenRef = useRef<any>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileProgress, setFileProgress] = useState<number>(0);

  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];
    if (getFile) {
      const fileSizeInBytes = getFile.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;
      const fileSizeInMegabytes = fileSizeInKilobytes / 1024;
      if (Number(fileSizeInMegabytes) < 50) {
        if (checkFileIsPdf(getFile.type)) {
          handleUploadBook(getFile);
        } else {
          toastMessage("error", "Only pdf are supported");
        }
      } else {
        toastMessage("error", "File is too large");
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleUploadBook = (bookFile: File) => {
    const formBody = new FormData();
    formBody.append("file", bookFile);
    setIsUploading(true);
    setBookFile(bookFile);
    cancelTokenRef.current = axios.CancelToken.source();
    const config = {
      onUploadProgress: (progressEvent: any) => {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        //@ts-ignore
        setFileProgress(Number(progress).toFixed(2));
      },
      cancelToken: cancelTokenRef.current?.token,
    };
    uploadBook(formBody, config)
      .then(({ data: { message, status, data } }) => {
        if (status) {
          formikSetFieldValue("uploadBook", data);
        } else {
          toastMessage("error", message);
          setIsUploading(false);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        setIsUploading(false);
      });
  };
  const removeFile = () => {
    setBookFile(null);
    setIsUploading(false);
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }
    formikSetFieldValue("uploadBook", null);
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <input
        type={"file"}
        id="file"
        {...getInputProps()}
        className="d-none"
        accept="application/pdf"
      />
      <div className="position-relative mb-3 w-100">
        <div className="d-flex flex-column">
          <label className={classNames(styles.inputLabel)}>
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
          {isUploading ? (
            <ActivePreview
              fileName={bookFiles?.name}
              fileSize={bookFiles?.size}
              removeFile={() => removeFile()}
              progress={fileProgress}
            />
          ) : value ? (
            <ActivePreview
              fileName={`book_${bookId}.pdf`}
              removeFile={() => removeFile()}
              progress={100}
            />
          ) : (
            <label
              className={" pointer"}
              {...getRootProps({
                onClick: (e: any) => e.stopPropagation(),
              })}
              htmlFor="file"
            >
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
                      {bookFiles
                        ? "Click to upload another book"
                        : "Click to upload your book"}
                    </span>
                    <span className={classNames("ms-2", styles.dragText)}>
                      or drag and drop
                    </span>
                    {/* <div className={styles.fileSize}>
                      More then 50MB? Compress file here
                    </div> */}
                    <p className="mb-0">
                      {bookFiles ? bookFiles?.name : "PDF (max. 200mb)"}{" "}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          )}
        </div>

        {!!error && <div className={styles.error}>{error}</div>}
      </div>
    </>
  );
};
interface ActivePreviewProps {
  removeFile: () => void;
  fileName: string | any;
  fileSize?: number | any;
  progress: number;
}
const ActivePreview = (props: ActivePreviewProps) => {
  const { removeFile, fileName, fileSize, progress } = props;
  const parseFileSize = () => {
    return formatBytes(fileSize);
  };
  return (
    <>
      <div className={classNames(styles.bookUploadActivePreview)}>
        <CoverMediaUploadIcon className="me-3" />
        <div className="mt-2">
          <div className="d-flex justify-content-between">
            <div>
              <Heading heading={fileName} headingStyle={styles.coverHeading} />
              <Title
                title={fileSize ? parseFileSize() : "N/A"}
                titleStyle={styles.coverTitle}
              />
            </div>
            <div
              onClick={removeFile}
              role={"button"}
              className={classNames(styles.closeImageContainer, "pointer")}
            >
              <Image src={closeImg} alt="Image Not found" />
            </div>
          </div>
          <Progress value={progress} />
        </div>
      </div>
    </>
  );
};

export default BookUpload;
