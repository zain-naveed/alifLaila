import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import ModalHeader from "shared/components/modalHeader";
import { classNames } from "shared/utils/helper";
import BookInfo from "./bookInfo";
import BookStatistics from "./bookStats";
import { tab, tabActiveEnum } from "./constant";
import styles from "./style.module.scss";

interface Props {
  open: boolean;
  handleClose: () => void;
  bookDetail: any;
}

function PublisherDetail({ open, handleClose, bookDetail }: Props) {
  const [activeTab, setActiveTab] = useState<string>(tab[0].item);

  const handleActiveTab = (activeItem: string) => {
    setActiveTab(activeItem);
  };
  useEffect(() => {
    let getElement = document.getElementById("modal-90w");
    getElement?.classList.remove("smallModal");
    getElement?.classList.add("mediumModal");

    return () => {
      getElement?.classList.remove("mediumModal");
    };
  });

  const OnClose = () => {
    setActiveTab(tab[0].item);
    handleClose();
  };

  return (
    <Modal
      show={open}
      onHide={OnClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={classNames(
        activeTab === tabActiveEnum.stat
          ? styles.dailogContent2
          : styles.dailogContent3
      )}
    >
      <Modal.Body>
        <ModalHeader
          heading="Book Details"
          close={OnClose}
          isFirst={true}
          headerStyle={styles.header}
        />
      </Modal.Body>
      <DetailTab
        activeTab={activeTab}
        handleActiveTab={handleActiveTab}
        tabArr={tab}
      />
      <div className={classNames(styles.tabContent)}>
        {tabActiveEnum.stat == activeTab ? (
          <BookStatistics bookDetail={bookDetail} />
        ) : tabActiveEnum.info == activeTab ? (
          <BookInfo bookDetail={bookDetail} />
        ) : null}
      </div>
    </Modal>
  );
}
interface DetailTabInterface {
  tabArr: Array<any>;
  activeTab: string;
  handleActiveTab: (val: string) => void;
}
const DetailTab = (props: DetailTabInterface) => {
  const { tabArr, activeTab, handleActiveTab } = props;
  return (
    <>
      <div className={classNames(styles.detailTabContainer)}>
        {tabArr.map(
          (
            tabItem: {
              item: string;
            },
            tabInx: number
          ) => {
            return (
              <div
                className={classNames(
                  styles.detailTabItem,
                  activeTab == tabItem.item ? styles.itemTabActive : ""
                )}
                key={`tab-item-${tabInx}`}
                role="button"
                onClick={() => handleActiveTab(tabItem.item)}
              >
                <span>{tabItem.item}</span>
              </div>
            );
          }
        )}
      </div>
    </>
  );
};

export default PublisherDetail;
