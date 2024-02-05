import {
  LandingAsset1,
  LandingAsset2,
  LandingAsset3,
  LandingAsset4,
  WaveUp,
  WaveUpBlue,
} from "assets";
import classNames from "classnames";
import Image from "next/image";
import styles from "./style.module.scss";

const ContentCard = () => {
  return (
    <div className={classNames("d-flex flex-column align-items-start ")}>
      <div className={classNames(styles.topContainer)}>
        <label>
          Making Sense of the{" "}
          <span className={classNames(styles.secondary)}>World</span> –{" "}
          <span className={classNames(styles.primary)}>We help kids learn</span>{" "}
          by expanding their horizons
        </label>
      </div>
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 w-100 mt-5 w-100"
        )}
      >
        <div
          className={classNames(
            "d-flex flex-column  flex-sm-row  align-items-center justify-content-between w-100 gap-3 gap-md-0"
          )}
        >
          <div className={classNames(styles.textContainer, "gap-2")}>
            <div
              className={classNames("d-flex align-items-center gap-0 gap-md-4")}
            >
              <label className={classNames(styles.contentTitle)}>
                Let your Curiosity Lead the Way
              </label>
              <div
                className={classNames(styles.lineStyle1, "d-none d-sm-flex")}
              />
            </div>
            <label className={classNames(styles.contentSubTitle)}>
              Some tales are timeless; some have just sprung from the times that
              we live in. Whatever their origins, kids can never resist a story
              that captivates their imagination. This is what we do best; spark
              that love for reading. From the classics to the contemporary, our
              wide and diverse range of books tingles your curiosity. Feel free
              to explore and unlock new titles from our book-base.
            </label>
          </div>
          <div
            className={classNames(
              "d-flex align-items-end justify-content-between gap-3"
            )}
          >
            <Image
              alt=""
              src={LandingAsset1}
              className={classNames(styles.asset1Style)}
              height={321}
              width={549}
            />
          </div>
        </div>
      </div>
      <div className={classNames(styles.customContainer, "w-100 mt-3")}>
        <Image
          alt=""
          src={WaveUpBlue}
          height={118}
          width={1280}
          className={classNames(styles.waveUpBlue)}
        />
        <div
          className={classNames(
            "d-flex flex-column-reverse  flex-sm-row  align-items-start justify-content-center w-100 px-3",
            styles.content2Container
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-end justify-content-between gap-3"
            )}
          >
            <Image
              alt=""
              src={LandingAsset2}
              className={classNames(styles.asset2Style)}
              height={385}
              width={385}
            />
          </div>
          <div
            className={classNames(
              styles.textContainer,
              styles.textContainer2,
              "gap-2"
            )}
          >
            <div
              className={classNames("d-flex align-items-center gap-0 gap-md-4")}
            >
              <label className={classNames(styles.contentTitle, styles.yellow)}>
                Let your Imagination Soar
              </label>
              <div
                className={classNames(styles.lineStyle2, "d-none d-sm-flex")}
              />
            </div>
            <label className={classNames(styles.contentSubTitle)}>
              You can be anywhere; you can be anyone; that’s the power of
              stories. Embark on a fun-filled adventure that fuels your
              creativity and lets your imagination run the show.
            </label>
          </div>
        </div>
        <Image
          alt=""
          src={WaveUp}
          height={134}
          width={1280}
          className={classNames(styles.waveUp)}
        />
      </div>
      <div className={classNames(styles.customContainer, "px-3 px-sm-0 w-100")}>
        <div
          className={classNames(
            "d-flex flex-column  flex-sm-row  align-items-center justify-content-around w-100 gap-3 gap-md-0",
            styles.content3Container
          )}
        >
          <div className={classNames(styles.textContainer, "gap-2")}>
            <div
              className={classNames("d-flex align-items-center gap-0 gap-md-4")}
            >
              <label className={classNames(styles.contentTitle, styles.green)}>
                Enriching Aesthetics
              </label>
              <div
                className={classNames(
                  styles.lineStyle2,
                  styles.lineStyle3,
                  "d-none d-sm-flex"
                )}
              />
            </div>
            <label className={classNames(styles.contentSubTitle)}>
              It’s an adventure set in the cold winter snow, here the sun is
              burning the back of the weary traveler, oh no, the fight between
              the good and evil is so intense, here the flying carpet is doing
              what a drone does today – giving you the best aerial views.
              AlifLaila empowers the reader to visualize and explore the world's
              richness through the maze of the plot of each story.
            </label>
          </div>
          <div
            className={classNames(
              "d-flex align-items-end justify-content-between gap-3"
            )}
          >
            <Image
              alt=""
              src={LandingAsset3}
              className={classNames(styles.asset3Style)}
              height={456}
              width={511}
            />
          </div>
        </div>
      </div>
      <div className={classNames(styles.customContainer, "w-100 mt-3")}>
        <Image
          alt=""
          src={WaveUpBlue}
          height={118}
          width={1280}
          className={classNames(styles.waveUpBlue, styles.waveFlip)}
        />
        <div
          className={classNames(
            "d-flex flex-column-reverse  flex-sm-row  align-items-center justify-content-center w-100 px-3 pb-4",
            styles.content4Container
          )}
        >
          <div
            className={classNames(
              "d-flex align-items-end justify-content-between gap-3"
            )}
          >
            <Image
              alt=""
              src={LandingAsset4}
              className={classNames(styles.asset4Style)}
              height={295}
              width={541}
            />
          </div>
          <div className={classNames(styles.textContainer, "gap-2")}>
            <div
              className={classNames("d-flex align-items-center gap-0 gap-md-4")}
            >
              <label
                className={classNames(styles.contentTitle, styles.secondary)}
              >
                The Fun Way to Learn
              </label>
              <div
                className={classNames(
                  styles.lineStyle1,
                  styles.lineStyle4,
                  "d-none d-sm-flex"
                )}
              />
            </div>
            <label className={classNames(styles.contentSubTitle)}>
              AlifLaila offers a fun and immersive way for kids to learn,
              whether they're at home or on the go, making the learning
              experience an enjoyable voyage of discovery, and an essential part
              of growing up.
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
