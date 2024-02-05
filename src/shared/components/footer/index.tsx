import {
  AppleDownload,
  FacebookBlack,
  GoogleDownload,
  Instagram,
  LogoIcon,
  WaveUp2,
} from "assets";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { routeConstant } from "shared/routes/routeConstant";
import styles from "./style.module.scss";
import Image from "next/image";
const FooterList = dynamic(() => import("./footerList"), { ssr: false });
interface FooterProps {
  showDownload?: boolean;
}

function Footer({ showDownload }: FooterProps) {
  const [activeTab, setActiveTab] = useState<string>("/");
  const router = useRouter();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, []);

  return (
    <div
      className={classNames(
        "position-relative d-flex flex-column justify-content-end  w-100",
        showDownload ? styles.marginTopDownload : styles.marginTop
      )}
    >
      <Image
        src={WaveUp2}
        alt="wave-2-asset"
        height={90}
        width={1440}
        className={classNames(styles.waveStyle)}
      />
      {showDownload ? (
        <div className={classNames(styles.downloadContainer)}>
          <div
            className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          >
            <div
              className={classNames(
                styles.downloadSubContainer,
                "d-flex align-items-center flex-column flex-md-row gap-2 px-5 m-0 justify-content-center"
              )}
            >
              <div
                className={classNames(
                  "col-12 col-md-8 d-flex flex-column align-items-center w-100"
                )}
              >
                <label className={classNames(styles.downloadTitle)}>
                  Download our mobile app
                </label>
                <label className={classNames(styles.downloadSubTitle)}>
                  Experience the convenience of AlifLaila by downloading our
                  mobile app, which grants you access to the magical world
                  anytime, anywhere.
                </label>
                <label className={classNames(styles.secondaryTitle,"mt-4")}>Coming Soon</label>
              </div>
              {/* <div
                className={classNames(
                  "col-12 col-md-4 d-flex align-items-center justify-content-center justify-content-md-end gap-2 gap-md-4 ps-0"
                )}
              >
                <AppleDownload
                  className={classNames(styles.btn)}
                  role="button"
                />
                <GoogleDownload
                  className={classNames(styles.btn)}
                  role="button"
                />
              </div> */}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={classNames("d-flex align-items-end")}
        style={{ background: "#FFFBF3" }}
      >
        <div className={classNames("w-100")}>
          <div
            className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}
          >
            <div
              className={classNames(
                "d-flex flex-column justify-content-end pb-4"
              )}
            >
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between  flex-column flex-md-row gap-2 gap-md-0"
                )}
              >
                <LogoIcon
                  className={classNames(styles.logo)}
                  role="button"
                  onClick={() => {
                    router.push(routeConstant.home.path);
                  }}
                />

                <FooterList />
                <div
                  className={classNames(
                    "d-flex align-items-center justify-content-center gap-4"
                  )}
                >
                  <FacebookBlack
                    role="button"
                    onClick={() => {
                      window.open(
                        "https://www.facebook.com/profile.php?id=61551356378760",
                        "_blank"
                      );
                    }}
                  />
                  <Instagram
                    role="button"
                    onClick={() => {
                      window.open(
                        "https://www.instagram.com/_aliflaila",
                        "_blank"
                      );
                    }}
                  />
                </div>
              </div>
              <div className={classNames(styles.seperator, "my-3")} />
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-between flex-column flex-md-row gap-2 gap-md-0"
                )}
              >
                <label className={classNames(styles.footerLabel)}>
                  © Copyright 2023, All Rights Reserved
                </label>
                <div className={classNames("d-flex align-items-center gap-3")}>
                  <a
                    className={classNames(
                      styles.footerLabel2,
                      activeTab === routeConstant.privacy.path &&
                        styles.activeItem
                    )}
                    href={routeConstant.privacy.path}
                  >
                    Privacy Policy
                  </a>
                  <a
                    className={classNames(
                      styles.footerLabel2,
                      activeTab === routeConstant.terms.path &&
                        styles.activeItem
                    )}
                    href={routeConstant.terms.path}
                  >
                    Terms & Conditions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
