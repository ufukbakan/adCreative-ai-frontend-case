import MultiSelect from '@/components/MultiSelect';
import "ress";
import { rickAndMortyService } from './service/rickAndMortyService';

function App() {

  return (
    <>
      <MultiSelect virtualScroll={true} options={rickAndMortyService.filterByName} label='name' renderOption={
        (option, isSelected) => <div aria-label='option'>{isSelected ? "-" : "+"}{option.name}</div>
      } />
    </>
  )
}

export default App;