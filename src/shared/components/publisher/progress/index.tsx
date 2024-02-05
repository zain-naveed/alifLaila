import { useEffect, useRef } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { classNames } from "shared/utils/helper";
import styles from "./progress.module.scss";
interface Props {
  value: number;
}
function Progress(props: Props) {
  const { value } = props;
  return (
    <div>
      <Tooltip value={value}>
        <ProgressBar
          className={styles.maiMprogress}
          animated={false}
          now={value || 0}
        />
        {/* {value ? (
          
        ) : (
          <ProgressBar className={styles.maiMprogress} animated={false} />
          )} */}
      </Tooltip>
      {/* <ProgressBar animated={true} now={0} id="test" /> */}
    </div>
  );
}

const Tooltip = ({ children, value }: any) => {
  const leftOffset = useRef<number>(12);

  return (
    <div className="tooltips d-flex align-items-center" id="tooltips">
      {children}
      <span className="tooltipText" id="tooltiptext">
        {value}%
      </span>
    </div>
  );
};

export default Progress;
