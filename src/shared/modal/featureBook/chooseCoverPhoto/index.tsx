import {
  BookUploadIcon,
  CoverMediaUploadIcon,
  DefaultBookImg,
  ThinnerTickIcon,
  closeImg,
} from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomRadioButton from "shared/components/common/customRadioButton";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import Progress from "shared/components/publisher/progress";
import { checkFileType, formatBytes } from "shared/utils/helper";
import { FeatureRequestVS } from "shared/utils/validations";
import { radioOptions, radioOptionsWithoutRecent } from "./constants";
import styles from "./style.module.scss";
import { requestFeature } from "shared/services/publisher/featureService";
import { featureCoverEnums } from "shared/utils/enum";

interface Props {
  step: any;
  setStep: (val: number) => void;
  file: any;
  setFile: (val: any) => void;
  setCoverPic: (val: any) => void;
  handleClose: () => void;
  selected: any;
  recentCovers: any[];
  isFirst?: boolean;
  history: any[];
  setHistory: (val: any) => void;
  history_id?: any;
}

interface InitialValues {
  start: string;
  end: string;
}

const ChooseCoverPhoto = ({
  step,
  setStep,
  file,
  setFile,
  setCoverPic,
  handleClose,
  selected,
  recentCovers,
  isFirst,
  history,
  setHistory,
  history_id,
}: Props) => {
  const initialValues: InitialValues = {
    start: "",
    end: "",
  };

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedCover, setSelectedCover] = useState<any>(null);

  const handleRequest = () => {
    setSubmitting(true);
    let formData = new FormData();
    formData.append("book_id", String(selected?.id));
    if (activeIndex === 0) {
      formData.append("cover_type", String(featureCoverEnums?.upload));
      formData.append("cover_image", file);
    } else if (activeIndex === 1 && recentCovers?.length > 0) {
      formData.append("cover_type", String(featureCoverEnums?.recent));
      formData.append("recent_cover_id", selectedCover?.id);
    } else if (
      (activeIndex === 1 && recentCovers?.length < 1) ||
      activeIndex === 2
    ) {
      formData.append("cover_type", String(featureCoverEnums?.request));
    }
    formData.append("start_date", values.start);
    formData.append("end_date", values.end);
    requestFeature(formData)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          toastMessage("success", message);
          if (!isFirst) {
            let tempArr = [...history];
            tempArr.unshift(data);
            setHistory(tempArr);
          } else {
            let filterArr = history?.filter((i, ii) => i?.id !== history_id);
            filterArr.unshift(data);
            setHistory(filterArr);
          }
          resetForm();
          handleClose();
          setActiveIndex(0);
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

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: FeatureRequestVS,
    onSubmit: () => {
      handleRequest();
    },
  });

  return (
    <>
      <ModalHeader
        back={() => {
          setStep(step - 1);
        }}
        isFirst={isFirst}
        close={() => {
          handleClose();
        }}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-4 pb-4 pt-3"
        )}
      >
        <label className={classNames(styles.title, " w-100")}>
          Cover Photo
        </label>

        <div
          className={classNames(
            "d-flex align-items-center justify-content-start my-3 gap-3 w-100 flex-wrap"
          )}
        >
          {recentCovers?.length > 0 ? (
            <>
              {radioOptions.map((itm, inx) => {
                return (
                  <CustomRadioButton
                    label={itm}
                    isActive={activeIndex === inx}
                    onClick={() => {
                      setActiveIndex(inx);
                      setSelectedCover(recentCovers[0]);
                    }}
                    customCheckContainer={classNames(styles.checkContainer)}
                    customDotStyle={classNames(styles.dotStyle)}
                    customLabelStyle={classNames(styles.labelStyle)}
                  />
                );
              })}
            </>
          ) : (
            <>
              {radioOptionsWithoutRecent.map((itm, inx) => {
                return (
                  <CustomRadioButton
                    label={itm}
                    isActive={activeIndex === inx}
                    onClick={() => {
                      setActiveIndex(inx);
                      setSelectedCover(recentCovers[0]);
                    }}
                    customCheckContainer={classNames(styles.checkContainer)}
                    customDotStyle={classNames(styles.dotStyle)}
                    customLabelStyle={classNames(styles.labelStyle)}
                  />
                );
              })}
            </>
          )}
        </div>
        {activeIndex === 0 ? (
          <>
            {file ? (
              <ActivePreview
                fileName={file?.name}
                fileSize={file?.size}
                removeFile={() => {
                  setFile(null);
                }}
                progress={100}
              />
            ) : (
              <PhotoUpload
                setCoverPic={setCoverPic}
                handleShowCropper={() => {
                  setStep(3);
                }}
              />
            )}
          </>
        ) : null}

        {activeIndex === 1 && recentCovers?.length > 0 ? (
          <div
            className={classNames(
              "d-flex aling-items-center gap-2 flex-wrap w-100 mb-3"
            )}
          >
            {recentCovers?.map((itm, inx) => {
              return (
                <div
                  className={classNames("position-relative")}
                  key={inx}
                  onClick={() => {
                    setSelectedCover(itm);
                  }}
                >
                  <img
                    src={itm?.cover_photo}
                    alt="cover"
                    height={100}
                    width={250}
                    className={classNames(styles.recentCover)}
                  />
                  {itm?.id === selectedCover?.id ? (
                    <div className={classNames(styles.activeContainer)}>
                      <div className={classNames(styles.tickContianer)}>
                        <ThinnerTickIcon />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        <div
          className={classNames(
            "d-flex align-items-center gap-3 w-100 flex-column flex-sm-row"
          )}
        >
          <object
            data={selected?.thumbnail}
            type="image/png"
            className={classNames(styles.bookCover, "pointer")}
          >
            <Image
              src={DefaultBookImg}
              alt="book-cover"
              height={194}
              width={154}
              className={classNames(styles.bookCover)}
            />
          </object>

          <div
            className={classNames(
              "d-flex flex-column align-items-start w-100 justify-content-center gap-2"
            )}
          >
            <div
              className={classNames("d-flex align-items-center gap-2 w-100")}
            >
              <label className={classNames(styles.bookTitle)}>
                {selected?.title}
              </label>
              <label className={classNames(styles.authorName)}>
                by {selected?.book_author?.name}
              </label>
            </div>
            <label className={classNames(styles.desc)}>
              Select start and end date to appear this book in feature list
            </label>
            <div
              className={classNames(
                "d-flex align-items-center gap-3 w-100 flex-column flex-sm-row"
              )}
            >
              <CustomInput
                label="Start Date"
                type="date"
                isDate
                placeholder="Select Start Date"
                customInputContainer={classNames(styles.inputContainer)}
                value={values.start}
                error={touched.start && errors.start ? errors.start : ""}
                onChange={handleChange("start")}
              />
              <CustomInput
                label="Due Date"
                type="date"
                isDate
                placeholder="Select Due Date"
                customInputContainer={classNames(styles.inputContainer)}
                value={values.end}
                error={touched.end && errors.end ? errors.end : ""}
                onChange={handleChange("end")}
              />
            </div>
          </div>
        </div>
        <CustomButton
          title="Request To Feature"
          containerStyle={classNames(styles.btn, "mt-3")}
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </>
  );
};

const PhotoUpload = ({ setCoverPic, handleShowCropper }: any) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    let getFile: any = acceptedFiles[0];
    if (getFile) {
      if (checkFileType(getFile.type)) {
        let url = URL.createObjectURL(getFile);
        setCoverPic(url);
        handleShowCropper();
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
        className={classNames(styles.uploadContainer, "mb-3")}
        role="button"
      >
        <div className={classNames("text-center")}>
          <BookUploadIcon />
          <div className={classNames(styles.bookUploadContent)}>
            <span className={classNames("ms-2")}>drag and drop</span>
            <p>{"SVG, PNG, JPG or GIF (max. 800x400px)"} </p>
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

export default ChooseCoverPhoto;
