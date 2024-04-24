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
    renderOption: (option: T, isSelected: boolean) => JSX.Element
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

    const fold = (e: Event) => {
        const ignoreFoldingFor = ["remove-button", "option"]
        if (e.target instanceof HTMLElement && !ignoreFoldingFor.includes(e.target.ariaLabel || "")) {
            setIsExpanded(false);
        }
    };
    const parentRef = useClickOutside<HTMLDivElement>({ callback: fold });

    const renderOption = (element: T) => <Tappable onTap={() => toggleSelected(element)}>{props.renderOption(element, selecteds.includes(element))}</Tappable>

    return (
        <div className={styles.wrapper} ref={parentRef}>
            <div className={styles['input-container']}>
                <List data={selecteds} render={renderSelected} />
                <Tappable
                    className={styles.input}
                    onTap={() => setIsExpanded(true)}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setIsExpanded(false)}
                >
                    <input
                        type="text"
                        onKeyUp={e => { if (e.key === "Backspace" && selecteds.length !== 0 && (e.target as HTMLInputElement).value.length === 0) setSelecteds(p => { const [_last, ...others] = p.reverse(); return others; }); }}
                    />
                </Tappable>
            </div>
            {
                isExpanded &&
                <List data={props.options} render={renderOption} virtualScroll={true} listHeight={730} itemsToDisplay={5.12} />
            }
        </div>
    )
}