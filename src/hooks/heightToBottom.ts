import { RefObject } from "react";

export function useHeightToBottomScreen(ref: RefObject<HTMLElement>){
    const windowHeight = window.innerHeight;
    return windowHeight - (ref.current?.getBoundingClientRect().bottom ?? 0);
}