import styles from "./style.module.scss";
import classNames from "classnames";
import Heading from "shared/components/common/heading";
import Title from "shared/components/common/title";
import { mouStatus } from "shared/utils/enum";
interface headerInterface {
  heading: string;
  title: string;
  status: any;
}

const SupportHeader = ({ heading, title, status }: headerInterface) => {
  return (
    <>
      <div
        className={classNames(styles.supportHeader, "px-4 py-3")}
        style={status !== mouStatus.pending ? { border: "0px" } : {}}
      >
        <Heading heading={heading} headingStyle={styles.supportHeading} />
        {status === mouStatus.pending ? (
          <Title title={title} titleStyle={styles.supportTitle} />
        ) : null}
      </div>
    </>
  );
};

export default SupportHeader;
