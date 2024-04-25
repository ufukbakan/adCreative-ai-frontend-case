import styles from "./styles.module.scss";

type SpinProps = {
    size?: number
}
export default function Spin(props: SpinProps) {
    const size = props.size ?? 16;
    return <div className={styles['spin-container']} style={{ fontSize: size }}>
        <div className={styles['spin-circle']}></div>
    </div>;
}