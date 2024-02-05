import classNames from "classnames";
import moment from "moment";
import { ticketCommentTypes, ticketTypes } from "shared/utils/enum";
import styles from "./style.module.scss";

interface Props {
  isMakred?: boolean;
  isActive?: boolean;
  item: any;
  onClick: () => void;
}

function TicketsCard({ isMakred, isActive, item, onClick }: Props) {
  return (
    <>
      <div
        className={classNames(
          styles.ticketsCard,
          isActive && styles.activeTicket
        )}
        onClick={onClick}
      >
        <div
          className={classNames(
            styles.statusContainer,
            !isMakred && styles.decline
          )}
        >
          <span>{isMakred ? "Close" : "Open"}</span>
        </div>
        <div
          className={classNames(
            styles.ticketsCardHeader,
            "d-flex flex-row justify-content-between align-items-center gap-2"
          )}
        >
          <span className={classNames(styles.ticketTitle)}>{item?.title}</span>
          <span className={classNames(styles.ticketDate)}>
            {moment(item?.created_at).format("DD-MM-YYYY")}
          </span>
        </div>

        <label className={classNames(styles.label1)}>
          {item?.type === ticketTypes.support ? "Support" : "MOU"}
        </label>

        <label className={classNames(styles.label2)}>
          {item?.last_comment?.type == ticketCommentTypes.text
            ? item?.last_comment?.comment
            : "File Attached"}
        </label>
      </div>
    </>
  );
}

export default TicketsCard;
