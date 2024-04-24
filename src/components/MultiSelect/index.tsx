import { useState } from "react";
import styles from "./styles.module.scss";
import List from "../List";
import Chip from "../Chip";
import Tappable from "../Tappable";
import { useClickOutside } from "@/hooks/clickOutside";

interface HasLabel {
    label: string
}

export interface MultiSelectProps<T extends HasLabel> {
    options: T[],
    renderOption: (option: T) => JSX.Element
}

export default function MultiSelect<T extends HasLabel>(props: MultiSelectProps<T>) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [selecteds, setSelecteds] = useState(props.options.slice(0, 2));
    const removeSelected = (element: T) => setSelecteds(p => p.filter(e => e != element));
    const addSelected = (element: T) => setSelecteds(p => [...p, element]);
    const renderSelected = (element: T) => <Chip key={element.label} children={element.label} removable={true} onRemove={() => removeSelected(element)} />
    const toggleSelected = (element: T) => {
        if (selecteds.includes(element)) {
            removeSelected(element);
        } else {
            addSelected(element);
        }
    };

    const keepExpandedLabels = ["remove-button", "option"]
    const fold = (e: Event) => {
        if (e.target instanceof HTMLElement && !keepExpandedLabels.includes(e.target.ariaLabel || "")) {
            setIsExpanded(false);
        }
    };
    const parentRef = useClickOutside<HTMLDivElement>({ callback: fold });

    const renderOption = (element: T) => <Tappable onTap={() => toggleSelected(element)}>{props.renderOption(element)}</Tappable>

    return (
        <div className={styles.wrapper} ref={parentRef}>
            <div className={styles['input-container']}>
                <List data={selecteds} render={renderSelected} />
                <Tappable onTap={() => setIsExpanded(true)} className={styles.input}>
                    <input type="text" />
                </Tappable>
            </div>
            {
                isExpanded &&
                <List data={props.options} render={renderOption} virtualScroll={true} listHeight={730} itemsToDisplay={5.12} />
            }
        </div>
    )
}