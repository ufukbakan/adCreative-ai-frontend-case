import MultiSelect from '@/components/MultiSelect';
import "ress";

const options = [
  { label: "rick", value: 1 },
  { label: "morty", value: 2 },
  { label: "cool", value: 3 },
  { label: "pickle", value: 4 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
  { label: "rihanna", value: 5 },
];

const renderOption = (o: typeof options[0]) => <div aria-label='option'>{o.label}</div>

function App() {

  return (
    <>
      <MultiSelect options={options} renderOption={renderOption} />
    </>
  )
}

export default App;