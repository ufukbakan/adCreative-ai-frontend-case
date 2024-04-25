import MultiSelect from '@/components/MultiSelect';
import "ress";
import RickMortyOption from './components/RickMortyOption';
import { rickAndMortyService } from './service/rickAndMortyService';

function App() {

  return (
    <>
      <MultiSelect virtualScroll={true} options={rickAndMortyService.filterByName} chipLabel='name' renderOption={
        (option, isSelected) => <RickMortyOption data={option} isSelected={isSelected} />
      } />
    </>
  )
}

export default App;