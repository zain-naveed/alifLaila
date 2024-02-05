import { Modal } from "react-bootstrap";
import styles from "./style.module.scss";
import classNames from "classnames";
import CustomButton from "shared/components/common/customButton";
import ModalHeader from "shared/components/modalHeader";
import Image from "next/image";
import { TickIcon, defaultAvatar } from "assets";
import { assignBook, assigneeList } from "shared/services/parent/kidService";
import { toastMessage } from "shared/components/common/toast";
import { useFormik } from "formik";
import { AssignBookVS } from "shared/utils/validations";
import CustomInput from "shared/components/common/customInput";
import { Fragment, useEffect, useRef, useState } from "react";
import BoxLoader from "shared/loader/box";
import NoContentCard from "shared/components/common/noContentCard";

interface Props {
  show: boolean;
  handleClose: () => void;
  book_id: any;
}
interface InitialValues {
  due: string;
}

const initialValues: InitialValues = {
  due: "",
};

function SelectKids({ show, handleClose, book_id }: Props) {
  const selectedRef = useRef<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [kids, setKids] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [selected, setSelected] = useState<any[]>([]);

  const handleGetKids = () => {
    setLoading(true);
    assigneeList(book_id)
      .then(({ data: { data, message, status } }) => {
        if (status) {
          setKids(data);
        } else {
          setMessage(message);
        }
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnSubmit = () => {
    if (selected?.length > 0) {
      let assinees = [];
      for (let x = 0; x < selected?.length; x++) {
        let tempObj = {
          kid_id: selected[x],
        };
        assinees.push(tempObj);
      }
      let obj = {
        assign: assinees,
        book_id: book_id,
        due_at: values.due,
      };
      assignBook(obj)
        .then(({ data: { data, message, status } }) => {
          if (status) {
            toastMessage("success", message);
            resetForm();
            handleClose();
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("error", err?.response?.data?.message);
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      toastMessage("error", "Please select a kid");
      setSubmitting(false);
    }
  };

  const handleOnClick = (id: any) => {
    let exist = selectedRef?.current?.filter((i, inx) => i === id);
    if (exist?.length === 0) {
      let filterArr = [...selectedRef.current];
      filterArr.push(id);
      selectedRef.current = filterArr;
    } else {
      let filterArr: any = selectedRef?.current?.filter((i, inx) => i !== id);
      selectedRef.current = filterArr;
    }
    setSelected(selectedRef.current);
  };

  const handleSelectAll = () => {
    let exist = selectedRef?.current?.filter((i, inx) => i === kids[0]?.id);
    if (exist?.length > 0) {
      selectedRef.current = [];
      setSelected([]);
    } else {
      let ids = kids?.map((i: any, inx: any) => {
        return i.id;
      });
      selectedRef.current = ids;
      setSelected(ids);
    }
  };

  const {
    handleChange,
    handleSubmit,
    values,
    touched,
    errors,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: AssignBookVS,
    onSubmit: () => {
      handleOnSubmit();
    },
  });

  const close = () => {
    resetForm();
    setMessage("");
    setKids([]);
    handleClose();
  };

  useEffect(() => {
    if (show) {
      handleGetKids();
    }
  }, [book_id, show]);

  return (
    <Modal
      show={show}
      onHide={close}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={classNames(styles.dailogContent)}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader
        close={() => {
          close();
        }}
        isFirst={true}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "d-flex flex-column w-100 align-items-center px-4 pb-4 pt-3"
        )}
      >
        <label className={classNames(styles.title, "mb-4")}>Select Kids</label>
        <div
          className={classNames(
            "d-flex align-items-center justify-content-between w-100"
          )}
        >
          {loading ? (
            <>
              <BoxLoader iconStyle={classNames(styles.kidsCountLoader)} />
              <BoxLoader iconStyle={classNames(styles.selectAllLoader)} />
            </>
          ) : kids?.length > 0 ? (
            <>
              <label className={classNames(styles.kidsCount)}>
                {selected?.length} / {kids?.length} Kids Selected
              </label>
              <label
                className={classNames(styles.selectAll)}
                onClick={() => {
                  if (kids?.length > 0) {
                    handleSelectAll();
                  }
                }}
              >
                Select All
              </label>
            </>
          ) : null}
        </div>
        {kids?.length > 0 || loading ? (
          <div className={classNames(styles.seperator, "my-3")} />
        ) : null}

        {loading ? (
          <>
            {Array.from(Array(4).keys()).map((itm, inx) => {
              return (
                <Fragment key={inx}>
                  <div
                    className={classNames(
                      "d-flex align-items-center justify-content-between w-100"
                    )}
                  >
                    <div
                      className={classNames("d-flex align-items-center gap-2")}
                    >
                      <BoxLoader iconStyle={classNames(styles.kidAvt)} />
                      <BoxLoader iconStyle={classNames(styles.kidNameLoader)} />
                    </div>
                    <BoxLoader
                      iconStyle={classNames(styles.checkContainerLoader)}
                    />
                  </div>
                  <div className={classNames(styles.seperator, "my-3")} />
                </Fragment>
              );
            })}
          </>
        ) : (
          <>
            {kids?.length ? (
              <>
                {kids?.map((itm, inx) => {
                  return (
                    <Fragment key={inx}>
                      <div
                        className={classNames(
                          "d-flex align-items-center justify-content-between w-100"
                        )}
                      >
                        <div
                          className={classNames(
                            "d-flex align-items-center gap-2"
                          )}
                        >
                          <img
                            src={
                              itm?.reader?.profile_picture
                                ? itm?.reader?.profile_picture
                                : defaultAvatar.src
                            }
                            alt=""
                            className={classNames(styles.kidAvt)}
                            height={60}
                            width={60}
                          />
                          <label className={classNames(styles.kidName)}>
                            {itm?.reader?.full_name}
                          </label>
                        </div>
                        <div
                          className={classNames(
                            styles.checkContainer,
                            selected?.includes(itm?.id) && styles.active
                          )}
                          onClick={() => {
                            handleOnClick(itm?.id);
                          }}
                        >
                          <TickIcon />
                        </div>
                      </div>
                      <div className={classNames(styles.seperator, "my-3")} />
                    </Fragment>
                  );
                })}
              </>
            ) : (
              <>
                <NoContentCard
                  customIconContianer={classNames(styles.noFounIconContianer)}
                  label2={
                    message
                      ? message
                      : "This book is already assigned to all kids"
                  }
                />
              </>
            )}
          </>
        )}
        {kids?.length > 0 ? (
          <>
            <CustomInput
              label="Add Due Date"
              placeholder="Select Date"
              type="date"
              customLabelStyle={classNames(styles.inputLabel)}
              customInputStyle={classNames(styles.inputStyle)}
              customInputContainer={classNames(styles.inputContainer)}
              isDate
              min={new Date().toISOString().split("T")[0]}
              value={values.due}
              onChange={handleChange("due")}
              error={touched.due && errors.due ? errors.due : ""}
              readOnly={loading || isSubmitting || kids?.length === 0}
            />
            <CustomButton
              title="Assign"
              containerStyle={classNames(styles.nextBtn, "mt-3")}
              onClick={() => {
                handleSubmit();
              }}
              disabled={loading || isSubmitting || kids?.length === 0}
              loading={isSubmitting}
            />
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default SelectKids;
