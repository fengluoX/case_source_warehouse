import React from "react";
import styles from "./index.module.css";

const Basic: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.pad}></div>
        <div className={styles.target}></div>
        <div className={styles.pad}></div>
      </div>
      <span className={styles.info}>isIntersecting = true</span>
    </>
  );
};

export default Basic;
