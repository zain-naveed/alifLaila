import { CameraIcon, defaultAvatar } from "assets";
import classNames from "classnames";
import React, { useState } from "react";
import { checkFileType } from "shared/utils/helper";
import { toastMessage } from "../common/toast";
import styles from "./style.module.scss";

interface Props {
  onFileChange: (data: any) => void;
  required?: boolean;
  label?: string;
  error?: any | string;
  id: number;
  preview?: string | null; // to preview an image
  customLabelStyle?: any;
  customContainer?: any;
  customIconStyle?: any;
}

function UploadProfile(props: Props) {
  const {
    onFileChange,
    required,
    label,
    error,
    id,
    preview,
    customLabelStyle,
    customContainer,
    customIconStyle,
  } = props;
  const [imagePreview, setImagePreview] = useState<string>("");
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImagePreview(url);
    } else {
      setImagePreview(preview ? preview : defaultAvatar.src);
    }
    onFileChange(file);
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex flex-column gap-2 gap-sm-1 gap-xl-3 align-items-center"
        )}
      >
        {label ? (
          <label
            className={classNames(
              styles.profileTitle,
              customLabelStyle && customLabelStyle
            )}
          >
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
        ) : null}

        <>
          <input
            type={"file"}
            accept="image/*"
            onChange={(e) => {
              handleImageUpload(e);
            }}
            required={required}
            id={`profile-${id}`}
            name="profile"
            className="d-none"
          />
          <div
            className={classNames(
              styles.profileImage,
              customContainer && customContainer,
              "position-relative"
            )}
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url(${
                imagePreview
                  ? imagePreview
                  : preview
                  ? preview
                  : defaultAvatar.src
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            <label
              htmlFor={`profile-${id}`}
              className={classNames(styles.camera)}
            >
              <CameraIcon
                className={classNames(
                  styles.iconStyle,
                  customIconStyle && customIconStyle
                )}
              />
            </label>
          </div>
        </>
        {!!error && <div className={styles.error}>{error}</div>}
      </div>
    </>
  );
}

export default UploadProfile;
