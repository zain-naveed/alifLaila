import { AttachmentIcon, CrossIcon } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomTextArea from "shared/components/common/customTextArea";
import { toastMessage } from "shared/components/common/toast";
import ModalHeader from "shared/components/modalHeader";
import CustomSelect from "shared/components/publisher/customSelect";
import {
  createTicket,
  sendMessage,
} from "shared/services/publisher/ticketService";
import { checkFileIsDoc, checkFileType } from "shared/utils/helper";
import { TicketTypes } from "shared/utils/pageConstant/partner/supportConstant";
import { AddTicketVS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface Props {
  show: boolean;
  list: any[];
  handleClose: () => void;
  setList: (val: any[]) => void;
  setMessageList: (val: any[]) => void;
  setSelected: (val: any) => void;
}

interface InitialValues {
  title: string;
  type: string;
  messages: string;
}

function AddTicketModal({
  show,
  handleClose,
  list,
  setList,
  setMessageList,
  setSelected,
}: Props) {
  const initialValues: InitialValues = {
    title: "",
    type: "",
    messages: "",
  };

  const [ticketType, setTicketType] = useState<string>("");
  const [ticketfiles, setTicketFiles] = useState<any[]>([]);

  const handleSendMessage = async (ticketId: any) => {
    let messageStatus = false;
    let tempArr: any = [];
    const formData = new FormData();
    formData.append("ticket_id", ticketId);
    if (values.messages !== "") {
      formData.append("type", "1");
      formData.append("comment", values.messages);
      await sendMessage(formData)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            tempArr.push(data);
            messageStatus = true;
          }
        })
        .catch((err) => {
          messageStatus = false;
        })
        .finally(() => {
          if (ticketfiles?.length === 0) {
            setSubmitting(false);
          }
        });
    }
    if (ticketfiles?.length > 0) {
      for (let file of ticketfiles) {
        if (checkFileType(file?.type)) {
          if (formData.has("type")) {
            formData.set("type", "2");
          } else {
            formData.append("type", "2");
          }
        } else if (checkFileIsDoc(file?.type)) {
          if (formData.has("type")) {
            formData.set("type", "3");
          } else {
            formData.append("type", "3");
          }
        }
        if (formData.has("comment")) {
          formData.delete("comment");
        }
        formData.append("attachment", file);
        await sendMessage(formData)
          .then(({ data: { data, message, status } }) => {
            if (status) {
              tempArr.push(data);
              messageStatus = true;
              setTicketFiles([]);
            }
          })
          .catch((err) => {
            messageStatus = false;
          })
          .finally(() => {
            setSubmitting(false);
          });
      }
    }
    setMessageList(tempArr);
    if (messageStatus) {
      resetForm();
      handleClose();
      toastMessage("success", "Ticket Created");
    } else {
      toastMessage("error", "Something went wrong. Please try again later");
    }
  };

  const handleTicketCreation = () => {
    let obj = {
      title: values.title,
      type: ticketType,
    };
    createTicket(obj)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setSelected(data);
          let tempArr = [...list];
          tempArr.unshift(data);
          setList(tempArr);
          handleSendMessage(data?.id);
        } else {
          toastMessage("error", message);
          setSubmitting(false);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
        setSubmitting(false);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AddTicketVS,
    onSubmit: (value, action) => {
      setSubmitting(true);
      handleTicketCreation();
    },
  });

  const {
    setFieldValue,
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    resetForm,
    setSubmitting,
  } = formik;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader
        close={() => {
          resetForm();
          handleClose();
        }}
        isFirst={true}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-5 pb-4 pt-3"
        )}
      >
        <CustomInput
          label="Ticket Title"
          required
          placeholder="Enter main title"
          value={values.title}
          onChange={handleChange("title")}
          error={touched.title && errors.title ? errors.title : ""}
        />
        <div className={classNames("w-100")}>
          <CustomSelect
            placeholder="Select ticket type"
            label="Ticket Type"
            required
            options={TicketTypes}
            error={touched.type && errors.type ? errors.type : ""}
            onChangeHandle={(val) => {
              setTicketType(val?.value);
              setFieldValue("type", val?.label);
            }}
            value={values.type}
          />
        </div>
        <CustomTextArea
          placeholder="Type Message"
          label="Message"
          required
          value={values.messages}
          onChange={handleChange("messages")}
          error={touched.messages && errors.messages ? errors.messages : ""}
        />
        <div className={classNames("d-flex align-items-center w-100")}>
          <input
            type="file"
            id="file-modal"
            className={classNames("d-none")}
            multiple
            disabled={isSubmitting}
            onChange={(e: any) => {
              for (let k = 0; k < Array.from(e.target.files)?.length; k++) {
                if (checkFileIsDoc(e?.target?.files[k]?.type)) {
                  setTicketFiles(Array.from(e.target.files));
                } else {
                  toastMessage("error", "UnSupported file format");
                  setTicketFiles([]);
                  break;
                }
              }
            }}
          />
          <label
            htmlFor="file-modal"
            className={classNames(styles.attach, "gap-1")}
          >
            <AttachmentIcon className={classNames(styles.attachIcon)} />
            {ticketfiles?.length > 0
              ? ticketfiles?.length +
                ` file${
                  ticketfiles?.length > 1 || ticketfiles?.length == 0 ? "s" : ""
                } attached`
              : "Attach File"}
          </label>
          {ticketfiles?.length > 0 ? (
            <CrossIcon
              className={classNames("ms-2")}
              role="button"
              onClick={() => {
                setTicketFiles([]);
              }}
            />
          ) : null}
        </div>
        <CustomButton
          title="Submit"
          containerStyle={classNames(styles.btnContainer)}
          onClick={() => handleSubmit()}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </div>
    </Modal>
  );
}

export default AddTicketModal;
