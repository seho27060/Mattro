import { useRouter } from "next/router";
import styles from "./loading.module.scss";

export default function loading() {
  const router = useRouter();
  setTimeout(function () {
    router.push("/theme/result");
  }, 3000);
  return (
    <>
      <div className={`${styles.load} fs-32 notoBold`}>
        {/* <div>중</div>
    <div>석</div>
    <div>분</div>
    <div>천</div>
    <div>추</div>
    <div>집</div>
    <div>맛</div> */}
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>D</div>
        <div>A</div>
        <div>O</div>
        <div>L</div>
      </div>
      {/* <div>분석중</div> */}
    </>
  );
}
