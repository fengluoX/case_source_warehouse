import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";

const Basic: React.FC = () => {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  const [isObserve, setIsObserve] = useState<boolean>(false);
  const [observe, setObserve] = useState<IntersectionObserver>();

  const target = useRef(null);

  useEffect(() => {
    const observe = new IntersectionObserver(
      (entrys) => {
        entrys.forEach((entry) => {
          setIntersecting(entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      }
    );
    setObserve(observe);
    return () => {
      observe.disconnect();
    };
  }, []);

  const toogleObserve = () => {
    setIsObserve(!isObserve);
    if (isObserve) {
      observe?.unobserve(target.current!);
    } else {
      observe?.observe(target.current!);
    }
  };

  return (
    <>
      <div className={styles.info}>
        isIntersecting = {String(isIntersecting)}
        <button onClick={toogleObserve}>
          {isObserve ? "停止" : "启用"}监控
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.pad}></div>
        <div
          style={{
            background: "rgb(237, 28, 36)",
            height: "100px",
            outline: "100px solid rgba(0, 0, 0, 0.2)",
          }}
          ref={target}
        ></div>
        <div className={styles.pad}></div>
      </div>
    </>
  );
};

export default Basic;
