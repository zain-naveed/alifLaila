import React, { useCallback } from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import CustomInput from "shared/components/common/customInput";
import { useFormik } from "formik";
import { PaymentScreenShotVS } from "shared/utils/validations";
import { checkFileType, formatBytes } from "shared/utils/helper";
import { BookUploadIcon, CoverMediaUploadIcon, closeImg } from "assets";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import Image from "next/image";
import Progress from "shared/components/publisher/progress";
import { useDropzone } from "react-dropzone";
import { toastMessage } from "shared/components/common/toast";
import CustomButton from "shared/components/common/customButton";
import { uploadReceiptInfo } from "shared/services/kid/plansService";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";
import {
  kidPanelConstant,
  parentPanelConstant,
} from "shared/routes/routeConstant";
import { ProfileTabsEnums } from "shared/utils/pageConstant/kid/profileConstant";
import { TabsEnums } from "shared/utils/pageConstant/parent/settingsConstants";

interface Props {
  handleClose: () => void;
  planId: any;
  handleShowPaymentVerificationModal: () => void;
}

interface InitialValues {
  transId: string;
  transDate: string;
  file: any;
}

const UploadScreenShot = ({
  planId,
  handleClose,
  handleShowPaymentVerificationModal,
}: Props) => {
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);
  const router = useRouter();

  const initialValues: InitialValues = {
    transId: "",
    transDate: "",
    file: "",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: PaymentScreenShotVS,
    onSubmit: () => {
      handleBuyPlan();
    },
  });

  const {
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    setSubmitting,
    setFieldValue,
  } = formik;

  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];
    if (getFile) {
      const fileSizeInBytes = getFile.size;
      const fileSizeInKilobytes = fileSizeInBytes / 1024;
      const fileSizeInMegabytes = fileSizeInKilobytes / 1024;
      if (Number(fileSizeInMegabytes) < 50) {
        if (checkFileType(getFile.type)) {
          setFieldValue("file", getFile);
        } else {
          toastMessage(
            "error",
            "Only image/jpg, image/jpeg, image/gif, image/png are supported"
          );
        }
      } else {
        toastMessage("error", "File is too large");
      }
    }
    // eslint-disable-next-line
  }, []);

  const handleBuyPlan = () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("plan_id", planId);
    formData.append("transaction_id", values.transId);
    formData.append("transaction_date", values.transDate);
    formData.append("receipt_image", values.file);

    uploadReceiptInfo(formData)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
          handleClose();
          handleShowPaymentVerificationModal();
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("Error", err?.response?.data?.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className={classNames("d-flex flex-column w-100 align-items-center px-4")}
    >
      <div
        className={classNames(
          "d-flex flex-column flex-sm-row align-items-center w-100 gap-0 gap-sm-3"
        )}
      >
        <CustomInput
          label="Transaction ID"
          placeholder="Enter Transaction ID or Card #"
          required
          customLabelStyle={classNames(styles.customLabelStyle)}
          customInputContainer={classNames(styles.customInputContainerStyle)}
          customInputStyle={classNames(styles.customInputStyle)}
          value={values.transId}
          error={touched.transId && errors.transId ? errors.transId : ""}
          onChange={handleChange("transId")}
        />
        <CustomInput
          label="Transaction Date"
          placeholder="Enter Transaction Date"
          required
          customLabelStyle={classNames(styles.customLabelStyle)}
          customInputContainer={classNames(styles.customInputContainerStyle)}
          customInputStyle={classNames(styles.customInputStyle)}
          value={values.transDate}
          error={touched.transDate && errors.transDate ? errors.transDate : ""}
          onChange={handleChange("transDate")}
          isDate
          type="date"
        />
      </div>
      <input
        type={"file"}
        id="file"
        {...getInputProps()}
        className="d-none"
        accept="image/*"
      />
      <div
        className={classNames(
          "position-relative w-100",
          touched.file && errors.file ? "mb-0" : "mb-3"
        )}
      >
        <div className="d-flex flex-column" role="button">
          {values?.file ? (
            <ActivePreview
              fileName={values?.file?.name ? values?.file?.name : "Cover"}
              fileSize={values?.file?.size ? values?.file?.size : "200000"}
              removeFile={(e: any) => {
                e.stopPropagation();
                setFieldValue("file", "");
              }}
            />
          ) : (
            <DefaultPreview getRootProps={getRootProps} />
          )}
        </div>

        {!!touched.file && errors.file && (
          <div className={styles.error}>{String(errors.file)}</div>
        )}
      </div>
      <CustomButton
        title="Submit Screenshot"
        containerStyle={classNames(styles.btnStyle)}
        onClick={() => {
          handleSubmit();
        }}
        loading={isSubmitting}
        disabled={isSubmitting}
      />
    </div>
  );
};

const DefaultPreview = ({ getRootProps }: any) => {
  return (
    <label
      className={classNames(
        styles.bookUploadContainer,
        "d-flex justify-content-center align-items-center"
      )}
      {...getRootProps({
        onClick: (e: any) => e.stopPropagation(),
      })}
      htmlFor="file"
      role="button"
    >
      <div className={classNames("text-center")}>
        <BookUploadIcon />
        <div
          className={classNames(styles.bookUploadContent, "d-flex flex-column")}
        >
          <span className={classNames(styles.uploadText)}>
            Click to upload your Screenshot
          </span>
          <span className={classNames(styles.dragText)}>or drag and drop</span>
        </div>
      </div>
    </label>
  );
};
interface ActivePreviewProps {
  removeFile: (e: any) => void;
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

export default UploadScreenShot;
