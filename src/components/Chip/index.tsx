import { PropsWithChildren } from "react";
import styles from "./styles.module.scss";
import Tappable from "../Tappable";

interface NonRemovableChip extends PropsWithChildren {
    removable: false
}
interface RemovableChip extends PropsWithChildren {
    removable: true,
    onRemove: () => void
}

export type ChipProps = RemovableChip | NonRemovableChip;

export default function Chip(props: ChipProps) {
    const isRemovable = props.removable;

    return (
        <div className={styles.chip}>
            {props.children}
            {isRemovable && <Tappable onTap={props.onRemove} className={styles['remove-button']} aria-label="remove-button">&times;</Tappable>}
        </div>
    )

}