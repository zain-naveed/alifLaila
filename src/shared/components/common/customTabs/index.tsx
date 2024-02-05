import classNames from "classnames";
import styles from "./style.module.scss";

interface TabProps {
  tabs: string[];
  activeTab: string;
  handleActiveTab: (val: string) => void;
  color?: string;
}

const CustomTab = ({
  tabs,
  activeTab,
  handleActiveTab,
  color,
}: Partial<TabProps>) => {
  return (
    <div
      className={classNames(
        "d-flex align-items-center justify-content-start justify-content-sm-start gap-5",
        styles.tabsContainer
      )}
      id="tabContainer"
    >
      {tabs?.map((tab, ind) => {
        return (
          <div
            className={classNames(styles.noPaddingContainer)}
            style={{ textAlign: "center" }}
            key={ind}
          >
            <label
              className={classNames(
                styles.tab,
                tab === activeTab ? styles.activeTab : styles.inActiveTab
              )}
              onClick={() => {
                handleActiveTab?.(tab);
              }}
              id={`${tab === activeTab ? "activeTab" : "inActiveTab"}`}
              style={color && tab === activeTab ? { color: color } : {}}
            >
              {tab}
              {tab === activeTab && (
                <div
                  className={classNames(styles.activeTabThumb)}
                  style={color ? { backgroundColor: color } : {}}
                />
              )}
            </label>
          </div>
        );
      })}
      <div className={classNames(styles.bottomBorder)} />
    </div>
  );
};

export default CustomTab;
