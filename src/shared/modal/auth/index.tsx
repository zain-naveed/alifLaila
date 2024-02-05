import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "./constants";
import SwitchForm from "./switchForm";
import styles from "./style.module.scss";
import classNames from "classnames";

interface AuthModalProps {
  show: boolean;
  activeModal: string;
}

const AuthModal = ({ show, activeModal }: AuthModalProps) => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state: any) => state.root);
  const handleClose = () => {
    dispatch(resetAuthReducer());
  };
  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      className="maxZindex"
      dialogClassName={
       classNames( auth?.activeModal === forms.signup
        ? styles.modalContainer3
        : auth.activeModal === forms.verifyAge
        ? styles.modalContainer2
        : styles.modalContainer1, "maxZindex")
      }
    >
      <Modal.Body>
        <SwitchForm />
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
