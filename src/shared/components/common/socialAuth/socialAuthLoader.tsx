import { FacebookIcon, GoogleIcon } from "assets";
import classNames from "classnames";
import Image from "next/image";
import styles from "./style.module.scss";

function SocialAuthLoader() {
  return (
    <div className={classNames("d-flex flex-column gap-0")}>
      <div className={classNames(styles.socialIconContainer)} role={"button"}>
        <Image
          src={GoogleIcon}
          className={classNames(styles.iconStyle)}
          alt="google-logo"
        />
        <span className={classNames("mx-auto", styles.socialText)}>
          Continue with Google
        </span>
      </div>
      <div className={classNames(styles.socialIconContainer)} role={"button"}>
        <FacebookIcon className={classNames(styles.iconStyle)} />
        <span className={classNames("mx-auto", styles.socialText)}>
          Continue with Facebook
        </span>
      </div>
    </div>
  );
}

export default SocialAuthLoader;
