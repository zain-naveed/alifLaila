import { useDispatch, useSelector } from "react-redux";
import { setAuthReducer } from "shared/redux/reducers/authModalSlice";
import { forms } from "./constants";
import VerifyAgeModal from "./form/age";
import CreatePasswordModal from "./form/createPassword";
import LoginModal from "./form/login";
import OtpModal from "./form/otp";
import SignUpModal from "./form/signup";
import VerifyEmailModal from "./form/verifyEmail";
import Welcome from "./form/welcome";

function SwitchForm() {
  const dispatch = useDispatch();

  const { auth } = useSelector((state: any) => state.root);

  const handleClose = () => {
    dispatch(setAuthReducer({ showModal: false }));
  };

  switch (auth?.activeModal) {
    case forms.login:
      return <LoginModal handleClose={handleClose} />;
    case forms.welcome:
      return <Welcome handleClose={handleClose} />;
    case forms.verifyAge:
      return <VerifyAgeModal handleClose={handleClose} />;
    case forms.signup:
      return <SignUpModal handleClose={handleClose} />;
    case forms.otp:
      return <OtpModal handleClose={handleClose} />;
    case forms.emailVerification:
      return <VerifyEmailModal handleClose={handleClose} />;
    case forms.resetpassword:
      return <CreatePasswordModal handleClose={handleClose} />;
    default:
      return <Welcome handleClose={handleClose} />;
  }
}

export default SwitchForm;
