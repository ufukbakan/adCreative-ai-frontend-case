import { ReactElement, useEffect, useRef, useState } from "react";
import { render } from "react-dom";

interface OverflowProps {
    maxWidth: number;
    children: ReactElement[];
    gap: number
}

export default function Overflow({ children, maxWidth, gap }: OverflowProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleChildren, setVisibleChildren] = useState<ReactElement[]>([]);
    const [overflowedChildren, setOverflowedChildren] = useState<ReactElement[]>([]);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

    async function mesaureChilds() {
        const actualMaxWidth = maxWidth - (gap * (children.length - 1));
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
        setIsOverflowing(newVisibleChildren.length !== children.length);
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

    const handleShowMore = () => {
        setIsOverflowing(false);
        setVisibleChildren(Array.from(children));
    };

    return (
        <div ref={containerRef} style={{ maxWidth, overflow: "hidden", display: "flex", flexShrink: "0", gap }}>
            {visibleChildren}
            {isOverflowing && (
                <div onClick={handleShowMore} style={{ marginTop: "5px" }}>
                    +
                </div>
            )}
        </div>
    );
}