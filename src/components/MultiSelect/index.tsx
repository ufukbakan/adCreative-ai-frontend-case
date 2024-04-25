import { inputAtom } from "@/atoms/multiSelectInput";
import { useClickOutside } from "@/hooks/clickOutside";
import { useHeightToBottomScreen } from "@/hooks/heightToBottom";
import { getCumilativeAriaLabels } from "@/utils/domUtils";
import { KeyboardEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import Chip from "../Chip";
import List, { ListProps } from "../List";
import Tappable from "../Tappable";
import styles from "./styles.module.scss";
import Overflow from "../Overflow";

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
    const [allowKeyboardDelete, setAllowKeyboardDelete] = useState(true);
    const removeSelected = (element: T) => setSelecteds(p => p.filter(e => e != element));
    const addSelected = (element: T) => setSelecteds(p => [...p, element]);
    const renderSelected = (element: T) => <Chip key={JSON.stringify(element[props.chipLabel])} children={element[props.chipLabel] as ReactNode} removable={true} onRemove={() => removeSelected(element)} />
    const chips = selecteds.map(renderSelected);
    const toggleSelected = (element: T) => {
        if (selecteds.includes(element)) {
            removeSelected(element);
        } else {
            addSelected(element);
        }
    };

    const fold = (e: Event) => {
        if (e.target instanceof HTMLElement) {
            const ignoreFoldingFor = ["remove-button", "option", "highlighted", "overflow"]
            const ariaLabels = getCumilativeAriaLabels(e.target);
            if (!ariaLabels.some(label => ignoreFoldingFor.includes(label))) {
                setIsExpanded(false);
            }
        }
    };
    const parentRef = useClickOutside<HTMLDivElement>({ callback: fold });
    const heightToBottom = useHeightToBottomScreen(parentRef);

    const renderOption = (element: T, index: number) => <Tappable onTap={() => toggleSelected(element)}>{props.renderOption({ option: element, isSelected: selecteds.includes(element), index })}</Tappable>
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

    const onKeyUpListener = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && selecteds.length !== 0 && e.currentTarget.value.length === 0 && allowKeyboardDelete)
            setSelecteds(p => { const copy = [...p]; copy.pop(); return copy; });
        if (e.currentTarget.value.length === 0)
            setAllowKeyboardDelete(true);
        else
            setAllowKeyboardDelete(false);
    }, [selecteds, allowKeyboardDelete])

    return (
        <div className={styles.wrapper} ref={parentRef}>
            <div className={styles['input-container']}>
                <Overflow gap={9} maxWidth={(parentRef.current?.offsetWidth || 0) / 2} children={chips} />
                {/* <List data={selecteds} render={renderSelected} /> */}
                <input
                    className={styles.input}
                    type="text"
                    onFocus={() => setIsExpanded(true)}
                    onChange={e => setInput(e.target.value.trim())}
                    onKeyUp={onKeyUpListener}
                />
            </div>
            <div className={styles['options-container']}>
                <List {...listProps} />
            </div>
        </div>
    )
}