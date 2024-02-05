import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ModalHeader from "shared/components/modalHeader";
import {
  resetPlanReducer,
  setShowPlanModal,
} from "shared/redux/reducers/planModalSlice";
import { roles } from "shared/utils/enum";
import ParentSelectPlan from "./parent";
import ReaderSelectPlan from "./reader";
import styles from "./style.module.scss";

interface Props {
  show: boolean;
}

function SelectPlanModal(props: Props) {
  const {
    login: { currentPlan },
    plan: { reachLimit },
  } = useSelector((state: any) => state.root);
  const { show } = props;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(resetPlanReducer());
    if (!currentPlan) {
      setTimeout(() => {
        dispatch(setShowPlanModal({ showModal: true, reachLimit: reachLimit }));
      }, 1800000);
    }
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      dialogClassName={styles.dailogContent}
      id="mediumOrderDetailModal"
      className="maxZindex"
    >
      <ModalHeader
        close={handleClose}
        isFirst={true}
        headerStyle={styles.header}
      />
      <Switcher handleClose={handleClose} />
    </Modal>
  );
}

const Switcher = ({ handleClose }: any) => {
  const {
    login: {
      user: { role },
    },
  } = useSelector((state: any) => state.root);

  switch (role) {
    case roles.parent:
      return <ParentSelectPlan handleClose={handleClose} />;
    case roles.reader:
      return <ReaderSelectPlan handleClose={handleClose} />;
    default:
      return <ReaderSelectPlan handleClose={handleClose} />;
  }
};

export default SelectPlanModal;
