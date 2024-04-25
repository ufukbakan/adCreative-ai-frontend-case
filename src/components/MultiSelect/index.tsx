import { useClickOutside } from "@/hooks/clickOutside";
import { ReactNode, useMemo, useState } from "react";
import Chip from "../Chip";
import List, { ListProps } from "../List";
import Tappable from "../Tappable";
import styles from "./styles.module.scss";
import { getCumilativeAriaLabels } from "@/utils/domUtils";
import { useHeightToBottomScreen } from "@/hooks/heightToBottom";
import { useRecoilState } from "recoil";
import { inputAtom } from "@/atoms/multiSelectInput";

export interface MultiSelectProps<T> {
    options: T[] | ((input: string) => Promise<T[]>),
    chipLabel: keyof T,
    renderOption: (parameters: RenderParameters<T>) => JSX.Element,
    virtualScroll?: boolean
}
interface RenderParameters<T> {
    option: T,
    isSelected: boolean,
    index: number
}

export default function MultiSelect<T>(props: MultiSelectProps<T>) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [selecteds, setSelecteds] = useState<T[]>([]);
    const [input, setInput] = useRecoilState(inputAtom);
    const removeSelected = (element: T) => setSelecteds(p => p.filter(e => e != element));
    const addSelected = (element: T) => setSelecteds(p => [...p, element]);
    const renderSelected = (element: T) => <Chip children={element[props.chipLabel] as ReactNode} removable={true} onRemove={() => removeSelected(element)} />
    const toggleSelected = (element: T) => {
        if (selecteds.includes(element)) {
            removeSelected(element);
        } else {
            addSelected(element);
        }
    };

    const fold = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            const ignoreFoldingFor = ["remove-button", "option"]
            const ariaLabels = getCumilativeAriaLabels(e.target);
            if (!ariaLabels.some(label => ignoreFoldingFor.includes(label)))
                setIsExpanded(false);
        }
    };
    const parentRef = useClickOutside<HTMLDivElement>({ callback: fold });
    const heightToBottom = useHeightToBottomScreen(parentRef);

    const renderOption = (element: T, index: number) => <Tappable onTap={() => toggleSelected(element)}>{props.renderOption({option: element, isSelected: selecteds.includes(element), index })}</Tappable>
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
        listHeight: heightToBottom - 100,
        itemsToDisplay: (heightToBottom - 100) / 120,
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
                        onChange={e => setInput(e.target.value.trim())}
                        onKeyUp={e => { if (e.key === "Backspace" && selecteds.length !== 0 && (e.target as HTMLInputElement).value.length === 0) setSelecteds(p => { const copy = [...p]; copy.pop(); return copy; }); }}
                    />
                </Tappable>
            </div>
            <div className={styles['options-container']}>
                <List {...listProps} />
            </div>
        </div>
    )
}