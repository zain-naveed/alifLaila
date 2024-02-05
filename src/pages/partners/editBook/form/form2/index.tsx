import classNames from "classnames";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import { toastMessage } from "shared/components/common/toast";
import BookAutoSuggestion from "shared/components/publisher/bookSuggestionInput";
import CustomRadio from "shared/components/publisher/customRadio";
import CustomSelect from "shared/components/publisher/customSelect";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import {
  getAgeRangeList,
  getLangList,
  getTagList,
  updateBook,
} from "shared/services/publisher/bookService";
import {
  bookAction,
  bookCopy,
  bookCopyEnums,
  bookType,
  bookTypeEnums,
} from "shared/utils/pageConstant/partner/form2Constant";
import { addBookForm2VS } from "shared/utils/validations";
import styles from "./style.module.scss";
import { RenderSuggestion } from "pages/partners/addBook/form/form1";
interface Props {
  form1Detail: any;
  previous: () => void;
  setForm1Detail: (val: any) => void;
  bookDetails: any;
  setLoading: (val: boolean) => void;
}
interface InitialValues {
  bookKeywords: "";
  ageRange: string;
  lang: string;
  bookType: string | number;
  authorName: string;
  bookBorrow: string;
  bookCoin: string;
  bookHardCopy: string | number;
  bookWeight: string;
  bookPrice: number;
  quiz: string;
}

function Form2({
  form1Detail,
  bookDetails,
  previous,
  setForm1Detail,
  setLoading,
}: Props) {
  const router = useRouter();

  const [selectSuggest, setSelectSuggest] = useState<any[]>(
    form1Detail?.bookKeywords ? form1Detail?.bookKeywords : bookDetails?.tags
  );
  const [langList, setLanglist] = useState<any>([]);
  const [ageRangeList, setAgeRangeList] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [suggest, setOpenSuggest] = useState<boolean>(false);
  const [promiseLoading, setPromiseLoading] = useState<boolean>(false);

  const initialValues: InitialValues = {
    bookKeywords: form1Detail?.bookKeywords
      ? form1Detail?.bookKeywords
      : bookDetails?.tags,
    ageRange: form1Detail?.ageRange
      ? form1Detail?.ageRange
      : bookDetails?.age_range?.text,
    lang: form1Detail?.lang ? form1Detail?.lang : bookDetails?.language?.name,
    bookType: form1Detail?.bookType ? form1Detail?.bookType : bookDetails?.type,
    authorName: form1Detail?.authorName
      ? form1Detail?.authorName
      : bookDetails?.book_author?.name,
    bookBorrow: form1Detail?.bookBorrow
      ? form1Detail?.bookBorrow
      : bookDetails?.borrow_coins
      ? bookDetails?.borrow_coins
      : "",
    bookCoin: form1Detail?.bookCoin
      ? form1Detail?.bookCoin
      : bookDetails?.buy_coins
      ? bookDetails?.buy_coins
      : "",
    bookHardCopy: form1Detail?.bookHardCopy
      ? form1Detail?.bookHardCopy
      : bookDetails?.is_hard_copy
      ? bookCopyEnums.hard
      : bookCopyEnums.soft,
    bookWeight: form1Detail?.bookWeight
      ? form1Detail?.bookWeight
      : bookDetails?.weight
      ? bookDetails?.weight
      : "",
    bookPrice: form1Detail?.bookPrice
      ? form1Detail?.bookPrice
      : bookDetails?.price
      ? bookDetails?.price
      : "",
    quiz: form1Detail?.quiz
      ? form1Detail?.quiz
      : bookDetails?.is_quiz
      ? "1"
      : "0",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addBookForm2VS,
    onSubmit: (value) => {
      let obj: any = { ...form1Detail, ...value };
      handleAddBook(obj);
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
      formBody.append("title", detail.bookName);
      formBody.append("description", detail.bookDescription);
      if (detail.uploadBook !== bookDetails?.cover_photo) {
        formBody.append("book_path", detail.uploadBook);
      } else if (detail.uploadCover !== bookDetails?.cover_photo) {
        formBody.append("cover_photo", detail.uploadCover);
      }

      detail?.genre?.map((ii: any) => {
        return formBody.append("genre[]", ii.id);
      });

      detail?.bookKeywords?.map((ii: any) => {
        return formBody.append("tags[]", ii?.id);
      });

      formBody.append(
        "age_range_id",
        ageRangeList.find((ii: any) => ii.text == detail.ageRange)?.id
      );
      formBody.append("author", detail.authorName);
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
      formBody.append(
        "language_id",
        langList.find((ii: any) => ii.label == detail.lang)?.id
      );
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
    Promise.all([getAgeRangeList(), getLangList(), getTagList()])
      .then((values) => {
        const [ageRange, language, tags] = values;
        const ageData = ageRange?.data?.data?.map((item: any) => {
          item["value"] = item.text;
          item["label"] = item.text;
          return item;
        });

        const tagsData = tags?.data?.data;
        const languageData = language?.data?.data?.map((item: any) => {
          item["value"] = item.name;
          item["label"] = item.name;
          return item;
        });

        setLanglist(languageData);
        setAgeRangeList(ageData);
        setTagList(tagsData);
      })
      .catch((err) => {})
      .finally(() => {
        setPromiseLoading(false);
      });
  };

  const handleSetPreviousSelections = () => {
    if (form1Detail?.bookKeywords) {
      setSelectSuggest(form1Detail?.bookKeywords);
    } else {
      let cloneArr = bookDetails?.tags?.map((i: any) => {
        return { id: i?.pivot?.tag_id, name: i?.name, item: i?.name };
      });
      setSelectSuggest(cloneArr);
      setFieldValue("bookKeywords", cloneArr);
    }
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
      <div className="row">
        <div className="col-6">
          <CustomSelect
            label="Age Range"
            placeholder="Select Age Range"
            required={true}
            options={ageRangeList}
            error={touched.ageRange && errors.ageRange ? errors.ageRange : ""}
            onChangeHandle={(val) => setFieldValue("ageRange", val.value)}
            value={values.ageRange}
          />
        </div>
        <div className="col-6">
          <CustomSelect
            label="Language"
            placeholder="Select Language"
            required={true}
            options={langList}
            error={touched.lang && errors.lang ? errors.lang : ""}
            onChangeHandle={(val) => setFieldValue("lang", val.value)}
            value={values.lang}
          />
        </div>
      </div>

      <div className="row">
        <CustomInput
          label="Author Name"
          placeholder="Enter author's name"
          required={true}
          value={values.authorName}
          error={
            touched.authorName && errors.authorName ? errors.authorName : ""
          }
          onChange={handleChange("authorName")}
        />
      </div>
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
              placeholder="0"
              required={true}
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
              placeholder="0"
              required={true}
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
          "d-flex align-items-center justify-content-between w-100"
        )}
      >
        <CustomButton
          title="Previous"
          containerStyle={styles.preVBtn}
          onClick={() => {
            let obj = {
              ...form1Detail,
              ...values,
            };

            setForm1Detail(obj);
            previous();
          }}
        />
        <CustomButton
          title="Next"
          containerStyle={styles.customButton}
          onClick={() => {
            handleSubmit();
          }}
        />
      </div>
    </>
  );
}

export default Form2;
