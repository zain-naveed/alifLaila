import { TickIcon } from "assets";
import classNames from "classnames";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomInput from "shared/components/common/customInput";
import CustomTextArea from "shared/components/common/customTextArea";
import BookAutoSuggestion from "shared/components/publisher/bookSuggestionInput";
import BookUpload from "shared/components/publisher/bookUpload";
import UploadCover from "shared/components/publisher/uploadCover";
import { getGenreList } from "shared/services/publisher/bookService";
import { isEnglishAlphabet } from "shared/utils/helper";
import { addBookForm1VS } from "shared/utils/validations";
import styles from "./style.module.scss";

interface Props {
  next: () => void;
  setForm1Detail: (val: any) => void;
  form1Detail: any;
}
interface InitialValues {
  bookName: string;
  bookDescription: string;
  uploadCover: string;
  uploadBook: string;
  genre: string;
}

function Form1({ next, setForm1Detail, form1Detail }: Props) {
  const inputRef = useRef<any>(null);
  const [suggest, setOpenSuggest] = useState<boolean>(false);
  const [fileCover, setFileCover] = useState<any>(
    form1Detail?.uploadCover ? form1Detail?.uploadCover : null
  );
  const [bookFiles, setBookFile] = useState<any>(null);
  const [selectSuggest, setSelectSuggest] = useState<any>(
    form1Detail?.genre ? form1Detail?.genre : []
  );
  const [genresList, setGenreList] = useState<any>([]);
  const initialValues: InitialValues = {
    bookDescription: form1Detail?.bookDescription
      ? form1Detail?.bookDescription
      : "",
    bookName: form1Detail?.bookName ? form1Detail?.bookName : "",
    uploadCover: form1Detail?.uploadCover ? form1Detail?.uploadCover : "",
    uploadBook: form1Detail?.uploadBook ? form1Detail?.uploadBook : "",
    genre: form1Detail?.genre ? form1Detail?.genre : "",
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addBookForm1VS,
    onSubmit: (value) => {
      let obj = {
        ...form1Detail,
        ...value,
      };
      setForm1Detail(obj);
      next();
    },
  });
  const { handleChange, handleSubmit, values, touched, errors, setFieldValue } =
    formik;

  const handleSelection = (item: any) => {
    let findSugg = selectSuggest.filter((ii: any) => ii.id === item.id);
    let cloneSuggestion = selectSuggest.filter((ii: any) => ii.id !== item.id);
    if (findSugg?.length > 0) {
      setSelectSuggest(cloneSuggestion);
      setFieldValue("genre", cloneSuggestion);
    } else {
      if (cloneSuggestion.length < 3) {
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
        setFieldValue("genre", cloneSuggestion);
      } else {
        cloneSuggestion.pop();
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
        setFieldValue("genre", cloneSuggestion);
      }
    }
  };
  useEffect(() => {
    genreList();
  }, []);

  const genreList = () => {
    getGenreList()
      .then(({ data: { data } }) => {
        setGenreList(data);
      })
      .catch((err) => {
        //for error handling
      });
  };

  const handleInput = (value: string) => {
    const text = value.replace(
      /[^a-zA-Z0-9!@#$%^&*()-_=+[\]{}|;:'",.<>/?`~\\ +$]/g,
      ""
    );
    if (text === "") {
      inputRef.current.value = "";
      setFieldValue("bookName", "");
      return;
    }
    inputRef.current.value = text;
    setFieldValue("bookName", text);
  };

  const handleKey = (e: any) => {
    if (e.key !== "Backspace") {
      if (!isEnglishAlphabet(e.currentTarget.value)) {
        inputRef.current.value = e.currentTarget.value;
        setFieldValue("bookName", e.currentTarget.value);
      }
    }
  };

  return (
    <>
      <CustomInput
        ref={inputRef}
        label="Book Name"
        placeholder="Enter book name"
        value={values.bookName}
        onChange={(e) => {
          handleInput(e.currentTarget.value);
        }}
        error={touched.bookName && errors.bookName ? errors.bookName : ""}
        required={true}
        onKeyDown={(e) => {
          handleKey(e);
        }}
        onPaste={(e) => {
          handleInput(e.currentTarget.value);
        }}
      />
      <CustomTextArea
        label="Book Description"
        placeholder="Describe something about book...."
        value={values.bookDescription}
        onChange={handleChange("bookDescription")}
        error={
          touched.bookDescription && errors.bookDescription
            ? errors.bookDescription
            : ""
        }
        required={true}
      />
      <UploadCover
        label="Upload Cover Photo"
        fileCover={fileCover}
        setFileCover={setFileCover}
        formikSetFieldValue={setFieldValue}
        required={true}
        error={
          touched.uploadCover && errors.uploadCover ? errors.uploadCover : ""
        }
        formikKey="uploadCover"
        shoudlCrop
      />
      <BookUpload
        label="Upload Book"
        bookId={Math.random()}
        bookFiles={bookFiles}
        value={values.uploadBook}
        setBookFile={setBookFile}
        formikSetFieldValue={setFieldValue}
        required={true}
        error={touched.uploadBook && errors.uploadBook ? errors.uploadBook : ""}
      />
      <BookAutoSuggestion
        setOpenSuggestion={setOpenSuggest}
        suggestions={suggest}
        badges={selectSuggest}
        formikSetFieldValue={setFieldValue}
        label={"Genre"}
        required={true}
        setBages={setSelectSuggest}
        error={touched.genre && errors.genre ? errors.genre : ""}
        RenderSuggestoin={() =>
          RenderSuggestion(handleSelection, genresList, selectSuggest)
        }
        placeholder="Select Genres"
      />
      <CustomButton
        title="Next"
        containerStyle={styles.customButton}
        onClick={() => {
          handleSubmit();
        }}
      />
    </>
  );
}
const RenderSuggestion = (
  handleSelection: any,
  list: Array<any>,
  selectSuggest: any[]
) => {
  return (
    <>
      {list.map((item, inx) => {
        return (
          <div
            className={classNames(
              "d-flex align-items-center py-3 px-3 gap-2",
              styles.optionContainer,
              inx === list?.length - 1 && styles.btmradius,
              inx === 0 && styles.topradius
            )}
            style={inx === list?.length - 1 ? { borderBottom: "0px" } : {}}
            key={inx}
            onClick={(e) => {
              e.stopPropagation();
              handleSelection(item);
            }}
          >
            <div
              className={classNames(
                styles.suggestionCheckBox,
                selectSuggest.filter((i) => i?.id === item?.id)?.length > 0 &&
                  styles.activeSuggestionCheckBox
              )}
            >
              <TickIcon />
            </div>
            <span
              role={"button"}
              className={classNames(styles.suggestionInput)}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </>
  );
};

export { RenderSuggestion };

export default Form1;
