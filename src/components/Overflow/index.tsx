import { ReactElement, memo, useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import Tappable from "../Tappable";
import styles from "./styles.module.scss";
import { classNames } from "@/utils/style";

interface OverflowProps {
    maxWidth: number;
    children: ReactElement[];
    gap: number
}

export default function Overflow({ children, maxWidth, gap }: OverflowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleChildren, setVisibleChildren] = useState<ReactElement[]>([]);
    const [overflowedChildren, setOverflowedChildren] = useState<ReactElement[]>([]);
    const [showOverflows, setShowOverflows] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const actualMaxWidth = maxWidth - (6 * gap) - (Math.log10(children.length || 1) * 20);

    async function mesaureChilds() {
        let accumulatedWidth = 0;
        const newVisibleChildren: ReactElement[] = [];
        const newOverflowedChildren: ReactElement[] = [];
        for (const child of children) {
            const childWidth = await getChildWidth(child);
            if (accumulatedWidth + childWidth <= actualMaxWidth) {
                newVisibleChildren.push(child);
                accumulatedWidth += childWidth;
            } else {
                newOverflowedChildren.push(child);
            }
        }
        const newIsOverflowing = newVisibleChildren.length !== children.length;
        setIsOverflowing(newIsOverflowing);
        if (!newIsOverflowing)
            setShowOverflows(false);
        setOverflowedChildren(newOverflowedChildren);
        setVisibleChildren(newVisibleChildren);
    }

    useEffect(() => {
        mesaureChilds();
    }, [children, maxWidth]);

    const getChildWidth = (child: ReactElement): Promise<number> => {
        return new Promise(
            (resolve, reject) => {
                try {
                    const tempDiv = document.createElement("div");
                    tempDiv.style.display = "inline-block";
                    tempDiv.style.opacity = "0";
                    document.body.appendChild(tempDiv);
                    render(child, tempDiv, () => {
                        const width = tempDiv.offsetWidth;
                        resolve(width);
                        document.body.removeChild(tempDiv);
                    });
                } catch (e) {
                    reject(e);
                }
            }
        )
    };

    function OverflowContainer() {
        return (
            <>
                <Tappable
                    aria-label="overflow"
                    onTap={() => setShowOverflows(p => !p)}>
                    <div className={styles['overflow-button']}>+{overflowedChildren.length}</div>
                </Tappable>
                <div className={classNames({
                    [styles['overflow-container']]: true,
                    [styles.show]: showOverflows
                })}>{overflowedChildren}</div>
            </>
        )
    }
    const MemoizedOverflowContainer = memo(OverflowContainer);

    return (
        <div ref={containerRef} style={{ maxWidth, display: "flex", flexShrink: "0", gap, position: "relative" }}>
            {visibleChildren}
            {isOverflowing && <MemoizedOverflowContainer />}
        </div>
    );
}