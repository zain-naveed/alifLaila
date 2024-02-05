import { closeImg, defaultAvatar } from "assets";
import classNames from "classnames";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import CustomButton from "shared/components/common/customButton";
import { isNumberCheck } from "shared/utils/helper";
import styles from "./style.module.scss";
import { toastMessage } from "shared/components/common/toast";
import { assignCoins } from "shared/services/parent/dashboardService";

interface Props {
  show: boolean;
  handleClose: () => void;
  kids: any[];
  kid?: any;
  setKid?: (val: any) => void;
}

function AssignCoinsModal({ show, handleClose, kids, kid, setKid }: Props) {
  const [values, setValues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleAssignCoin = () => {
    let filterArr = values.filter((i, inx) => i.coins === "");
    if (filterArr?.length > 0 || values?.length === 0) {
      toastMessage("error", "Please don't leave any field empty");
    } else {
      setLoading(true);
      let obj = {
        assign: values,
      };
      assignCoins(obj)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            if (kid) {
              let tempObj = { ...kid };
              let filterArr = values.filter(
                (i: any, inx: number) => i.kid_id === kid?.id
              );
              tempObj["coins_limit"] = filterArr[0]?.coins;
              setKid?.(tempObj);
            }

            toastMessage("success", message);
            handleClose();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("error", err?.response?.data?.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
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
      contentClassName={classNames(styles.content)}
    >
      <div className={classNames(" py-4")}>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between px-3"
          )}
        >
          <div />
          <label className={classNames(styles.heading)}>
            Assign Coins On Daily Basis
          </label>
          <div
            onClick={handleClose}
            role={"button"}
            className={classNames(styles.closeImageContainer)}
          >
            <Image src={closeImg} alt="close" />
          </div>
        </div>
        <div
          className={classNames(
            "d-flex flex-column align-items-center justify-content-between gap-3 w-100 px-3 pt-4",
            kids?.length > 1 ? "pb-5" : "pb-0"
          )}
        >
          {kids?.map((itm, inx) => {
            return (
              <Fragment key={inx}>
                <KidCard item={itm} setValues={setValues} values={values} />
                {inx !== kids?.length - 1 ? (
                  <div className={classNames(styles.seperator)} />
                ) : null}
              </Fragment>
            );
          })}
        </div>
        <div className={classNames(styles.seperator, "mt-2")} />
        <div className={classNames("px-3 pt-4")}>
          <CustomButton
            title="Assign"
            containerStyle={classNames(styles.btn)}
            onClick={handleAssignCoin}
            loading={loading}
            disabled={loading}
          />
        </div>
      </div>
    </Modal>
  );
}

const KidCard = ({ item, setValues, values }: any) => {
  const [value, setValue] = useState<string>(
    item?.coins_limit ? item?.coins_limit : ""
  );
  const handleKeyPress = (e: any) => {
    if (e.code !== "Backspace") {
      if (!isNumberCheck(e)) {
        e.preventDefault();
        return;
      }
    }
  };

  const handleOnChange = (value: string) => {
    const text = value.replace(/[^\d\S]/g, "");
    if (text === "") {
      setValue("");
    }
    setValue(value);
    let filterArr = values.filter(
      (i: any, inx: number) => i.kid_id !== item?.id
    );
    let obj = {
      kid_id: item?.id,
      coins: value,
    };
    filterArr.push(obj);
    setValues(filterArr);
  };

  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-between w-100"
      )}
    >
      <div
        className={classNames(
          "d-flex align-items-center justify-content-start gap-2"
        )}
      >
        <img
          src={
            item?.reader?.profile_picture
              ? item?.reader?.profile_picture
              : defaultAvatar.src
          }
          alt="kid-user-pic"
          height={60}
          width={60}
          className={classNames(styles.avtStyle)}
        />
        <label className={classNames(styles.kidName)}>
          {item?.reader?.full_name}
        </label>
      </div>
      <input
        className={classNames(styles.inputContainer)}
        value={value}
        type="text"
        onKeyDown={handleKeyPress}
        onChange={(e) => handleOnChange(e.currentTarget.value)}
        placeholder="0"
      />
    </div>
  );
};

export default AssignCoinsModal;
