import { useSelector } from "react-redux";
import { roles } from "shared/utils/enum";
import MainNavWrapper from "./main";
import ReaderNavWrapper from "./reader";

function NavWrapper() {
  const { login } = useSelector((state: any) => state.root);
  if (login?.user?.role === roles?.reader && login?.isLoggedIn) {
    return <ReaderNavWrapper />;
  } else {
    return <MainNavWrapper />;
  }
}

export default NavWrapper;
