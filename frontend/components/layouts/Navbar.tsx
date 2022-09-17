import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../public/images/logo/logo.png";
// import { useRouter } from "next/router";
import styles from "./Navbar.module.scss";
import before from "../../public/icons/before_menu.svg";
// import DarkMode from "./DarkMode";

export default function Navbar() {
  const { pathname } = useRouter();

  const transition = () => {
    // 클릭시에 햄버거 버튼 애니메이션 줄거에요
    console.log("aa");
  };
  return (
    <nav
      className={
        pathname === "/"
          ? `${styles.navbar_main} flex`
          : `${styles.navbar} flex`
      }
    >
      <Link href="/">
        <a className={styles.logo}>
          <Image src={logo} alt="logo" className={styles.img} />
        </a>
      </Link>
      <div className="flex align-center justify-center">
        <div>{/* <DarkMode /> */}</div>
        <button type="button" className={styles.menu} onClick={transition}>
          <Image src={before} alt="menu" />
        </button>
      </div>
    </nav>
  );
}
