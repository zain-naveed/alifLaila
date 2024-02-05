import classNames from "classnames";
import CustomButton from "shared/components/common/customButton";
import Heading from "shared/components/common/heading";
import styles from "./style.module.scss";
import { kidAccountRole } from "shared/utils/enum";
interface Props {
  total: any;
  totalShippig: any;
  handleAction: () => void;
  kid_role?: number;
}

function CheckoutCard({ total, totalShippig, handleAction, kid_role }: Props) {
  return (
    <>
      <div className={classNames(styles.cartSummaryContainer)}>
        <div>
          <Heading
            heading="Cart summary"
            headingStyle={styles.summaryHeading}
          />
          {/* <div className={styles.feeMain}>
            <ShipItem value={totalShippig} />
          </div> */}

          <div
            className={classNames(
              styles.subTotalCont,
              "d-flex justify-content-between"
            )}
          >
            <span className={classNames(styles.subTitle)}>Subtotal</span>
            <span className={classNames(styles.subValue)}>Rs.{total}</span>
          </div>
          <div
            className={classNames(
              styles.totalCont,
              "d-flex justify-content-between"
            )}
          >
            <span className={classNames(styles.totTitle)}>Total</span>
            <span className={classNames(styles.totValue)}>
              Rs.{Math.trunc(Number(total) + Number(totalShippig))}
            </span>
          </div>
          {kid_role !== undefined && kid_role === kidAccountRole?.individual ? (
            <CustomButton
              title="Proceed to Checkout"
              containerStyle={classNames(styles.proceedBtn, "mt-4")}
              onClick={handleAction}
            />
          ) : (
            kid_role === undefined && (
              <CustomButton
                title="Proceed to Checkout"
                containerStyle={classNames(styles.proceedBtn, "mt-4")}
                onClick={handleAction}
              />
            )
          )}
        </div>
      </div>
    </>
  );
}
interface ShipItemProps {
  value: any;
}
const ShipItem = ({ value }: ShipItemProps) => {
  return (
    <div className={classNames(styles.feeContainer)}>
      <div>Shipping Cost</div>
      <span>+Rs.{Math.trunc(value)}</span>
    </div>
  );
};

export default CheckoutCard;
