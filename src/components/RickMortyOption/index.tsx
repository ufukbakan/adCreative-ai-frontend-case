import { Result } from "@/dto/FilterCharacterResponse"
import styles from "./styles.module.scss";
import { useRecoilValue } from "recoil";
import { inputAtom } from "@/atoms/multiSelectInput";
import HighlightSubText from "../HighlightSubText";

export type RickMortyOptionProps = {
    data: Result,
    isSelected: boolean,
    index: number
}

export default function RickMortyOption(props: RickMortyOptionProps) {
    const input = useRecoilValue(inputAtom);
    const option = props.data;
    return (
        <div aria-label="option" className={styles['option-container']}>
            <input type="checkbox" checked={props.isSelected} tabIndex={-1} />
            <img src={option.image} />
            <div className={styles['text-container']}>
                <h6><HighlightSubText text={option.name} highlight={input} /></h6>
                <p>{option.episode.length} Episodes</p>
            </div>
        </div >
    )

}