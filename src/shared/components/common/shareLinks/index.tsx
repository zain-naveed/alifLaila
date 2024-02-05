import classNames from "classnames";
import {
  FacebookShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import styles from "./style.module.scss";
import {
  ShareFacebookIcon,
  ShareLinkdInIcon,
  SharePinterestIcon,
  ShareTwitterIcon,
} from "assets";

interface ShareSocialMediaLinkProps {
  link: string;
}

function ShareSocialMediaLink({ link }: ShareSocialMediaLinkProps) {
  return (
    <div className={classNames("d-flex gap-2")}>
      <div className={classNames(styles.socialContainer)} role="button">
        <LinkedinShareButton
          url={link}
          className={classNames(styles.socialContainer)}
        >
          <ShareLinkdInIcon className={classNames(styles.iconStyle)} />
        </LinkedinShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <PinterestShareButton
          media={link}
          url={link}
          className={classNames(styles.socialContainer)}
        >
          <SharePinterestIcon className={classNames(styles.iconStyle)} />
        </PinterestShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <TwitterShareButton
          url={link}
          className={classNames(styles.socialContainer)}
        >
          <ShareTwitterIcon className={classNames(styles.iconStyle)} />
        </TwitterShareButton>
      </div>
      <div className={classNames(styles.socialContainer)} role="button">
        <FacebookShareButton
          url={link}
          className={classNames(styles.socialContainer)}
        >
          <ShareFacebookIcon className={classNames(styles.iconStyle)} />
        </FacebookShareButton>
      </div>
    </div>
  );
}

export default ShareSocialMediaLink;
