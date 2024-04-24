import { isTouchDevice } from "@/utils/navigatorUtils";
import { useCallback, useEffect, useRef } from "react";

interface useClickOutsideOptions {
  callback: (e: Event) => void;
}

export function useClickOutside<T extends Node>(options: useClickOutsideOptions) {
  const ref = useRef<T>(null);
  const eventName = isTouchDevice() ? "touchend" : "click";
  const eventListener = useCallback(
    (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        options.callback(e);
      }
    },
    [ref.current]
  );

  useEffect(() => {
    document.addEventListener(eventName, eventListener);

    () => {
      document.removeEventListener(eventName, eventListener);
    };
  }, [ref.current]);

  return ref;
}
