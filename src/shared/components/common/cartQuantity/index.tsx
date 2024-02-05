import { AddIcon, MinusIcon } from "assets";
import classNames from "classnames";
import styles from "./style.module.scss";
interface Props {
  increment?: (args?: any) => any;
  decrement?: (args?: any) => any;
  value: number | string;
  containerStyle?: any;
  decrementStyle?: any;
  incrementStyle?: any;
  cartValueStyle?: any;
  iconStyle?: any;
}

function CardQuantity(props: Props) {
  const {
    increment,
    decrement,
    value,
    containerStyle,
    decrementStyle,
    incrementStyle,
    cartValueStyle,
    iconStyle,
  } = props;

  return (
    <div className={containerStyle ? containerStyle : styles.cartContainer}>
      <div
        className={decrementStyle ? decrementStyle : styles.minus}
        onClick={decrement}
      >
        <MinusIcon
          className={classNames(iconStyle ? iconStyle : styles.iconStyle)}
        />
      </div>
      <span
        className={classNames(
          cartValueStyle ? cartValueStyle : styles.cartValue
        )}
      >
        {value}
      </span>
      <div
        className={incrementStyle ? incrementStyle : styles.add}
        onClick={increment}
      >
        <AddIcon
          className={classNames(iconStyle ? iconStyle : styles.iconStyle)}
        />
      </div>
    </div>
  );
}

export default CardQuantity;
