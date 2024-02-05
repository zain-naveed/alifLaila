import { CrossIcon, NextIcon } from "assets";
import { useEffect, useState } from "react";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import { toastMessage } from "shared/components/common/toast";
import BookAutoSuggestion from "shared/components/publisher/bookSuggestionInput";
import CustomSelect from "shared/components/publisher/customSelect";
import { classNames } from "shared/utils/helper";
import { bookStatusArr } from "./constant";
import styles from "./style.module.scss";
import { RenderSuggestion } from "pages/partners/addBook/form/form1";

interface SideCanvasProps {
  setIsOpen: (val: boolean) => void;
  isOpen: boolean;
  ageRangeList?: Array<any>;
  tagList: Array<any>;
  applyFilter: any;
  applyResetFilter: any;
}
const BookFilterSidebar = ({
  isOpen,
  setIsOpen,
  tagList,
  ageRangeList,
  applyFilter,
  applyResetFilter,
}: SideCanvasProps) => {
  const [suggest, setOpenSuggest] = useState<boolean>(false);
  const [selectSuggest, setSelectSuggest] = useState<any>([]);
  const [ageRange, setAgeRange] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  function handleClick(e: any) {
    const elem: any = document.getElementById("filterSideCanvas");
    if (!elem.contains(e.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    let elem = document.getElementById("backDropFilterContainer");
    elem?.addEventListener("click", handleClick);
    return () => {
      elem?.removeEventListener("click", handleClick);
    };
  }, []);

  const handleSelection = (item: any) => {
    let findSugg = selectSuggest.filter((ii: any) => ii.id === item.id);
    let cloneSuggestion = selectSuggest.filter((ii: any) => ii.id !== item.id);
    if (findSugg?.length > 0) {
      setSelectSuggest(cloneSuggestion);
    } else {
      if (cloneSuggestion.length < 3) {
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
      } else {
        cloneSuggestion.pop();
        item["item"] = item.name;
        cloneSuggestion.push(item);
        setSelectSuggest(cloneSuggestion);
      }
    }
  };
  const allReset = () => {
    setSelectSuggest([]);
    setAgeRange("");
    setStatus("");
    applyResetFilter();
  };

  return (
    <div
      className={classNames(styles.backDropContainer)}
      style={isOpen ? { visibility: "visible" } : { visibility: "hidden" }}
      id="backDropFilterContainer"
    >
      <div
        className={classNames(
          styles.mainContainer,
          isOpen ? styles.shown : styles.hidden
        )}
        id="filterSideCanvas"
      >
        <div
          className={classNames(
            "d-flex justify-content-between align-items-center px-4 py-4"
          )}
        >
          <Heading heading="Filters" />
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
        <div className={classNames(styles.scrollContainer, "px-4")}>
          <BookAutoSuggestion
            setOpenSuggestion={setOpenSuggest}
            placeholder="Select Genre"
            suggestions={suggest}
            badges={selectSuggest}
            label={"Genre"}
            setBages={setSelectSuggest}
            RenderSuggestoin={() =>
              RenderSuggestion(handleSelection, tagList, selectSuggest)
            }
            customSuggestionContainer={classNames(styles.sugestionContainer)}
          />
          <CustomSelect
            label="Age Range"
            placeholder="Select Age Range"
            options={ageRangeList}
            onChangeHandle={(val) => setAgeRange(val?.value)}
            value={ageRange}
          />

          <CustomSelect
            label="Status"
            placeholder="Select Status"
            options={bookStatusArr}
            onChangeHandle={(val) => setStatus(val?.value)}
            value={status}
          />
          <div style={{ height: "400px", width: "100%" }} />
        </div>

        <div className={classNames(styles.filterButtonContainer, "w-100")}>
          <CustomButton
            onClick={allReset}
            title="Reset Filters"
            containerStyle={styles.resetfilterButton}
            iconStyle={styles.iconStyle}
          />
          <CustomButton
            onClick={() => applyFilter(selectSuggest, ageRange, status)}
            title="Apply Filters"
            containerStyle={styles.filterButton}
            iconStyle={styles.iconStyle}
            IconDirction="right"
            Icon={NextIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default BookFilterSidebar;
