import { ArrowRight, LogoIcon } from "assets";
import CustomButton from "shared/components/common/customButton";
import ModalHeader from "shared/components/modalHeader";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "../../constants";
import { setLoginUser } from "shared/redux/reducers/loginSlice";
import { roles } from "shared/utils/enum";

interface WelcomeModalProps {
  handleClose: () => void;
}

function Welcome({ handleClose }: WelcomeModalProps) {
  const dispatch = useDispatch();

  const handleKid = () => {
    dispatch(
      setLoginUser({
        user: { role: roles.reader },
        token: null,
        isLoggedIn: false,
      })
    );
    handleNavigate(forms.login);
  };

  const handleParent = () => {
    dispatch(
      setLoginUser({
        user: { role: roles.parent },
        token: null,
        isLoggedIn: false,
      })
    );
    handleNavigate(forms.login);
  };

  const handleNavigate = (path: number) => {
    dispatch(setAuthReducer({ activeModal: path }));
  };
  return (
    <>
      <ModalHeader
        close={handleClose}
        isFirst={true}
        headerStyle={styles.header}
      />
      <div
        className={classNames(
          "d-flex align-items-center flex-column justify-content-center gap-3 gap-xxl-4 pb-5 pt-3"
        )}
      >
        <LogoIcon className={classNames(styles.logo)} />
        <label className={classNames(styles.heading, "mb-3 mb-xxl-4")}>
          Welcome to a world of reading !
        </label>

        <CustomButton
          title="I’m a Kid"
          containerStyle={classNames(styles.btn1)}
          onClick={() => handleKid()}
        />
        <CustomButton
          title="I ‘m a Parent"
          containerStyle={classNames(styles.btn2)}
          onClick={() => handleParent()}
        />
        <label
          className={classNames(
            styles.bottomLabel,
            "gap-2 d-flex align-items-center justtify-content-center"
          )}
          role="button"
        >
          I ‘m an Educator
          <ArrowRight className={classNames(styles.arrowIcon)} />
        </label>
      </div>
    </>
  );
}

export default Welcome;
