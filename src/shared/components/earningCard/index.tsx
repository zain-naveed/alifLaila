import { InfoIcon, ReloadCircleIcon } from "assets";
import classNames from "classnames";
import Heading from "shared/components/common/heading";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
interface Props {
  Icon: any;
  heading: string;
  price: any;
  remaining?: any;
  convvertedPrice?: any;
  onClick?: () => void;
  loading?: boolean;
  showRupee?: boolean;
}

const EarningCard = ({
  Icon,
  heading,
  price,
  remaining,
  convvertedPrice,
  onClick,
  loading,
  showRupee,
}: Props) => {
  return (
    <>
      <div className={styles.cardContainer}>
        <div className={classNames("d-flex align-items-center gap-2")}>
          <Icon />
          <Heading heading={heading} headingStyle={styles.earningHeading} />
        </div>
        <div
          className={classNames(
            "d-flex align-items-end justify-content-between"
          )}
        >
          {loading ? (
            <BoxLoader iconStyle={classNames(styles.priceLoader)} />
          ) : (
            <h1 className={classNames(styles.price, "m-0")}>
              {showRupee ? "RS" : ""} {price ? Math.trunc(price) : 0}
            </h1>
          )}

          {remaining || remaining === 0 ? (
            <div
              className={classNames(
                "d-flex align-items-center justify-content-center gap-2"
              )}
            >
              <InfoIcon className={classNames(styles.iconStyle)} />
              <span className={classNames(styles.remStyle)}>
                {remaining ? remaining : 0} Remaining
              </span>
            </div>
          ) : null}
          {convvertedPrice ? (
            loading ? (
              <BoxLoader iconStyle={classNames(styles.remStyleLoader)} />
            ) : (
              <div
                className={classNames(
                  "d-flex align-items-center justify-content-center gap-2"
                )}
              >
                <ReloadCircleIcon
                  className={classNames(styles.iconStyle)}
                  role="button"
                  onClick={onClick}
                />
                <span className={classNames(styles.remStyle)}>
                  Rs. {convvertedPrice ? convvertedPrice : 0} Converted
                </span>
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EarningCard;
