import classNames from "classnames";
import React from "react";
import { useSelector } from "react-redux";
import styles from "../style.module.scss";

const AddedBy = ({ added_by, user_id }: any) => {
  const {
    login: {
      user: { id },
    },
  } = useSelector((state: any) => state.root);
  return (
    <>
      {added_by && added_by?.id !== id ? (
        <label className={classNames(styles.addedLabel)}>
          Added by {added_by?.full_name}
        </label>
      ) : user_id !== id && !added_by ? (
        <label className={classNames(styles.addedLabel)}>Added by Parent</label>
      ) : null}
    </>
  );
};

export default AddedBy;
