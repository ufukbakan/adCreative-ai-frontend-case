import { RefObject, useEffect, useState } from "react";

export function useHeightToBottomScreen(ref: RefObject<HTMLElement>){
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    const resizeListener = () => {
        setWindowHeight(window.innerHeight);
    }
    useEffect(() => {
        window.addEventListener("resize", resizeListener)
        return () => window.removeEventListener("resize", resizeListener);
    }, []);
    return windowHeight - (ref.current?.getBoundingClientRect().bottom ?? 0);
}