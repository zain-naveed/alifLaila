import classNames from "classnames";
import BoxLoader from "shared/loader/box";
import SingleTestimonialLoader from "./singleTestimonial";
import styles from "./style.module.scss";

const TestimonialsLoader = () => {
  return (
    <div
      className={classNames(
        "my-5 d-flex align-items-center justify-content-center"
      )}
    >
      <div
        className={classNames(
          styles.customContainer,
          "px-3 px-sm-0 d-flex align-items-center flex-column justify-content-center w-100 gap-3"
        )}
      >
        <BoxLoader iconStyle={classNames(styles.title)} />
        <div className={classNames("d-flex flex-column gap-2 w-100")}>
          <BoxLoader iconStyle={classNames(styles.subTitle, "w-100")} />
          <BoxLoader iconStyle={classNames(styles.subTitle, "w-100")} />
          <BoxLoader iconStyle={classNames(styles.subTitle, "w-75")} />
        </div>

        <div
          className={classNames(
            "d-flex align-items-center justify-content-center w-100 mt-4"
          )}
        >
          <BoxLoader iconStyle={classNames(styles.activeArrowContainer)} />
          <div
            className={classNames(
              styles.w90,
              "d-flex justify-content-around align-items-center"
            )}
          >
            <SingleTestimonialLoader />
            <div className={classNames("d-none d-md-flex")}>
              <SingleTestimonialLoader />
            </div>
          </div>
          <BoxLoader iconStyle={classNames(styles.activeArrowContainer)} />
        </div>
      </div>
    </div>
  );
};

export default TestimonialsLoader;
