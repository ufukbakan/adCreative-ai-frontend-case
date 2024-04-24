import { useClickOutside } from "@/hooks/clickOutside";
import { ReactNode, useMemo, useState } from "react";
import Chip from "../Chip";
import List, { ListProps } from "../List";
import Tappable from "../Tappable";
import styles from "./styles.module.scss";

export interface MultiSelectProps<T> {
    options: T[] | ((input: string) => Promise<T[]>),
    label: keyof T,
    renderOption: (option: T, isSelected: boolean) => JSX.Element,
    virtualScroll?: boolean
}

export default function MultiSelect<T>(props: MultiSelectProps<T>) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [selecteds, setSelecteds] = useState<T[]>([]);
    const [input, setInput] = useState("");
    const removeSelected = (element: T) => setSelecteds(p => p.filter(e => e != element));
    const addSelected = (element: T) => setSelecteds(p => [...p, element]);
    const renderSelected = (element: T) => <Chip children={element[props.label] as ReactNode} removable={true} onRemove={() => removeSelected(element)} />
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
    const listData = useMemo(() => {
        if (props.options instanceof Array)
            return props.options;
        else {
            const fetcher = props.options;
            return () => fetcher(input);
        }
    }, [props.options, input])

    const listProps: ListProps<T> = {
        render: renderOption,
        virtualScroll: props.virtualScroll ?? false,
        listHeight: 730,
        itemsToDisplay: 5.12,
        data: listData,
        visible: isExpanded
    }

    return (
        <div className={styles.wrapper} ref={parentRef}>
            <div className={styles['input-container']}>
                <List data={selecteds} render={renderSelected} />
                <Tappable
                    className={styles.input}
                    onTap={() => setIsExpanded(true)}
                    onFocus={() => setIsExpanded(true)}
                >
                    <input
                        type="text"
                        onChange={e => setInput(e.target.value)}
                        onKeyUp={e => { if (e.key === "Backspace" && selecteds.length !== 0 && (e.target as HTMLInputElement).value.length === 0) setSelecteds(p => { const [_last, ...others] = p.reverse(); return others; }); }}
                    />
                </Tappable>
            </div>
            <List {...listProps} />
        </div>
    )
}