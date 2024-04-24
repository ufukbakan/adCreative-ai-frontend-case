import { useLayoutEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";

interface ListBaseProps<T> {
    visible?: boolean,
    data: T[] | (() => Promise<T[]>),
    render: ((element: T) => JSX.Element) | ((element: T, index: number) => JSX.Element),
}
interface NonVirutalListProps<T> extends ListBaseProps<T> {
    virtualScroll?: false
}
interface VirutalListProps<T> extends ListBaseProps<T> {
    virtualScroll: true,
    listHeight: number,
    itemsToDisplay: number
}

export type ListProps<T> = NonVirutalListProps<T> | VirutalListProps<T>;

export default function List<T>(props: ListProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const lastFetcher = useRef<() => Promise<T[]>>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const debounceTimer = useRef<NodeJS.Timeout>();
    const debounceDelay = 750;

    useLayoutEffect(() => {
        if (props.data instanceof Array) {
            setData(props.data);
            setIsLoading(false);
        } else {
            const fetcher = props.data;
            clearTimeout(debounceTimer.current);
            if (lastFetcher.current !== fetcher) {
                console.log({
                    last: lastFetcher.current,
                    current: fetcher
                })
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

    function renderRow(options: ListChildComponentProps) {
        return <div style={{ display: "flex", ...options.style }}>{props.render(data[options.index], options.index)}</div>;
    }

    if (isLoading) return <h2>Loading...</h2>;
    if (error) return <h2>Error</h2>;
    if (props.virtualScroll === true) {
        const itemCount = data.length;
        const itemSize = Math.floor((props.listHeight / props.itemsToDisplay));
        const listHeight = props.listHeight;
        return (props.visible ?? true) && <FixedSizeList width="100%" height={listHeight} itemCount={itemCount} itemSize={itemSize}>
            {renderRow}
        </FixedSizeList>
    } else
        return (props.visible ?? true) && data.map(props.render);
}