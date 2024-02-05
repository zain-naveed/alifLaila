import { CrossIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import CustomRadioButton from "shared/components/common/customRadioButton";
import CheckBoxLoader from "shared/loader/pageLoader/kid/checkBoxLoader";
import CustomRadioLoader from "shared/loader/pageLoader/kid/customRadioLoader";
import {
  bookTypeFilters,
  quizFilters,
} from "shared/utils/pageConstant/kid/booksConstant";
import CheckBox from "../checkBox";
import FilterCollapse from "../filterCollapseable";
import styles from "./style.module.scss";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  setShowSideFilters: (val: boolean) => void;
  langList?: Array<any>;
  genreList?: Array<any>;
  ageRangeList?: Array<any>;
  selectLang?: Array<any>;
  selectGenre?: Array<any>;
  selectAgeRange?: number;
  listLoading?: boolean;
  setBookType?: any;
  bookType?: any;
  selectQuiz?: any;
  setSelectQuiz?: any;
  setSelectAgeRange?: any;
  setSelectGenre?: any;
  setSlectLang?: any;
}

const SideFiltersCanvas = (props: SideCanvasProps) => {
  const {
    isOpen,
    setIsOpen,
    setShowSideFilters,
    langList,
    genreList,
    ageRangeList,
    selectLang,
    listLoading,
    selectGenre,
    selectAgeRange,
    setBookType,
    bookType,
    selectQuiz,
    setSelectQuiz,
    setSelectGenre,
    setSelectAgeRange,
    setSlectLang,
  } = props;
  const [selectQuizSidebar, setSelectQuizSidebar] =
    useState<number>(selectQuiz);
  const [bookTypeSidebar, setBookTypeSidebar] = useState<number>(bookType);
  const [selectAgeRangeSidebar, setSelectAgeRangeSidebar] = useState<number>(
    selectAgeRange ? selectAgeRange : 0
  );
  const [selectGenreSidebar, setSelectGenreSidebar]: any = useState(
    selectGenre || []
  );
  const [selectLangSidebar, setSlectLangSidebar]: any = useState(
    selectLang || []
  );
  function handleClick(e: any) {
    const elem: any = document.getElementById("sideFilterCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem: any = document.getElementById("backDropContainer2");
    elem.addEventListener("click", (event: any) => {
      handleClick(event);
    });
    return () => {
      elem?.removeEventListener("click", (event: any) => {
        handleClick(event);
      });
    };
    // eslint-disable-next-line
  }, []);
  const selectGenreHandler = (id: string | number) => {
    let cloneGenre: any = [...selectGenreSidebar];
    if (!cloneGenre.includes(id)) {
      cloneGenre.push(id);
      setSelectGenreSidebar(cloneGenre);
    } else {
      let index = cloneGenre.indexOf(id);
      cloneGenre.splice(index, 1);
      setSelectGenreSidebar(cloneGenre);
    }
  };
  const langHandler = (id: string | number) => {
    let cloneLang: any = [...selectLangSidebar];
    if (!cloneLang.includes(id)) {
      cloneLang.push(id);
      setSlectLangSidebar(cloneLang);
    } else {
      let index = cloneLang.indexOf(id);
      cloneLang.splice(index, 1);
      setSlectLangSidebar(cloneLang);
    }
  };
  const applyFilter = () => {
    setBookType(bookTypeSidebar);
    setSelectQuiz(selectQuizSidebar);
    setSelectAgeRange(selectAgeRangeSidebar);
    setSelectGenre(selectGenreSidebar);
    setSlectLang(selectLangSidebar);
    setShowSideFilters(true);
    setIsOpen(false);
  };
  useEffect(() => {
    setBookTypeSidebar(bookType);
    setSelectQuizSidebar(selectQuiz);
    setSelectAgeRangeSidebar?.(selectAgeRange ? selectAgeRange : 0);
    setSelectGenreSidebar(selectGenre);
    setSlectLangSidebar(selectLang);
  }, [
    selectGenre?.length,
    selectLang?.length,
    selectAgeRange,
    selectQuiz,
    bookType,
  ]);

  return (
    <div
      className={classNames(styles.backDropContainer, "d-md-none")}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropContainer2"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="sideFilterCanvas"
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center px-4 py-4"
          )}
        >
          <label className={classNames(styles.title)}>Filters</label>
          <div
            className={classNames(styles.crossIconContainer)}
            onClick={() => {
              setIsOpen(false);
            }}
            role="button"
          >
            <CrossIcon />
          </div>
        </div>

        <div className={classNames("d-flex flex-column px-4 gap-3")}>
          <FilterCollapse
            title="Book Type"
            id="filter-books-screen-0"
            noBottomSeperator
          >
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              {bookTypeFilters.map((itm, inx) => {
                return (
                  <CustomRadioButton
                    isActive={bookTypeSidebar == itm?.id}
                    label={itm?.name}
                    onClick={() => setBookTypeSidebar(itm?.id)}
                    key={inx}
                  />
                );
              })}
            </div>
          </FilterCollapse>
          <FilterCollapse title="Language" id="side-filter-books-screen-1">
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              {listLoading ? (
                <CheckBoxLoader iteration={2} />
              ) : (
                langList?.map((itm: any, inx) => {
                  return (
                    <CheckBox
                      isActive={selectLangSidebar.includes(itm?.id)}
                      label={itm?.name}
                      key={inx}
                      onClick={() => langHandler(itm?.id)}
                    />
                  );
                })
              )}
            </div>
          </FilterCollapse>
          <FilterCollapse title="GENRE" id="filter-books-screen-2">
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              {listLoading ? (
                <CheckBoxLoader iteration={7} />
              ) : (
                genreList?.map((itm: any, inx) => {
                  return (
                    <CheckBox
                      isActive={selectGenreSidebar.includes(itm?.id)}
                      onClick={() => selectGenreHandler(itm?.id)}
                      label={itm?.name}
                      key={inx}
                    />
                  );
                })
              )}
            </div>
          </FilterCollapse>
          <FilterCollapse title="AGE GROUP" id="filter-books-screen-3">
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              {listLoading ? (
                <CustomRadioLoader iteration={4} />
              ) : (
                <>
                  <CustomRadioButton
                    isActive={selectAgeRangeSidebar === 0}
                    onClick={() => setSelectAgeRangeSidebar(0)}
                    label={"All"}
                  />
                  {ageRangeList?.map((itm: any, inx) => {
                    return (
                      <CustomRadioButton
                        isActive={selectAgeRangeSidebar == itm?.id}
                        onClick={() => setSelectAgeRangeSidebar(itm?.id)}
                        label={itm?.text}
                        key={inx}
                      />
                    );
                  })}
                </>
              )}
            </div>
          </FilterCollapse>
          <FilterCollapse title="Quiz" id="side-filter-books-screen-4">
            <div
              className={classNames(
                "d-flex flex-column align-items-start justify-content-between gap-2"
              )}
            >
              {quizFilters.map((itm, inx: number) => {
                return (
                  <CustomRadioButton
                    isActive={selectQuizSidebar == itm?.id}
                    label={itm?.name}
                    onClick={() => setSelectQuizSidebar(itm?.id)}
                    key={inx}
                  />
                );
              })}
            </div>
          </FilterCollapse>
        </div>
        <div className={classNames("px-4 mt-5 mb-4")}>
          <CustomButton title="APPLY FILTERS" onClick={applyFilter} />
        </div>
      </div>
    </div>
  );
};

export default SideFiltersCanvas;
