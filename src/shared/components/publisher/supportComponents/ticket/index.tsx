import {
  AttachmentIcon,
  CheckCircleIcon,
  CrossIcon,
  DocIcon,
  PNGIcon,
  SendIcon,
} from "assets";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import { toastMessage } from "shared/components/common/toast";
import BoxLoader from "shared/loader/box";
import {
  ticketCommentTypes,
  ticketStatus,
  ticketTypes,
} from "shared/utils/enum";
import { checkFileIsDoc, formatBytes } from "shared/utils/helper";
import MessageList from "../message";
import styles from "./style.module.scss";

interface TicketProps {
  files: any[];
  selected: any;
  loading: boolean;
  completeLoading: boolean;
  handleCompleteTicket: () => void;
  messageList: any[];
  handleRemoveFile: (val: number) => void;
  senderLoading: boolean;
  comment: string;
  setComment: (val: string) => void;
  handleSendMessage: () => void;
  setFiles: (val: any[]) => void;
  containerClass: string;
}

const Ticket = ({
  files,
  selected,
  loading,
  completeLoading,
  messageList,
  senderLoading,
  comment,
  handleCompleteTicket,
  handleRemoveFile,
  setComment,
  handleSendMessage,
  setFiles,
  containerClass,
}: TicketProps) => {
  return (
    <div
      className={classNames(
        styles.ticketBody,
        containerClass && containerClass,
        "flex-column gap-3 "
      )}
    >
      <div
        className={classNames(styles.ticketBodyContent, " d-flex flex-column")}
      >
        <div
          className={classNames(
            styles.ticketBodyContentHeader,
            "d-flex justify-content-between align-items-center"
          )}
        >
          <div
            className={classNames(
              styles.leftHeaderContent,
              "d-flex flex-row align-items-center"
            )}
          >
            <div className={classNames("d-flex align-items-center gap-2")}>
              {loading ? (
                <div
                  className={classNames(
                    "d-flex flex-column justify-content-center gap-2"
                  )}
                >
                  <BoxLoader iconStyle={classNames(styles.ticketTitleLoader)} />
                  <BoxLoader iconStyle={classNames(styles.label1Loader)} />
                </div>
              ) : (
                <div
                  className={classNames(
                    "d-flex flex-column justify-content-center"
                  )}
                >
                  <label className={classNames(styles.ticketTitle)}>
                    {selected?.title}
                  </label>
                  <label className={classNames(styles.label1)}>
                    {selected?.type === ticketTypes.support ? "Support" : "MOU"}
                  </label>
                </div>
              )}
            </div>
          </div>
          {!loading && selected?.status !== ticketStatus.closed && selected?.type === ticketTypes.support  ? (
            <CustomButton
              title="Mark Complete"
              IconDirction="left"
              Icon={CheckCircleIcon}
              iconStyle={classNames(styles.iconStyle)}
              containerStyle={classNames(styles.MarkComplete)}
              onClick={handleCompleteTicket}
              disabled={completeLoading}
              loading={completeLoading}
            />
          ) : null}
        </div>
        <div className={classNames(styles.ticketContentBody, "gap-3 my-3")}>
          {loading ? (
            <>
              <BoxLoader
                iconStyle={classNames(styles.messageLoader, styles.receiver)}
              />
              <BoxLoader
                iconStyle={classNames(styles.messageLoader, styles.sender)}
              />
              <BoxLoader iconStyle={classNames(styles.messageLoader)} />

              <BoxLoader
                iconStyle={classNames(styles.messageLoader, styles.sender)}
              />
            </>
          ) : (
            messageList?.map((message, index) => (
              <MessageList
                {...message}
                msg={message}
                isleft={message?.admin ? true : false}
                key={index}
              />
            ))
          )}
        </div>
        {selected?.status !== ticketStatus.closed ? (
          <div
            className={classNames(
              styles.ticketContentFooter,
              "position-relative"
            )}
          >
            {files.length > 0 ? (
              <div className={classNames(styles.filesContainer, "gap-3")}>
                {files?.map((itm: any, inx: number) => {
                  return (
                    <div
                      className={classNames(styles.attachmentContainer, "px-3")}
                      key={inx}
                    >
                      <div
                        className={classNames(
                          "d-flex align-items-center gap-3"
                        )}
                      >
                        {ticketCommentTypes.pdf === itm?.type ? (
                          <DocIcon className={classNames(styles.icon)} />
                        ) : (
                          <PNGIcon className={classNames(styles.icon)} />
                        )}

                        <div
                          className={classNames(
                            "d-flex flex-column align-items-start"
                          )}
                        >
                          <label className={classNames(styles.fileName)}>
                            {itm?.name}
                          </label>
                        </div>
                      </div>

                      <CrossIcon
                        className={classNames(styles.downloadIcon)}
                        onClick={() => {
                          handleRemoveFile(inx);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className={classNames(styles.editorContainder)}>
              <textarea
                placeholder="write here..."
                className={classNames(styles.inputEditor)}
                disabled={loading || senderLoading}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div
              className={classNames(
                styles.controlsContainer,
                "d-flex flex-row justify-content-between align-items-center"
              )}
            >
              <input
                type="file"
                id="file"
                multiple
                className={classNames(styles.inputFile)}
                disabled={loading || senderLoading}
                onChange={(e: any) => {
                  for (let k = 0; k < Array.from(e.target.files)?.length; k++) {
                    if (checkFileIsDoc(e?.target?.files[k]?.type)) {
                      setFiles(Array.from(e.target.files));
                    } else {
                      toastMessage("error", "UnSupported file format");
                      setFiles([]);
                      break;
                    }
                  }
                }}
              />
              <label
                htmlFor="file"
                className={classNames(styles.AttachmentLabel)}
              >
                <AttachmentIcon />
              </label>
              <button
                className={classNames(styles.sendButton)}
                disabled={loading}
                onClick={() => {
                  handleSendMessage();
                }}
              >
                {senderLoading ? (
                  <Spinner
                    animation="border"
                    size="sm"
                    style={{ color: "white" }}
                  />
                ) : (
                  <SendIcon />
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Ticket;
