import { ReportIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import styles from "./style.module.scss";
import { getReportList, report } from "shared/services/kid/reportService";
import { useRouter } from "next/router";
import { toastMessage } from "shared/components/common/toast";
import { useSelector } from "react-redux";

interface ReportModalProps {
  showModal: boolean;
  handleClose: () => void;
  type: number;
}

const ReportModal = ({
  showModal,
  handleClose,
  type,
}: Partial<ReportModalProps>) => {
  const router = useRouter();
  const {
    login: { isLoggedIn },
  } = useSelector((state: any) => state.root);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [showTextField, setShowTextField] = useState<boolean>(false);

  const handleOptionChange = (itm: any, isOther: boolean) => {
    setSelectedOption(itm);
    if (isOther) {
      setShowTextField(true);
    } else {
      setShowTextField(false);
    }
  };

  const handleGetReportList = () => {
    getReportList(type)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setList(data);
          setSelectedOption(data?.[0]);
        }
      })
      .catch((err) => {});
  };

  const onClose = () => {
    setShowTextField(false);
    setText("");

    setSelectedOption(list ? list[0] : "");
    if (handleClose) {
      handleClose();
    }
  };

  const handleReport = () => {
    let formData = new FormData();
    formData.append("type", String(type));
    formData.append("reportable_id", String(router.query.id));
    if (selectedOption?.title === "Other") {
      formData.append("reason", text);
    } else {
      formData.append("report_reason_id", selectedOption?.id);
    }
    if (selectedOption?.title === "Other" && text !== "") {
      setLoading(true);
      report(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            handleClose?.();
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    } else if (selectedOption?.title !== "Other") {
      setLoading(true);
      report(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            onClose();
            toastMessage("success", message);
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    } else {
      toastMessage("error", "Please write something");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleGetReportList();
    }
  }, [isLoggedIn]);

  return (
    <Modal
      show={showModal}
      onHide={onClose}
      centered
      backdrop
      dialogClassName={styles.reportDialog}
    >
      <Modal.Body className={classNames("px-4 py-4 d-flex flex-column gap-3")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-start gap-3 "
          )}
        >
          <ReportIcon className={classNames(styles.reportIcon)} />
          <label className={styles.labelText}>
            Report {type === 2 ? "This User" : "This Book"}
          </label>
        </div>
        <div className={classNames("d-flex flex-column gap-2")}>
          {list?.map((type: any, inx: any) => (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
              key={inx}
              onClick={() => {
                handleOptionChange(type, false);
              }}
              role="button"
            >
              <div
                className={classNames(styles.dotContainer)}
                style={
                  selectedOption?.title !== type?.title
                    ? { borderColor: "#ADB5BD" }
                    : {}
                }
              >
                {selectedOption?.title === type?.title ? (
                  <div className={classNames(styles.dot)} />
                ) : null}
              </div>
              <label className={classNames(styles.optionLabel)} role="button">
                {type?.title}
              </label>
            </div>
          ))}
          <div
            className={classNames(
              "d-flex align-items-center justify-content-start gap-2"
            )}
            onClick={() => {
              handleOptionChange({ id: 33, title: "Other" }, true);
            }}
          >
            <div
              className={classNames(styles.dotContainer)}
              style={
                selectedOption?.title !== "Other"
                  ? { borderColor: "#ADB5BD" }
                  : {}
              }
            >
              {selectedOption?.title === "Other" ? (
                <div className={classNames(styles.dot)} />
              ) : null}
            </div>
            <label className={classNames(styles.optionLabel)}>Other</label>
          </div>
        </div>
        {showTextField ? (
          <textarea
            style={{ resize: "none" }}
            className={styles.textAreaComp}
            value={text}
            onChange={(e: any) => setText(e.target.value)}
            placeholder="Write your reason here..."
          />
        ) : (
          ""
        )}
        <div className={classNames("d-flex gap-3")}>
          <CustomButton
            title="Cancel"
            containerStyle={styles.cancelButton}
            onClick={onClose}
          />
          <CustomButton
            title="Report"
            containerStyle={styles.reportButton}
            onClick={handleReport}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportModal;
