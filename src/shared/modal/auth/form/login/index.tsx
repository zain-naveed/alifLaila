import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";
import KidLoginModal from "./kid";
import LoginModal from "./general";

function SwitchRegisterForm({ handleClose }: any) {
  const { login } = useSelector((state: any) => state.root);
  switch (login?.user?.role) {
    case roles.reader:
      return <KidLoginModal handleClose={handleClose} />;
    default:
      return <LoginModal handleClose={handleClose} />;
  }
}

export default SwitchRegisterForm;
