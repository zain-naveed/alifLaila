import classNames from "classnames";
import React, { useState } from "react";
import styles from "./style.module.scss";
import Image from "next/image";
import { RemoveConfirmationIcon, TrashIcon } from "assets";
import ConfirmationModal from "shared/modal/confimation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const AddedBy = dynamic(() => import("./addedBy"), { ssr: false });

const CartBookCard = ({
  item,
  handleRemoveFromCart,
  added_by,
  user_id,
  isParentKid,
}: any) => {
  const {
    login: {
      user: { id },
    },
  } = useSelector((state: any) => state.root);
  const [open, setOpen] = useState(false);
  const handleShowConfirmation = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-3"
        )}
      >
        <div className={classNames(styles.imageContainer)}>
          <img
            src={item?.cover_photo}
            alt="Image not Found"
            height={82}
            width={65}
            className={classNames(styles.image)}
          />
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-between gap-1"
          )}
        >
          <label className={classNames(styles.bookHeading)}>
            {item?.title}
          </label>
          <AddedBy added_by={added_by} user_id={user_id} />
          {!isParentKid || (isParentKid && added_by?.id === id) ? (
            <div
              className={classNames("d-flex align-items-center gap-1")}
              role="button"
              onClick={() => {
                handleShowConfirmation();
              }}
            >
              <TrashIcon className={classNames(styles.bookRemoveIcon)} />
              <label className={classNames(styles.bookRemove)} role="button">
                Remove
              </label>
            </div>
          ) : null}
        </div>
      </div>
      <ConfirmationModal
        ImageSrc={RemoveConfirmationIcon}
        heading="Are you sure you want to Remove?"
        open={open}
        handleClose={handleClose}
        handleSubmit={() => {
          handleRemoveFromCart(item?.id);
          handleClose();
        }}
        actionButtonText="Yes, Remove"
      />
    </>
  );
};

export default CartBookCard;
