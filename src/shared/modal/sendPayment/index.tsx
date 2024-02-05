import { BookUploadIcon, CoverMediaUploadIcon, closeImg } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import Progress from "shared/components/publisher/progress";
import { checkFileType, formatBytes } from "shared/utils/helper";
import { SendPaymentVS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { useRouter } from "next/router";
import { sendAuthorsPayments } from "shared/services/publisher/authorsService";

interface SendPaymentModalProps {
  showModal: boolean;
  handleClose: () => void;
  item: any;
  setItem: (val: any) => void;
}

interface InitialValues {
  transactionId: string;
  date: string;
  banner: any;
}

const SendPaymentModal = ({
  showModal,
  handleClose,
  item,
  setItem,
}: SendPaymentModalProps) => {
  const initialValues: InitialValues = {
    transactionId: "",
    date: "",
    banner: "",
  };

  const router = useRouter();

  const [bannerfile, setBannerFile] = useState<any>(null);

  const onClose = () => {
    handleClose?.();
    formik.resetForm();
    setBannerFile(null);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: SendPaymentVS,
    onSubmit: (value, action) => {
      action.setSubmitting(true);
      handleRegistration(value);
    },
  });

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setFieldValue,
    setSubmitting,
    resetForm,
  } = formik;

  const handleRegistration = (value: InitialValues) => {
    setSubmitting(true);
    const formData = new FormData();
    //@ts-ignore
    formData.append("partner_id", router?.query?.id);
    formData.append("payment_id", item?.id);
    formData.append("transaction_id", value.transactionId);
    formData.append("payment_date", value.date);
    formData.append("receipt_image", values.banner);
    sendAuthorsPayments(formData)
      .then(({ data: { data, status, message } }) => {
        if (status) {
          setItem(data);
          toastMessage("success", message);
          resetForm();
          handleClose();
          setBannerFile(null);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      centered
      backdrop="static"
      dialogClassName={styles.reportDialog}
    >
      <Modal.Body className={classNames("px-4 py-4 d-flex flex-column gap-0")}>
        <>
          <div
            className={classNames(
              "d-flex align-items-center justify-content-between w-100 mb-3"
            )}
          >
            <label className={styles.labelText}>Upload Receipt</label>
            <div
              onClick={onClose}
              role={"button"}
              className={classNames(styles.closeImageContainer, "pointer")}
            >
              <Image src={closeImg} alt="close" />
            </div>
          </div>
          <div className={classNames("d-flex align-items-center gap-5 mb-3")}>
            <div className={classNames("d-flex flex-column align-items-start")}>
              <label className={classNames(styles.title)}>Amount</label>
              <label className={classNames(styles.subTitle)}>Rs. 108.00</label>
            </div>
            <div
              className={classNames(
                "d-flex flex-column align-items-start ms-5"
              )}
            >
              <label className={classNames(styles.title)}>
                Deducted Amount
              </label>
              <label className={classNames(styles.subTitle)}>Rs. 108.00</label>
            </div>
          </div>
          <div
            className={classNames(
              "d-flex w-100 flex-column flex-sm-row align-items-center justify-content-center gap-3"
            )}
          >
            <CustomInput
              label="Transaction ID"
              required
              placeholder="Type here"
              customLabelStyle={classNames(styles.inputLabel)}
              customInputStyle={classNames(styles.inputStyle)}
              customInputContainer={classNames(styles.inputContainer)}
              type="text"
              value={values.transactionId}
              error={
                touched.transactionId && errors.transactionId
                  ? errors.transactionId
                  : ""
              }
              onChange={handleChange("transactionId")}
            />
            <CustomInput
              label="Payment Date"
              required
              placeholder="MM - DD - YYYY"
              customLabelStyle={classNames(styles.inputLabel)}
              customInputStyle={classNames(styles.inputStyle)}
              customInputContainer={classNames(styles.inputContainer)}
              type="date"
              isDate
              value={values.date}
              error={touched.date && errors.date ? errors.date : ""}
              onChange={handleChange("date")}
            />
          </div>
          <div className="d-flex flex-column">
            {bannerfile ? (
              <ActivePreview
                fileName={bannerfile?.name}
                fileSize={bannerfile?.size}
                removeFile={() => {
                  setBannerFile(null);
                }}
                progress={100}
              />
            ) : (
              <PhotoUpload
                callback={(file: any) => {
                  setBannerFile(file);
                  setFieldValue("banner", file);
                }}
                error={touched.banner && errors.banner ? true : false}
              />
            )}

            <div className={classNames(styles.error)}>
              {touched.banner && errors.banner ? String(errors.banner) : ""}
            </div>
          </div>

          <div className={classNames("d-flex w-100 justify-content-end mt-4")}>
            <CustomButton
              title={"Upload Photo"}
              containerStyle={styles.reportButton}
              onClick={() => {
                handleSubmit();
              }}
              loading={isSubmitting}
              disabled={isSubmitting}
            />
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

const PhotoUpload = ({ callback, error }: any) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];
    if (getFile) {
      if (checkFileType(getFile.type)) {
        callback(getFile);
      } else {
        toastMessage("error", "Only JPG, JPEG, PNG are supported");
      }
    }
    // eslint-disable-next-line
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      <input type={"file"} id="file" {...getInputProps()} className="d-none" />
      <label
        {...getRootProps({
          onClick: (e: any) => e.stopPropagation(),
        })}
        htmlFor="file"
        className={classNames(styles.uploadContainer, error ? "mb-0" : "mb-3")}
        role="button"
      >
        <div className={classNames("text-center")}>
          <BookUploadIcon />
          <div className={classNames(styles.bookUploadContent)}>
            Click to upload transaction photo
            <span className={classNames("ms-2")}>drag and drop</span>
            <p>{"PNG, JPG, JPEG"} </p>
          </div>
        </div>
      </label>
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
      <div className={classNames(styles.bookUploadActivePreview, "mb-3")}>
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

export default SendPaymentModal;
