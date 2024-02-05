import { Modal } from "react-bootstrap";
import SelectBook from "./selectBook";
import styles from "./style.module.scss";
import { useState } from "react";
import ChooseCoverPhoto from "./chooseCoverPhoto";
import classNames from "classnames";
import CropperCard from "shared/components/common/cropper";

interface Props {
  show: boolean;
  handleClose: () => void;
  startingStep?: number;
  isFirst?: boolean;
  preSelected?: any;
  preRecentCovers?: any;
  history: any[];
  setHistory: (val: any) => void;
  history_id?: any;
}

function FeatureBookModal({
  show,
  handleClose,
  startingStep,
  isFirst,
  preSelected,
  preRecentCovers,
  history,
  setHistory,
  history_id,
}: Props) {
  const [step, setStep] = useState<number>(startingStep ? startingStep : 1);

  const close = () => {
    handleClose();
    setStep(1);
  };
  return (
    <Modal
      show={show}
      onHide={close}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={classNames(
        step === 1 ? styles.dailogContent : styles.dailogContent2
      )}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <Stepper
        handleClose={close}
        setStep={setStep}
        step={step}
        isFirst={isFirst}
        preSelected={preSelected}
        preRecentCovers={preRecentCovers}
        history={history}
        setHistory={setHistory}
        history_id={history_id}
      />
    </Modal>
  );
}

const Stepper = ({
  handleClose,
  step,
  setStep,
  isFirst,
  preSelected,
  preRecentCovers,
  history,
  setHistory,
  history_id,
}: any) => {
  const [file, setFile] = useState<any>(null);
  const [coverPic, setCoverPic] = useState<any>(null);
  const [selected, setSelected] = useState<any>(
    preSelected ? preSelected : null
  );
  const [recentCovers, setRecentCovers] = useState<any>(
    preRecentCovers ? preRecentCovers : []
  );

  const handleSaveAction = (croppedFile: any) => {
    setFile(croppedFile);
    setStep(2);
  };

  const close = () => {
    handleClose();
    setFile(null);
    setCoverPic(null);
    setSelected(null);
    setRecentCovers([]);
  };

  switch (step) {
    case 1:
      return (
        <SelectBook
          handleClose={close}
          selected={selected}
          setSelected={setSelected}
          setStep={setStep}
          setRecentCovers={setRecentCovers}
        />
      );
    case 2:
      return (
        <ChooseCoverPhoto
          selected={selected}
          handleClose={close}
          step={step}
          setStep={setStep}
          file={file}
          setFile={setFile}
          setCoverPic={setCoverPic}
          recentCovers={recentCovers}
          isFirst={isFirst}
          history={history}
          setHistory={setHistory}
          history_id={history_id}
        />
      );
    case 3:
      return (
        <CropperCard
          coverPic={coverPic}
          aspectRatio={848 / 286}
          handleAction={handleSaveAction}
          handleClose={close}
          handleBackAction={() => {
            setStep(2);
          }}
        />
      );
    default:
      return (
        <SelectBook
          handleClose={close}
          selected={selected}
          setSelected={setSelected}
          setStep={setStep}
          setRecentCovers={setRecentCovers}
        />
      );
  }
};

export default FeatureBookModal;
