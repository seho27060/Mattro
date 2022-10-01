import { useRouter } from "next/router";
import styles from "./Loading.module.scss";

export default function loading() {
  const router = useRouter();
  // setTimeout(function () {
  // router.push("/theme/result");
  // }, 3000);
  return (
    <>
      <div className={`${styles.load} fs-32 notoBold`}>
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>D</div>
        <div>A</div>
        <div>O</div>
        <div>L</div>
      </div>
    </>
  );
}
