import Link from "next/link";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../public/images/logo/logo_gray.png";
import logoNav from "../../public/images/logo/logo_nav.png";
import sound from "../../public/icons/volume_off.svg";
// import { useRouter } from "next/router";
import styles from "./Navbar.module.scss";
// import DarkMode from "./DarkMode";

export default function Navbar() {
  // console.log(document.querySelector("body"));
  const { pathname } = useRouter();
  const router = useRouter();
  const bodyRef = useRef();
  const [clicked, setClicked] = useState(false);

  const navList = [
    ["/", "메인"],
    ["/subway", "노선별 추천"],
    ["/theme", "오늘의 추천"],
    ["/game", "지하철 게임"]
  ];

  const toggleClass = (element, stringClass) => {
    // 해당 요소의 클래스 속성값을 추가, 같은 캘래스 명 있는 경우 무시
    if (element.current.classList.contains(stringClass)) {
      element.current.classList.remove(stringClass);
      setClicked(false);
    } else {
      element.current.classList.add(stringClass);
      setClicked(true);
    }
  };

  const movePage = (url) => {
    router.push(url);
    setTimeout(function () {
      if (bodyRef.current.classList.contains(styles.nav_active)) {
        bodyRef.current.classList.remove(styles.nav_active);
        setClicked(false);
      }
    }, 10);
  };

  return (
    <span ref={bodyRef} className="flex align-center justify-center column">
      <nav
        className={
          pathname === "/"
            ? `${styles.navbar_main} flex`
            : `${styles.navbar} flex`
        }
      >
        <Link href="/">
          <div className={styles.logo}>
            <Image
              src={clicked ? logoNav : logo}
              alt="logo"
              className={styles.img}
            />
          </div>
        </Link>
        <div className={`${styles.nav_wrap} flex align-center justify-center`}>
          {/* <button type="button">
            <Image src={sound} alt="sound" />
          </button> */}
          <button
            type="button"
            onClick={() => toggleClass(bodyRef, styles.nav_active)}
            className={`${styles.menu_icon} ${styles.hover_target}`}
          >
            <span
              className={`${styles.menu_icon__line} ${styles.menu_icon__line_left}`}
            />
            <span className={`${styles.menu_icon__line}`} />
            <span
              className={`${styles.menu_icon__line} ${styles.menu_icon__line_right}`}
            />
          </button>
        </div>
      </nav>

      <div className={`${styles.nav} flex justify-center`}>
        <div className={styles.nav__content}>
          <ul className={styles.nav__list}>
            {navList.length !== 0 &&
              navList.map((check) => {
                return (
                  <li
                    key={check[0]}
                    className={
                      pathname === check[0]
                        ? `${styles.nav__list_item} ${styles.active_nav}`
                        : `${styles.nav__list_item}`
                    }
                  >
                    <button
                      type="button"
                      onClick={() => {
                        movePage(check[0]);
                      }}
                      className={`${styles.hover_target} fs-60 coreBold`}
                    >
                      {check[1]}
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </span>
  );
}
