import {
  BookRemoveIcon,
  BookViewIcon,
  DeleteIcon,
  EyeIcon,
  PencilIcon,
  RedoIcon,
  RemoveConfirmationIcon,
} from "assets";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import CustomTable from "shared/components/common/customTable";
import CustomToolTip from "shared/components/common/customToolTip";
import Status from "shared/components/common/status";
import { toastMessage } from "shared/components/common/toast";
import BookRowLoader from "shared/loader/pageLoader/publisher/book";
import ConfirmationModal from "shared/modal/confimation";
import PublisherDetail from "shared/modal/publisherDetail";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { deleteBook } from "shared/services/publisher/bookService";
import { bookStatusEnum } from "shared/utils/enum";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import RejectionReasonModal from "shared/modal/rejectionReason";

interface Props {
  list: Array<any>;
  loading?: boolean;
  setBookList: any;
  isPartnerAuthor?: boolean;
}
function BookTable({ list, loading, setBookList, isPartnerAuthor }: Props) {
  return (
    <>
      <CustomTable
        title="My Books"
        heads={[
          "Book Name",
          "Author Name",
          "Genre",
          "Age Range",
          "Status",
          "Action",
        ]}
        isEmpty={list ? list?.length === 0 && !loading : true}
        loading={loading ? loading : false}
      >
        {loading ? (
          <BookRowLoader />
        ) : list?.length ? (
          list?.map((item) => {
            return (
              <RowItem
                item={item}
                key={item?.id}
                list={list}
                setBookList={setBookList}
                isPartnerAuthor={isPartnerAuthor}
              />
            );
          })
        ) : null}
      </CustomTable>
    </>
  );
}

const RowItem = ({ item, list, setBookList, isPartnerAuthor }: any) => {
  const router = useRouter();
  const book = item;
  const [openPublisherDetail, setOpenPublisherDetail] =
    useState<boolean>(false);
  const [delLoading, setDelLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [showRejectionModal, setShowRejectionModal] = useState<boolean>(false);

  const handleShowRejectionModal = () => {
    setShowRejectionModal(true);
  };

  const handleCloseRejectionModal = () => {
    setShowRejectionModal(false);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleTogglePublisher = () => {
    setOpenPublisherDetail(!openPublisherDetail);
  };

  const handleDelete = () => {
    setDelLoading(true);
    let formBody = new FormData();
    formBody.append("id", book?.id);
    deleteBook(formBody)
      .then(({ data: { status, message } }) => {
        if (status) {
          let cloneList = [...list];
          let findIndx = cloneList.findIndex((i) => i.id == book?.id);
          if (findIndx > -1) {
            cloneList.splice(findIndx, 1);
            setBookList(cloneList);
          }
          toastMessage("success", "Book deleted successfully");
          handleClose();
        } else {
          toastMessage("error", message);
          handleClose();
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => {
        setDelLoading(false);
      });
  };
  return (
    <>
      <tr>
        <td
          className={classNames(styles.tableContentLabel, "ps-4 pe-2 py-3")}
          style={{ verticalAlign: "middle", width: "20%" }}
        >
          <div className={styles.bookNameItem}>
            <img src={book?.cover_photo} alt="book" width={37} height={40} />
            <span>{book?.title}</span>
          </div>
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "12%" }}
        >
          {book?.book_author?.name}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "20%" }}
        >
          {book?.genres?.map((item: any) => item.name).join(", ")}
        </td>
        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "9%" }}
        >
          {book?.age_range?.text?.replace("Age ", "")}
        </td>

        <td
          className={classNames(styles.tableContentLabel, "px-2 py-3")}
          style={{ width: "15%", verticalAlign: "middle" }}
        >
          <Status status={book?.status} type="book" />
        </td>
        <td
          className={classNames(styles.tableContentLabel, "ps-2 pe-4 py-3")}
          style={{ verticalAlign: "middle", width: "22%" }}
        >
          <div className={classNames("d-flex gap-2")}>
            <CustomToolTip label="See Details">
              <div
                className={classNames(styles.IconSyle)}
                role="button"
                onClick={handleTogglePublisher}
              >
                <EyeIcon />
              </div>
            </CustomToolTip>
            <CustomToolTip label="View Book">
              <div
                className={classNames(styles.IconSyle)}
                onClick={() => {
                  router.push(
                    partnersPanelConstant.bookPreview.path.replace(
                      ":id",
                      book?.id
                    )
                  );
                }}
                role="button"
              >
                <BookViewIcon />
              </div>
            </CustomToolTip>

            {!isPartnerAuthor ? (
              <>
                <CustomToolTip label="Revision">
                  <div
                    className={classNames(styles.IconSyle)}
                    onClick={() => {
                      router.push(
                        partnersPanelConstant.revisions.path.replace(
                          ":id",
                          book?.id
                        )
                      );
                    }}
                    role="button"
                  >
                    <RedoIcon />
                  </div>
                </CustomToolTip>

                {book?.status === bookStatusEnum.pending ||
                book?.status === bookStatusEnum.revision_requested ||
                book?.status === bookStatusEnum.published ||
                book?.status === bookStatusEnum.approved ? (
                  <CustomToolTip label="Edit">
                    <div
                      className={classNames(styles.IconSyle)}
                      role="button"
                      onClick={() => {
                        router.push(
                          partnersPanelConstant.editBook.path.replace(
                            ":id",
                            book?.id
                          )
                        );
                      }}
                    >
                      <PencilIcon />
                    </div>
                  </CustomToolTip>
                ) : null}
                {book?.status === bookStatusEnum.pending ||
                book?.status === bookStatusEnum.published ||
                book?.status === bookStatusEnum.rejected ? (
                  <CustomToolTip label="Remove">
                    <div
                      className={classNames(styles.IconSyle)}
                      onClick={() => {
                        setOpen(!open);
                      }}
                      role="button"
                    >
                      <DeleteIcon />
                    </div>
                  </CustomToolTip>
                ) : null}
                {book?.status === bookStatusEnum.rejected ? (
                  <CustomToolTip label="Rejection Reason">
                    <div
                      className={classNames(styles.IconSyle)}
                      role="button"
                      onClick={handleShowRejectionModal}
                    >
                      <BookRemoveIcon />
                    </div>
                  </CustomToolTip>
                ) : null}
              </>
            ) : null}
          </div>
        </td>
      </tr>
      <PublisherDetail
        open={openPublisherDetail}
        handleClose={handleTogglePublisher}
        bookDetail={book}
      />
      {open ? (
        <ConfirmationModal
          ImageSrc={RemoveConfirmationIcon}
          heading="Are you sure you want to delete?"
          open={open}
          handleClose={handleClose}
          handleSubmit={handleDelete}
          loading={delLoading}
        />
      ) : null}
      {showRejectionModal ? (
        <RejectionReasonModal
          reason={item?.comment}
          showModal={showRejectionModal}
          handleClose={handleCloseRejectionModal}
        />
      ) : null}
    </>
  );
};

export default BookTable;
