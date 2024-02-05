import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";
import RegisterPublisher from "./publisher";
import RegisterReader from "./kid";
import RegisterParent from "./parent";
import RegisterAuthor from "./author";

function SwitchRegisterForm({ handleClose }: any) {
  const { login } = useSelector((state: any) => state.root);
  switch (login?.user?.role) {
    case roles.reader:
      return <RegisterReader handleClose={handleClose} />;
    case roles.publisher:
      return <RegisterPublisher handleClose={handleClose} />;
    case roles.parent:
      return <RegisterParent handleClose={handleClose} />;
    case roles.author:
      return <RegisterAuthor handleClose={handleClose} />;
    default:
      return <RegisterReader handleClose={handleClose} />;
  }
}

export default SwitchRegisterForm;
