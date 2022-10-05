import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "./Navbar";
import styles from "./AppLayout.module.scss";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        <title>맛트로</title>
      </Head>
      <div className={`${styles.root} flex column align-center`}>
        <Navbar />
        <div
          className={pathname !== "/" ? styles.children : styles.children_main}
        >
          {children}
        </div>
      </div>
    </>
  );
}
