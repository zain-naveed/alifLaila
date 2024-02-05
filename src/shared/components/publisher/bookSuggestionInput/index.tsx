import { ChevDownIcon, CloseIcon } from "assets";
import { useEffect } from "react";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
interface Props {
  RenderSuggestoin: any;
  setOpenSuggestion?: any;
  suggestions?: boolean;
  badges: Array<any>;
  setBages: any;
  error?: string;
  label?: string;
  required?: boolean;
  formikSetFieldValue?: any;
  formikFieldName?: string;
  customSuggestionContainer?: any;
  placeholder?: string;
}

function BookAutoSuggestion(props: Props) {
  const {
    RenderSuggestoin,
    setOpenSuggestion,
    suggestions,
    badges,
    setBages,
    label,
    required,
    error,
    formikSetFieldValue,
    formikFieldName,
    customSuggestionContainer,
    placeholder,
  } = props;
  function handleClick(e: any) {
    const elem = document.getElementById("wrappers");
    if (elem) {
      if (!elem?.contains(e.target)) {
        closeSuggestion();
      }
    }
  }
  useEffect(() => {
    return () => {
      document.body.removeEventListener(
        "click",
        (event) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event) => {
        handleClick(event);
      },
      true
    );
    // eslint-disable-next-lines
  }, []);
  const closeSuggestion = () => setOpenSuggestion(false);
  const handleRemove = (inx: number) => {
    let cloneBadge = [...badges];
    cloneBadge.splice(inx, 1);
    setBages(cloneBadge);
    if (formikSetFieldValue) {
      formikSetFieldValue(
        formikFieldName ? formikFieldName : "genre",
        cloneBadge
      );
    }
  };

  return (
    <>
      <div className="position-relative mb-3 w-100">
        <div className="d-flex flex-column">
          <label className={classNames(styles.inputLabel)}>
            {label} {!!required && <label className={styles.asterik}>*</label>}
          </label>
          <div
            className={classNames(styles.suggestionContainer)}
            id={"wrappers"}
            role="button"
            onClick={() => setOpenSuggestion(true)}
          >
            {badges?.length > 0 ? (
              <div className={classNames(styles.badgeMain)}>
                {badges?.map((badgeItem: any, bdgInx: number) => {
                  return (
                    <Badge
                      {...badgeItem}
                      handleRemove={() => {
                        handleRemove(bdgInx);
                      }}
                      key={bdgInx}
                    />
                  );
                })}
              </div>
            ) : placeholder ? (
              <label className={classNames(styles.placeholder)}>
                {placeholder}
              </label>
            ) : null}

            <div
              className="ms-auto pointer"
              onClick={() => setOpenSuggestion(true)}
              role={"button"}
            >
              <ChevDownIcon className={styles.image} />
            </div>
            {suggestions ? (
              <div
                className={classNames(
                  styles.suggestion,
                  customSuggestionContainer
                )}
              >
                <div className="list-group">
                  <RenderSuggestoin />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {!!error && <div className="error">{error}</div>}
      </div>
    </>
  );
}
interface BadgeProps {
  name: string;
  handleRemove: () => void;
}
const Badge = (props: BadgeProps) => {
  const { name, handleRemove } = props;
  return (
    <div
      className={classNames(styles.badgeContainer, "d-flex align-items-center")}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span className={classNames(styles.badgeText)}>{name}</span>
      <CloseIcon
        onClick={(e: any) => {
          e.stopPropagation();
          handleRemove();
        }}
      />
    </div>
  );
};

export default BookAutoSuggestion;
