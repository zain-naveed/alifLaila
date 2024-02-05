import React, { useEffect, useState } from "react";
import styles from "./style.module.scss";
import getCroppedImg from "./cropImage";
import ModalHeader from "shared/components/modalHeader";
import classNames from "classnames";
import Cropper from "react-easy-crop";
import CustomButton from "../customButton";
import { ImageIcon } from "assets";

interface Props {
  coverPic: any;
  handleClose: () => void;
  aspectRatio: any;
  isVerticalOrientation?: boolean;
  handleAction: (val: any) => void;
  label?: string;
  isFirst?: boolean;
  handleBackAction?: () => void;
}

const CropperCard = ({
  handleClose,
  coverPic,
  aspectRatio,
  isVerticalOrientation,
  handleAction,
  label,
  isFirst,
  handleBackAction,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<any>(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const [slider, setSlider] = useState<number>(0);
  const [ImageCropFile, setImageCropFile] = useState("");
  const [loading, setloading] = useState<boolean>(false);
  const [initialLoading,setInitialLoading]=useState<boolean>(true);

  useEffect(() => {
    // @ts-ignore
    if (document.getElementById("cropperInput")) {
      // @ts-ignore
      document.getElementById("cropperInput").oninput = function () {
        // @ts-ignore
        var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        // @ts-ignore
        this.style.background =
          "linear-gradient(to right, #EF437B 0%, #EF437B " +
          value +
          "%, #F0F3F6 " +
          value +
          "%, #F0F3F6 100%)";
      };
    }
  });

  const CROP_AREA_ASPECT = aspectRatio ? aspectRatio : 2.5 / 1;
  const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
    if (coverPic) {
      setInitialLoading(true);
        getCroppedImg(coverPic, croppedAreaPixels).then((img) => {
          setImageCropFile(img);
      }).finally(()=>{
        setInitialLoading(false);
      });
      
    }
  };

  const saveCrop = () => {
    setloading(true);
    setTimeout(() => {
      setloading(false);
      handleAction(ImageCropFile);
    }, 1000);
  };
  return (
    <>
      <ModalHeader
        close={() => {
          handleClose();
        }}
        isFirst={isFirst}
        headerStyle={styles.header}
        back={handleBackAction}
      />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-5 pb-4 pt-3"
        )}
      >
        <Cropper
          image={coverPic}
          aspect={CROP_AREA_ASPECT}
          crop={crop}
          zoom={zoom}
          onCropChange={(size) => {
            console.log("Crop", size);
            setCrop(size);
          }}
          onZoomChange={(size) => {
            console.log("Zoom", size);
            setZoom(size);
          }}
          showGrid={false}
          onCropComplete={onCropComplete}
          onCropAreaChange={(croppedArea) => {
            setCroppedArea(croppedArea);
          }}
          cropShape={"rect"}
          objectFit={isVerticalOrientation ? "contain" : "horizontal-cover"}
        />

        <div className="d-flex align-items-center gap-3 my-3">
          <ImageIcon className={styles.small_icon} />
          <input
            id="cropperInput"
            min="1"
            step={0.5}
            max="60"
            onChange={(e: any) => {
              if (e.target.value !== 0) {
                setZoom(e.target.value);
                setSlider(e.target.value);
                setCrop({ x: -e.target.value, y: -e.target.value });
              } else {
                setZoom(1);
              }
            }}
            type="range"
            value={slider}
          />
          <ImageIcon className={styles.large_icon} />
        </div>
        <label className={classNames(styles.desc)}>
          {label ? label : "Adjust Cover Photo"}
        </label>
        {!initialLoading?(
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center gap-3 mt-3"
          )}
        >
          <CustomButton
            title="Cancel"
            containerStyle={classNames(styles.cancelBtn)}
            onClick={handleClose}
          />
          <CustomButton
            title="Save"
            containerStyle={classNames(styles.saveBtn)}
            onClick={saveCrop}
            loading={loading}
            disabled={loading}
          />
        </div>

        ):null}
      </div>
    </>
  );
};

export default CropperCard;
