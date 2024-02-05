import React from "react";
import styles from "./style.module.scss";
import classNames from "classnames";
import {
  AssignBookWhitekIcon,
  BorrowBookWhiteIcon,
  BuyBookWhiteIcon,
  LockIcon,
} from "assets";
import CustomButton from "shared/components/common/customButton";
import { kidAccountRole } from "shared/utils/enum";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "shared/modal/auth/constants";
import { useDispatch, useSelector } from "react-redux";

interface NoAccessPageProps {
  bookDetail: any;
  handleShowConfirmationModal: (val: any) => void;
  kid_role: any;
  handleShowAssignModal: () => void;
  showAssign?: boolean;
  isPublic?: boolean;
}

const NoAccessPage = ({
  bookDetail,
  handleShowConfirmationModal,
  kid_role,
  handleShowAssignModal,
  showAssign,
  isPublic,
}: NoAccessPageProps) => {
  const dispatch = useDispatch();

  const navigateHandler = () => {
    dispatch(setAuthReducer({ showModal: true, activeModal: forms.welcome }));
  };

  return (
    <div className={classNames(styles.accessContainer, "gap-3")}>
      <LockIcon className={classNames(styles.lockIcon)} />
      <label className={classNames(styles.cotinueReadingStyle)}>
        {!isPublic ? "Continue Reading" : "Login to continue reading"}
      </label>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-center gap-2 w-100",
          styles.btnGrupContainer
        )}
      >
        {!isPublic && kid_role !== kidAccountRole.family ? (
          <CustomButton
            title={`Buy For ${
              bookDetail?.buy_coins ? bookDetail?.buy_coins : 0
            } Coins`}
            Icon={BuyBookWhiteIcon}
            iconStyle={classNames(styles.btnIcon)}
            IconDirction="left"
            containerStyle={classNames(styles.btnContainer)}
            onClick={() => {
              handleShowConfirmationModal(2);
            }}
          />
        ) : null}

        {!isPublic ? (
          <CustomButton
            title={`Borrow For ${
              bookDetail?.borrow_coins ? bookDetail?.borrow_coins : 0
            } Coins`}
            Icon={BorrowBookWhiteIcon}
            IconDirction="left"
            iconStyle={classNames(styles.btnIcon)}
            containerStyle={classNames(styles.btnContainer, styles.greenBtn)}
            onClick={() => {
              handleShowConfirmationModal(1);
            }}
          />
        ) : (
          <CustomButton
            title={`Login`}
            containerStyle={classNames(styles.btnContainer1)}
            onClick={() => {
              navigateHandler();
            }}
          />
        )}
      </div>
      {!isPublic && showAssign && (
        <CustomButton
          title={`Assign Book`}
          Icon={AssignBookWhitekIcon}
          iconStyle={classNames(styles.btnIcon)}
          IconDirction="left"
          containerStyle={classNames(styles.assignBtnContainer)}
          onClick={handleShowAssignModal}
        />
      )}

    </div>
  );
};

export default NoAccessPage;
