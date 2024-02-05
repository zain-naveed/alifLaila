import { StoryIcon } from "assets";
import classNames from "classnames";
import React from "react";
import Heading from "../heading";
import SocialButton from "../../socialButton";
import Title from "../title";
import styles from "./style.module.scss";
interface Props {}

function Download(props: Props) {
  const {} = props;

  return (
    <>
      <div
        className={classNames(
          styles.customContainer,
          styles.downloadContainer,
          "d-flex justify-content-center align-items-center w-100"
        )}
      >
        <div>
          <Heading heading="Download Alif Laila App" />
          <Title title="You can download our app from Google Play Store & App Store." />
          <div className={classNames("row", styles.socialButtonContainer)}>
            <SocialButton
              Icon={StoryIcon}
              buttonStyle={styles.appStoreMargin}
              ButtonHeading="App Store"
              title="Download on the"
            />
            <SocialButton
              Icon={StoryIcon}
              ButtonHeading="Google Play"
              title="GET IT ON"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Download;
