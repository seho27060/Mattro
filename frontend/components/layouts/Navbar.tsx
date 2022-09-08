import Link from "next/link";
import Image from "next/image";
// import { useRouter } from "next/router";
import styles from "./Navbar.module.scss";
import before from "../../public/icons/before_menu.svg";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <Link href="/">
        <a>LOGO</a>
      </Link>
      <div>
        <button type="button" className={styles.menu}>
          <Image src={before} alt="menu" />
        </button>
      </div>
    </header>
  );
}
