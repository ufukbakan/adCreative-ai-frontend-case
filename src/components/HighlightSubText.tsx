export default function HighlightSubText(props: { text?: string, highlight?: string }){
    const text = props.text ?? "";
    const highlight = props.highlight ?? text;
    const indexOfSubText = text.toLowerCase().indexOf(highlight.toLowerCase());
    return indexOfSubText === -1 ? text : <>
    {text.slice(0, indexOfSubText)}<b>{text.slice(indexOfSubText, indexOfSubText+highlight.length)}</b>{text.slice(indexOfSubText+highlight.length)}
    </>
}