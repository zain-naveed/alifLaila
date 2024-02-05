import Image from "next/image";
import Heading from "shared/components/common/heading";
import Rating from "shared/components/common/rating";
import { classNames } from "shared/utils/helper";
import styles from "./style.module.scss";
import moment from "moment";
interface Props {
  item: any;
}

function ReviewItem(props: Props) {
  const { item } = props;

  return (
    <>
      <div
        className={classNames(
          styles.reviewMainContainer,
          "d-flex flex-column py-4 gap-2"
        )}
      >
        <div className="d-flex gap-2">
          <img
            src={item?.user?.profile_picture}
            alt="Review Not found"
            height={76}
            width={76}
            className={classNames(styles.imgStyle)}
          />
          <div className=" d-flex flex-column align-items-start justify-content-center">
            <div
              className={classNames(
                "d-flex align-items-center justify-content-start gap-2"
              )}
            >
              <Heading
                heading={item?.user?.full_name}
                headingStyle={styles.reviewName}
              />
              <span className={styles.reviewTime}>
                {moment(item?.created_at).format("MMM D YYYY")}
              </span>
            </div>
            <div>
              <Rating active={item?.rating} changeColor />
            </div>
          </div>
        </div>
        <label className={classNames(styles.reviewMsg)}>{item?.review}</label>
      </div>
    </>
  );
}

export default ReviewItem;
