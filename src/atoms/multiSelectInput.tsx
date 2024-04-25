import { atom } from "recoil";
export const inputAtom = atom<string>({
    default: "",
    key: "multiSelectInput"
});