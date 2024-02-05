import React from "react";
import styles from "./style.module.scss";

import BoxLoader from "shared/loader/box";
interface Props {
  
}

function QuestionLoader(props: Props) {
  const {  } = props;

  return (
    <>
    <div className="d-flex flex-column">
    <BoxLoader iconStyle={styles.heading} />
    <BoxLoader iconStyle={styles.smallLine} />
    </div>
    
    </>
  );
}

export default QuestionLoader;
