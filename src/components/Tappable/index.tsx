import { isTouchDevice as getIsTouchDevice } from '@/utils/navigatorUtils';
import { experimental_options } from "million/experimental";
import { HTMLAttributes, MouseEvent, PropsWithChildren, TouchEvent, UIEvent, useState } from 'react';
import styles from "./styles.module.scss";
experimental_options.noSlot = true;

interface TappableProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
    onTap: (e: UIEvent) => void,
    className?: string
}

export default function Tappable(props: TappableProps) {
    const [isDragged, setIsDragged] = useState(false);
    const isTouchDevice = getIsTouchDevice();

    const handleTouchStart = () => isTouchDevice && setIsDragged(false);
    const handleTouchMove = () => isTouchDevice && setIsDragged(true);
    const handleTouchEnd = (event: TouchEvent) => {
        if (isTouchDevice) {
            if (!isDragged) {
                props.onTap(event);
            }
            setIsDragged(true);
        }
    };
    const handleClick = (event: MouseEvent) => !isTouchDevice && props.onTap(event);

    const propsToInherit: HTMLAttributes<HTMLButtonElement> = {
        ...(Object.fromEntries(Object.entries(props).filter(([key,]) => key !== "onTap"))),
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onClick: handleClick,
        tabIndex: 0,
        className: [styles.tappable, props.className].filter(x => x).join(" "),
        style: {
            opacity: isDragged ? 0.8 : 1,
            ...props.style
        }
    };
    return (
        <button
            {...propsToInherit}
        >
            {props.children}
        </button>
    );
}