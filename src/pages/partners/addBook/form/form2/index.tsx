import { ChevDownIcon, TickIcon } from "assets";
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
import CustomUserDropDown from "shared/dropDowns/customUserDropdown";
import { partnersPanelConstant } from "shared/routes/routeConstant";
import {
  addBook,
  getAgeRangeList,
  getLangList,
  getTagList,
} from "shared/services/publisher/bookService";
import { roles } from "shared/utils/enum";
import {
  bookAction,
  bookCopy,
  bookType,
  bookTypeEnums,
} from "shared/utils/pageConstant/partner/form2Constant";
import { addBookForm2VS } from "shared/utils/validations";
import { RenderSuggestion } from "../form1";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
interface Props {
  form1Detail: any;
  previous: () => void;
  setForm1Detail: (val: any) => void;
  setLoading: (val: boolean) => void;
  account_role: number;
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
  linkAuthor: string | number;
  author: any;
}

function Form2({
  form1Detail,
  previous,
  setForm1Detail,
  setLoading,
  account_role,
}: Props) {
  const router = useRouter();
  const {
    login: { user },
  } = useSelector((state: any) => state.root);

  const [selectSuggest, setSelectSuggest] = useState<any>(
    form1Detail?.bookKeywords ? form1Detail?.bookKeywords : []
  );
  const [langList, setLanglist] = useState<any>([]);
  const [ageRangeList, setAgeRangeList] = useState<any>([]);
  const [tagList, setTagList] = useState<any>([]);
  const [suggest, setOpenSuggest] = useState<boolean>(false);

  const [checked, setChecked] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);

  const initialValues: InitialValues = {
    bookKeywords: form1Detail?.bookKeywords ? form1Detail?.bookKeywords : "",
    ageRange: form1Detail?.ageRange ? form1Detail?.ageRange : "",
    lang: form1Detail?.lang ? form1Detail?.lang : "",
    bookType: form1Detail?.bookType ? form1Detail?.bookType : "1",
    authorName: form1Detail?.authorName ? form1Detail?.authorName : "",
    bookBorrow: form1Detail?.bookBorrow ? form1Detail?.bookBorrow : "",
    bookCoin: form1Detail?.bookCoin ? form1Detail?.bookCoin : "",
    bookHardCopy: form1Detail?.bookHardCopy ? form1Detail?.bookHardCopy : "0",
    bookWeight: form1Detail?.bookWeight ? form1Detail?.bookWeight : "",
    bookPrice: form1Detail?.bookPrice ? form1Detail?.bookPrice : "",
    quiz: form1Detail?.quiz ? form1Detail?.quiz : "0",
    linkAuthor: form1Detail?.linkAuthor ? form1Detail?.linkAuthor : "0",
    author: form1Detail?.author ? form1Detail?.author : "",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addBookForm2VS,
    onSubmit: (value) => {
      let obj: any = { ...form1Detail, ...value };
      if (checked) {
        handleAddBook(obj);
      } else {
        toastMessage("error", "Please accept the terms");
      }
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

  const handleAddBook = (bookDetail: any) => {
    let formBody = new FormData();
    formBody.append("title", bookDetail.bookName);
    formBody.append("description", bookDetail.bookDescription);
    formBody.append("book_path", bookDetail.uploadBook);
    formBody.append("cover_photo", bookDetail.uploadCover);

    bookDetail.genre.map((ii: any) => {
      return formBody.append("genre[]", ii.id);
    });

    bookDetail.bookKeywords.map((ii: any) => {
      return formBody.append("tags[]", ii.id);
    });
    formBody.append(
      "age_range_id",
      ageRangeList.find((ii: any) => ii.text == bookDetail.ageRange)?.id
    );
    formBody.append("author", bookDetail.authorName);
    formBody.append("type", bookDetail.bookType);
    if (bookDetail.bookType == bookTypeEnums.Premium) {
      formBody.append("borrow_coins", bookDetail.bookBorrow);
      formBody.append("buy_coins", bookDetail.bookCoin);
    }
    let bookHardCopyBoolean: any = Number(bookDetail.bookHardCopy);
    formBody.append("is_hard_copy", bookHardCopyBoolean);

    if (bookAction.yes == bookHardCopyBoolean) {
      formBody.append("weight", bookDetail.bookWeight);
      formBody.append("price", bookDetail.bookPrice);
    }
    formBody.append(
      "language_id",
      langList.find((ii: any) => ii.label == bookDetail.lang)?.id
    );
    let parseQuiz: any = Number(bookDetail.quiz);
    formBody.append("is_quiz", parseQuiz);

    if (bookAction.yes === Number(bookDetail?.linkAuthor)) {
      formBody.append("partner_id", bookDetail?.author?.id);
    }

    setLoading(true);
    addBook(formBody)
      .then(({ data: { status, message, data } }) => {
        if (status) {
          toastMessage("success", message);

          // move to quiz if quiz is true
          if (parseQuiz == true) {
            router.push(
              partnersPanelConstant.quiz.create.path.replace(":id", data.id)
            );
          }

          // move to book listing route
          router.push(partnersPanelConstant.book.path);
        } else {
          toastMessage("error", message);
        }
      })
      .catch((err) => {
        toastMessage("error", err?.response?.data?.message);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getAllList();
  }, []);
  const getAllList = () => {
    Promise.all([getAgeRangeList(), getLangList(), getTagList()])
      .then((values) => {
        const [ageRange, language, tags] = values;
        const ageData = ageRange?.data?.data.map((item: any) => {
          item["value"] = item.text;
          item["label"] = item.text;
          return item;
        });

        const tagsData = tags?.data?.data;
        const languageData = language?.data?.data.map((item: any) => {
          item["value"] = item.name;
          item["label"] = item.name;
          return item;
        });

        setLanglist(languageData);
        setAgeRangeList(ageData);
        setTagList(tagsData);
      })
      .catch((err) => {});
  };

  return (
    <>
      <BookAutoSuggestion
        setOpenSuggestion={setOpenSuggest}
        suggestions={suggest}
        badges={selectSuggest}
        formikSetFieldValue={setFieldValue}
        formikFieldName="bookKeywords"
        placeholder="Select Keywords"
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
      {account_role === roles.publisher ? (
        <>
          {user?.is_partner_enabled ? (
            <CustomRadio
              label="Link Author"
              arr={bookCopy}
              name="linkAuthor"
              required={true}
              active={values.linkAuthor}
              handleCheck={(val) => {
                setFieldValue("linkAuthor", val.value);
              }}
            />
          ) : null}
          {values.linkAuthor === bookAction.yes ? (
            <CustomUserDropDown
              required
              placeholder="Select Author"
              value={values.author}
              onChangeHandle={(val) => setFieldValue("author", val)}
              error={touched.author && errors.author ? errors.author : ""}
              handleReset={() => {
                setFieldValue("author", "");
              }}
            />
          ) : null}
        </>
      ) : null}

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
              required={true}
              placeholder="0"
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
          "d-flex align-items-start justify-content-between w-100 row m-0 p-0 mb-4"
        )}
        role="button"
        onClick={() => {
          setShowTerms(!showTerms);
        }}
      >
        <div
          className={classNames("col-11 p-0 d-flex align-items-start gap-2")}
        >
          <div
            className={classNames(
              styles.checkBoxContainer,
              checked && styles.activeCheckBox
            )}
            onClick={(e) => {
              e.stopPropagation();
              setChecked(!checked);
            }}
          >
            <TickIcon />
          </div>
          <div className={classNames("d-flex flex-column")}>
            <label className={classNames(styles.termTitle, "mb-3")}>
              By submitting this book, I acknowledge and agree that:
            </label>
            {showTerms ? (
              <>
                <label className={classNames(styles.termsLabel)}>
                  <span /> I hold the necessary copyrights or have obtained
                  permission for copyrighted material included in the book.
                </label>
                <label className={classNames(styles.termsLabel)}>
                  <span />
                  The book's content contains no material promoting hate speech,
                  discrimination, or disrespect toward any
                  religion/sect/culture.
                </label>
                <label className={classNames(styles.termsLabel)}>
                  <span />
                  The content of this book adheres to appropriate guidelines for
                  children. It does not contain adult-oriented material,
                  violence, or any content that may be considered harmful or
                  unsuitable for young readers.
                </label>
                <label className={classNames(styles.termsLabel)}>
                  <span />
                  Any violation of the terms and conditions of the platform may
                  result in the rejection of my book submission or the removal
                  of the book from the website.
                </label>
              </>
            ) : null}
          </div>
        </div>
        <div
          className={classNames(
            "col-1 d-flex algin-items-center justify-content-end p-0"
          )}
        >
          <ChevDownIcon className={classNames(styles.chevIcon)} />
        </div>
      </div>

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
