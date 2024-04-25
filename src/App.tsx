import MultiSelect from '@/components/MultiSelect';
import "ress";
import RickMortyOption from './components/RickMortyOption';
import { rickAndMortyService } from './service/rickAndMortyService';

function App() {

  return (
    <>
      <div style={{
        padding: "50px"
      }}>
        <MultiSelect virtualScroll={true} options={rickAndMortyService.filterByName} chipLabel='name' renderOption={
          ({ option, isSelected, index }) => <RickMortyOption data={option} isSelected={isSelected} index={index} />
        } />
      </div>
    </>
  )
}

export default App;