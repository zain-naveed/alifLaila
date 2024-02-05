import React from "react";
import classNames from "classnames";
import styles from "./style.module.scss";
import BoxLoader from "shared/loader/box";
interface Props {
  iteration: number;
}

function AnswerLoader(props: Props) {
  const { iteration } = props;

  return (
    <>
      <div className={classNames(styles.answerContainer)}>
        {Array.from(Array(iteration).keys()).map((item, index) => {
          return <BoxLoader iconStyle={styles.answerItem} />;
        })}
      </div>
    </>
  );
}

export default AnswerLoader;
