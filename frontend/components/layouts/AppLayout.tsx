import React from "react";
import Navbar from "./Navbar";
import styles from "./AppLayout.module.scss";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={`${styles.root} flex column justify-center`}>
      <Navbar />
      {/* <div className={styles.empty}>empy</div> */}
      <div className={styles.children}>{children}</div>
    </div>
  );
}
