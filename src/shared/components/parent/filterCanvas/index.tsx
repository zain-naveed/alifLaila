import { ChevDownIcon, CrossIcon, TickIcon } from "assets";
import classNames from "classnames";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import {
  bookTypeFilters,
  quizFilters,
} from "shared/utils/pageConstant/kid/booksConstant";
import styles from "./style.module.scss";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  langList?: Array<any>;
  genreList?: Array<any>;
  ageRangeList?: Array<any>;
  handleApplyFilter: () => void;
  handleResetFilter: () => void;
  selectQuizSidebar: any;
  setSelectQuizSidebar: (val: any) => void;
  bookTypeSidebar: any;
  setBookTypeSidebar: (val: any) => void;
  selectAgeRangeSidebar: any;
  setSelectAgeRangeSidebar: (val: any) => void;
  selectGenreSidebar: any;
  setSelectGenreSidebar: (val: any) => void;
  selectLangSidebar: any;
  setSlectLangSidebar: (val: any) => void;
}

const FiltersCanvas = ({
  isOpen,
  setIsOpen,
  langList,
  genreList,
  ageRangeList,
  handleApplyFilter,
  bookTypeSidebar,
  selectQuizSidebar,
  selectAgeRangeSidebar,
  selectGenreSidebar,
  selectLangSidebar,
  setBookTypeSidebar,
  setSelectAgeRangeSidebar,
  setSelectGenreSidebar,
  setSelectQuizSidebar,
  setSlectLangSidebar,
  handleResetFilter,
}: SideCanvasProps) => {
  const [showGenre, setShowGenre] = useState<boolean>(true);
  const [showBookType, setShowBookType] = useState<boolean>(true);
  const [showQuiz, setShowQuiz] = useState<boolean>(true);
  const [showLangauge, setShowLanguage] = useState<boolean>(true);
  const [showAgeRange, setShowAgeRange] = useState<boolean>(true);

  function handleClick(e: any) {
    const elem: any = document.getElementById("parent-sideFilterCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem: any = document.getElementById("parent-filter-backDropContainer");
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

  return (
    <div
      className={classNames(styles.backDropContainer)}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="parent-filter-backDropContainer"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="parent-sideFilterCanvas"
      >
        <div className={classNames("position-relative", styles.h100)}>
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
              <CrossIcon className={classNames(styles.crossIcon)} />
            </div>
          </div>
          <div className={classNames(styles.contentContainer)}>
            <div
              className={classNames(
                "d-flex flex-column justify-content-between align-items-center px-4 w-100"
              )}
            >
              <Accordian
                active={showGenre}
                setActive={setShowGenre}
                title="Books Genre"
              >
                {genreList?.map((itm: any, inx: any) => {
                  return (
                    <SqaureRadio
                      key={inx}
                      value={itm?.name}
                      isActive={selectGenreSidebar.includes(itm?.id)}
                      onClick={() => {
                        selectGenreHandler(itm?.id);
                      }}
                    />
                  );
                })}
              </Accordian>
              <Accordian active={showQuiz} setActive={setShowQuiz} title="Quiz">
                {quizFilters?.map((itm: any, inx: any) => {
                  return (
                    <RoundRadio
                      key={inx}
                      value={itm?.name}
                      isActive={selectQuizSidebar == itm?.id}
                      onClick={() => setSelectQuizSidebar(itm?.id)}
                    />
                  );
                })}
              </Accordian>
              <Accordian
                active={showBookType}
                setActive={setShowBookType}
                title="Book Type"
              >
                {bookTypeFilters?.map((itm: any, inx: any) => {
                  return (
                    <RoundRadio
                      key={inx}
                      value={itm?.name}
                      isActive={bookTypeSidebar == itm?.id}
                      onClick={() => setBookTypeSidebar(itm?.id)}
                    />
                  );
                })}
              </Accordian>
              <Accordian
                active={showLangauge}
                setActive={setShowLanguage}
                title="Language"
              >
                {langList?.map((itm: any, inx: any) => {
                  return (
                    <RoundRadio
                      key={inx}
                      value={itm?.name}
                      isActive={selectLangSidebar.includes(itm?.id)}
                      onClick={() => langHandler(itm?.id)}
                    />
                  );
                })}
              </Accordian>
              <Accordian
                active={showAgeRange}
                setActive={setShowAgeRange}
                title="Age Group"
              >
                {ageRangeList?.map((itm: any, inx: any) => {
                  return (
                    <RoundRadio
                      key={inx}
                      value={itm?.text}
                      isActive={selectAgeRangeSidebar == itm?.id}
                      onClick={() => setSelectAgeRangeSidebar(itm?.id)}
                    />
                  );
                })}
              </Accordian>
            </div>
            <div className={classNames(styles.extra)} />
          </div>

          <div className={classNames("px-4 gap-2", styles.btnContainer)}>
            <CustomButton
              onClick={handleResetFilter}
              title="RESET FILTERS"
              containerStyle={styles.resetfilterButton}
              iconStyle={styles.iconStyle}
            />
            <CustomButton title="APPLY FILTERS" onClick={handleApplyFilter} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SqaureRadio = ({ isActive, value, onClick }: any) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start gap-2"
      )}
      role="button"
      onClick={onClick}
    >
      <div
        className={classNames(
          styles.sqaureRadio,
          isActive && styles.activeSqaure
        )}
      >
        <TickIcon />
      </div>
      <label
        className={classNames(
          styles.radioLabel,
          isActive && styles.activeLabel
        )}
      >
        {value}
      </label>
    </div>
  );
};

const RoundRadio = ({ isActive, value, onClick }: any) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start gap-2"
      )}
      role="button"
      onClick={onClick}
    >
      <div
        className={classNames(
          styles.roundRadio,
          isActive && styles.activeRound
        )}
      >
        {isActive ? <div className={classNames(styles.round)} /> : null}
      </div>
      <label
        className={classNames(
          styles.radioLabel,
          isActive && styles.activeLabel
        )}
      >
        {value}
      </label>
    </div>
  );
};

interface AccordianProps {
  active: boolean;
  setActive: (val: boolean) => void;
  title: string;
  children: any;
}

const Accordian = ({ active, setActive, title, children }: AccordianProps) => {
  return (
    <>
      <div
        className={classNames(
          "d-flex align-items-center justify-content-between w-100",
          active ? "mb-0" : "mb-4",
          styles.accordianContainer
        )}
        onClick={() => {
          setActive(!active);
        }}
      >
        <label className={classNames(styles.accordianTitle)}>{title}</label>
        <ChevDownIcon className={classNames(styles.chevIcon)} />
      </div>
      {active ? (
        <div
          className={classNames(
            "d-flex flex-column align-items-start justify-content-between gap-2 w-100 py-3"
          )}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export default FiltersCanvas;
