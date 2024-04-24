import { FixedSizeList, ListChildComponentProps } from "react-window";

interface ListBaseProps<T> {
    data: T[],
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
    function renderRow(options: ListChildComponentProps) {
        return <div style={{ display: "flex", ...options.style }}>{props.render(props.data[options.index], options.index)}</div>;
    }

    function renderList() {
        if (props.virtualScroll === true) {
            const itemCount = props.data.length;
            const itemSize = Math.floor((props.listHeight / props.itemsToDisplay));
            const listHeight = props.listHeight;
            return <FixedSizeList width="100%" height={listHeight} itemCount={itemCount} itemSize={itemSize}>
                {renderRow}
            </FixedSizeList>
        } else
            return props.data.map(props.render);
    }
    return renderList();
}