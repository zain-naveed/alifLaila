import { DocIcon, DownloadIcon, PNGIcon } from "assets";
import moment from "moment";
import { Fragment, useEffect, useState } from "react";
import { ticketCommentTypes } from "shared/utils/enum";
import { classNames, downloadLink } from "shared/utils/helper";
import styles from "./style.module.scss";
import { ProxyURL } from "shared/utils/endpoints";
interface Props {
  msg: any;
  isleft?: boolean;
}

function MessageList({ msg, isleft }: Props) {
  const date = moment(msg?.created_at).format("DD MMM, YYYY h:mm a");

  return (
    <>
      {msg?.comment ? (
        <div
          className={classNames(
            isleft ? styles.sender : styles.receiver,
            styles.messageContainer,
            "d-flex flex-column justify-content-between"
          )}
        >
          <label className={classNames(styles.message)}>
            {msg?.comment?.split(/\r\n|\r|\n/).map((item: any, index: any) => (
              <Fragment key={index}>
                {item}
                <br />
              </Fragment>
            ))}
          </label>

          <div
            className={classNames(
              styles.msgDetails,
              "d-flex flex-row justify-content-end"
            )}
          >
            <label className={classNames(styles.messageTime)}>{date}</label>
          </div>
        </div>
      ) : null}
      {msg?.attachment ? (
        <FileAttachment msg={msg} date={date} isLeft={isleft} />
      ) : null}
    </>
  );
}

const FileAttachment = ({ msg, date, isLeft }: any) => {
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFetch = async () => {
    if (msg?.attachment) {
      let blob = await fetch(ProxyURL + msg?.attachment)
        .then((r) => r.blob())
        .finally(() => {
          setLoading(false);
        });
      const tempfile = new File([blob], "attachment", { type: blob?.type });
      setFile(tempfile);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [msg?.attachment]);

  return (
    <div
      className={classNames(
        styles.attachmentContainer,
        "px-3",
        !isLeft && styles.receiver
      )}
    >
      <div className={classNames("d-flex align-items-center gap-3")}>
        {ticketCommentTypes.pdf === msg?.type ? (
          <DocIcon className={classNames(styles.icon)} />
        ) : (
          <PNGIcon className={classNames(styles.icon)} />
        )}

        <div className={classNames("d-flex flex-column align-items-start")}>
          <label className={classNames(styles.fileName)}>Attachment</label>
        </div>
      </div>

      <DownloadIcon
        className={classNames(styles.downloadIcon)}
        onClick={() => {
          if (!loading) {
            downloadLink(msg?.attachment, "attachment");
          }
        }}
      />
    </div>
  );
};

export default MessageList;
