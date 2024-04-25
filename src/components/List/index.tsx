import React, { ForwardedRef, forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import styles from "./styles.module.scss";
import Spin from "../Spin";

interface ListBaseProps<T> {
    visible?: boolean,
    data: T[] | (() => Promise<T[]>),
    onScrollToBottom?: () => void,
    render: ((element: T) => JSX.Element) | ((element: T, index: number) => JSX.Element),
}
interface NonVirutalListProps<T> extends ListBaseProps<T> {
    virtualScroll?: false
    listHeight?: number,
}
interface VirutalListProps<T> extends ListBaseProps<T> {
    virtualScroll: true,
    listHeight: number,
    itemsToDisplay: number
}

export type ListProps<T> = NonVirutalListProps<T> | VirutalListProps<T>;
export interface ListRef<T> {
    addData: (...elements: T[]) => void
}

function List<T>(props: ListProps<T>, ref: ForwardedRef<ListRef<T>>) {
    const [data, setData] = useState<T[]>([]);
    const lastFetcher = useRef<() => Promise<T[]>>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const debounceTimer = useRef<NodeJS.Timeout>();
    const debounceDelay = 750;
    useImperativeHandle(ref, () => ({
        addData: (...elements: T[]) => setData(p => [...p, ...elements])
    }), []);

    useLayoutEffect(() => {
        if (props.data instanceof Array) {
            setData(props.data);
            setIsLoading(false);
        } else {
            const fetcher = props.data;
            clearTimeout(debounceTimer.current);
            if (lastFetcher.current !== fetcher) {
                setIsLoading(true);
            }
            lastFetcher.current = fetcher;
            debounceTimer.current = setTimeout(() => {
                fetcher()
                    .then(setData)
                    .catch(e => {
                        setError(e);
                        console.error(e);
                    })
                    .finally(() => setIsLoading(false));
            }, debounceDelay)
        }
    }, [props.data])

    function renderVirtualRow(options: ListChildComponentProps) {
        return <div className={styles['virtual-list-item']} aria-label="option" style={{ ...options.style }}>{props.render(data[options.index], options.index)}</div>;
    }

    if (isLoading) return <Spin size={100} />
    if (error) return <><h2>Error</h2><p>{error.message}</p></>;
    if (props.virtualScroll === true) {
        const itemCount = data.length;
        const itemSize = Math.floor((props.listHeight / props.itemsToDisplay));
        const listHeight = props.listHeight
        return (props.visible ?? true) && <FixedSizeList
            width="100%"
            onScroll={e => {
                if (e.scrollOffset > (itemCount - 2) * itemSize)
                    props.onScrollToBottom?.();
            }}
            height={listHeight}
            itemCount={itemCount}
            itemSize={itemSize}>
            {renderVirtualRow}
        </FixedSizeList>
    } else
        return (props.visible ?? true) && (
            <div
                style={{
                    maxHeight: props.listHeight ?? "unset",
                    overflow: "auto"
                }}
                className="list-container"
                onScroll={e => {
                    const container = e.currentTarget;
                    if (container.scrollTop > container.scrollHeight - container.clientHeight - 200) props.onScrollToBottom?.();
                }}>
                {data.map(props.render)}
            </div>
        );
}

export default forwardRef(List) as (
    <T>(props: ListProps<T> & { ref?: ForwardedRef<ListRef<T>> }) => ReturnType<typeof List<T>>
);