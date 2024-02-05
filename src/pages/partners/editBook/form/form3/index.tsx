import classNames from "classnames";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { RenderSuggestion } from "pages/partners/addBook/form/form1";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import BookAutoSuggestion from "shared/components/publisher/bookSuggestionInput";
import CustomRadio from "shared/components/publisher/customRadio";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import { getTagList, updateBook } from "shared/services/publisher/bookService";
import {
  bookAction,
  bookCopy,
  bookCopyEnums,
  bookType,
  bookTypeEnums,
} from "shared/utils/pageConstant/partner/form2Constant";
import { editBookForm3VS } from "shared/utils/validations";
import styles from "./style.module.scss";
interface Props {
  bookDetails: any;
}
interface InitialValues {
  bookKeywords: "";
  bookType: string | number;
  bookBorrow: string;
  bookCoin: string;
  bookHardCopy: string | number;
  bookWeight: string;
  bookPrice: number;
  quiz: string;
}

function Form3({ bookDetails }: Props) {
  const router = useRouter();

  const [selectSuggest, setSelectSuggest] = useState<any[]>(bookDetails?.tags);
  const [tagList, setTagList] = useState<any>([]);
  const [suggest, setOpenSuggest] = useState<boolean>(false);
  const [promiseLoading, setPromiseLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues: InitialValues = {
    bookKeywords: bookDetails?.tags,
    bookType: bookDetails?.type,
    bookBorrow: bookDetails?.borrow_coins ? bookDetails?.borrow_coins : "",
    bookCoin: bookDetails?.buy_coins ? bookDetails?.buy_coins : "",
    bookHardCopy: bookDetails?.is_hard_copy
      ? bookCopyEnums.hard
      : bookCopyEnums.soft,
    bookWeight: bookDetails?.weight ? bookDetails?.weight : "",
    bookPrice: bookDetails?.price ? bookDetails?.price : "",
    quiz: bookDetails?.is_quiz ? "1" : "0",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: editBookForm3VS,
    onSubmit: (value) => {
      handleAddBook(value);
    },
  });

  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  const handleSelection = (item: any) => {
    let findSugg = selectSuggest.filter((ii: any) => ii.id === item.id);
    let cloneSuggestion = selectSuggest.filter((ii: any) => ii.id !== item.id);
    if (findSugg?.length > 0) {
      setSelectSuggest(cloneSuggestion);
      setFieldValue("bookKeywords", cloneSuggestion);
    } else {
      if (cloneSuggestion.length < 3) {
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
        setFieldValue("bookKeywords", cloneSuggestion);
      } else {
        cloneSuggestion.pop();
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
        setFieldValue("bookKeywords", cloneSuggestion);
      }
    }
  };

  const handleAddBook = (detail: any) => {
    if (!promiseLoading) {
      let formBody = new FormData();
      formBody.append("book_id", bookDetails?.id);
      detail?.bookKeywords?.map((ii: any) => {
        return formBody.append("tags[]", ii?.id);
      });
      formBody.append("type", detail.bookType);
      if (detail.bookType == bookTypeEnums.Premium) {
        formBody.append("borrow_coins", detail.bookBorrow);
        formBody.append("buy_coins", detail.bookCoin);
      }
      let bookHardCopyBoolean: any = Number(detail.bookHardCopy);
      formBody.append("is_hard_copy", bookHardCopyBoolean);

      if (bookAction.yes == bookHardCopyBoolean) {
        formBody.append("weight", detail.bookWeight);
        formBody.append("price", detail.bookPrice);
      }
      let parseQuiz: any = Number(detail.quiz);
      formBody.append("is_quiz", parseQuiz);
      setLoading(true);
      updateBook(formBody)
        .then(({ data: { status, message, data } }) => {
          if (status) {
            toastMessage("success", message);
            // move to quiz if quiz is true
            if (parseQuiz == true && !bookDetails?.quiz) {
              router.push(
                partnersPanelConstant.quiz.create.path.replace(
                  ":id",
                  bookDetails?.id
                )
              );
            } else if (parseQuiz == true && bookDetails?.quiz) {
              // update quiz if quiz is true and quiz already exist
              router.push(
                partnersPanelConstant.quiz.list.path.replace(
                  ":id",
                  bookDetails?.quiz?.id
                )
              );
            } else {
              router.push(partnersPanelConstant.book.path);
            }
          } else {
            toastMessage("error", message);
          }
        })
        .catch((err) => {
          toastMessage("error", err?.response?.data?.message);
        })
        .finally(() => setLoading(false));
    }
  };

  const getAllList = () => {
    setPromiseLoading(true);
    getTagList()
      .then(({ data: { data, status } }) => {
        if (status) {
          setTagList(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setPromiseLoading(false);
      });
  };

  const handleSetPreviousSelections = () => {
    let cloneArr = bookDetails?.tags?.map((i: any) => {
      return { id: i?.pivot?.tag_id, name: i?.name, item: i?.name };
    });
    setSelectSuggest(cloneArr);
    setFieldValue("bookKeywords", cloneArr);
  };

  useEffect(() => {
    getAllList();
    handleSetPreviousSelections();
  }, []);

  return (
    <>
      <BookAutoSuggestion
        setOpenSuggestion={setOpenSuggest}
        suggestions={suggest}
        badges={selectSuggest}
        formikSetFieldValue={setFieldValue}
        formikFieldName="bookKeywords"
        label={"Keywords"}
        required={true}
        setBages={setSelectSuggest}
        error={
          touched.bookKeywords && errors.bookKeywords ? errors.bookKeywords : ""
        }
        RenderSuggestoin={() =>
          RenderSuggestion(handleSelection, tagList, selectSuggest)
        }
        customSuggestionContainer={classNames(styles.sugestionContainer)}
        placeholder="Select keywords"
      />
      <CustomRadio
        label="Book Type"
        arr={bookType}
        name="bookType"
        required={true}
        active={values.bookType}
        handleCheck={(val) => {
          setFieldValue("bookType", val.value);
        }}
      />
      {values.bookType === bookTypeEnums.Premium ? (
        <div className="row">
          <div className="col-6">
            <CustomInput
              label="Book Borrow (add coins)"
              placeholder="0"
              required={true}
              value={values.bookBorrow}
              error={
                touched.bookBorrow && errors.bookBorrow ? errors.bookBorrow : ""
              }
              formikKey="bookBorrow"
              setFieldValue={setFieldValue}
              isNumber
            />
          </div>
          <div className="col-6">
            <CustomInput
              label="Book Buy (add coins)"
              required={true}
              placeholder="0"
              value={values.bookCoin}
              error={touched.bookCoin && errors.bookCoin ? errors.bookCoin : ""}
              formikKey="bookCoin"
              setFieldValue={setFieldValue}
              isNumber
            />
          </div>
        </div>
      ) : null}
      <CustomRadio
        label="Printed Book"
        arr={bookCopy}
        required={true}
        name="hardCopy"
        active={values.bookHardCopy}
        handleCheck={(val) => {
          setFieldValue("bookHardCopy", val.value);
        }}
      />
      {values.bookHardCopy === bookTypeEnums.Free ? (
        <div className="row">
          <div className="col-6">
            <CustomInput
              label="Book Weight (kgs)"
              required={true}
              placeholder="0"
              value={values.bookWeight}
              error={
                touched.bookWeight && errors.bookWeight ? errors.bookWeight : ""
              }
              formikKey="bookWeight"
              setFieldValue={setFieldValue}
              isNumber
            />
          </div>
          <div className="col-6">
            <CustomInput
              label="Price (PKR)"
              required={true}
              placeholder="0"
              value={values.bookPrice}
              error={
                touched.bookPrice && errors.bookPrice ? errors.bookPrice : ""
              }
              formikKey="bookPrice"
              setFieldValue={setFieldValue}
              isNumber
            />
          </div>
        </div>
      ) : null}

      <CustomRadio
        label="Quiz"
        arr={bookCopy}
        name="bookQuiz"
        required={true}
        active={values.quiz}
        handleCheck={(val) => {
          setFieldValue("quiz", val.value);
        }}
      />

      <div
        className={classNames(
          "d-flex align-items-center justify-content-end w-100"
        )}
      >
        <CustomButton
          title="Save"
          containerStyle={styles.customButton}
          onClick={() => {
            handleSubmit();
          }}
          loading={loading}
          disabled={loading}
        />
      </div>
    </>
  );
}

export default Form3;
