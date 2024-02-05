import classNames from "classnames";
import { useEffect } from "react";
import styles from "./style.module.scss";
import { Spinner } from "react-bootstrap";
import NoContentCard from "shared/components/common/noContentCard";
import { useRouter } from "next/router";
import { kidPanelConstant } from "shared/routes/routeConstant";

interface OptionsDropDownProps {
  openSelection: boolean;
  setOpenSelection: (val: boolean) => void;
  options: any;
  loading: boolean;
}

const SearchDropDown = ({
  openSelection,
  setOpenSelection,
  options,
  loading,
}: Partial<OptionsDropDownProps>) => {
  const router = useRouter();
  function handleClick(e: any) {
    const elem: any = document.getElementById("searchDropDownContainer");
    if (elem) {
      if (!elem?.contains(e.target)) {
        setOpenSelection?.(false);
      }
    }
  }

  useEffect(() => {
    document.body.addEventListener(
      "click",
      (event: any) => {
        handleClick(event);
      },
      true
    );

    return () => {
      document.body.removeEventListener(
        "click",
        (event: any) => {
          handleClick(event);
        },
        true
      );
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      className={classNames(styles.optionsContainer)}
      id="searchDropDownContainer"
      style={openSelection ? { display: "flex" } : { display: "none" }}
    >
      {loading ? (
        <div
          className={classNames(
            "d-flex align-items-center justify-content-center py-3",
            styles.h100
          )}
        >
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {options?.map((item: any, inx: number) => {
            return (
              <div
                className={classNames(
                  "d-flex align-items-center gap-2 py-3 px-3",
                  styles.optionContainer,
                  inx === options?.length - 1 && styles.btmradius,
                  inx === 0 && styles.topradius
                )}
                style={
                  inx === options?.length - 1 ? { borderBottom: "0px" } : {}
                }
                key={inx}
                role="button"
                onClick={() => {
                  router.push(
                    kidPanelConstant.preview.path.replace(":id", item?.id)
                  );
                  setOpenSelection?.(false);
                }}
              >
                <label className={classNames(styles.labelStyle)} role="button">
                  {item?.title}
                </label>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SearchDropDown;
