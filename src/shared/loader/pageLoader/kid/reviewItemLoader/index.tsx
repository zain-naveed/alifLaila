import BoxLoader from "shared/loader/box";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";

function ReviewItemLoader() {
  return (
    <>
      <div
        className={classNames(
          styles.reviewMainContainer,
          "d-flex flex-column py-4 gap-2"
        )}
      >
        <div className="d-flex gap-2">
          <BoxLoader iconStyle={classNames(styles.imgStyle)} />
          <div className=" d-flex flex-column align-items-start justify-content-center gap-1">
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              <BoxLoader iconStyle={classNames(styles.reviewName)} />
              <BoxLoader iconStyle={classNames(styles.reviewTime)} />
            </div>
            <BoxLoader iconStyle={classNames(styles.reviewName)} />
          </div>
        </div>
        <BoxLoader iconStyle={classNames(styles.reviewMsg, "w-100")} />
        <BoxLoader iconStyle={classNames(styles.reviewMsg, "w-75")} />
        <BoxLoader iconStyle={classNames(styles.reviewMsg, "w-50")} />
      </div>
    </>
  );
}

export default ReviewItemLoader;
