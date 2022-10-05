import styles from "./Loading.module.scss";

export default function loading() {
  return (
    <div className={`${styles.load} fs-32 notoBold`}>
      <div>G</div>
      <div>N</div>
      <div>I</div>
      <div>D</div>
      <div>A</div>
      <div>O</div>
      <div>L</div>
    </div>
  );
}
