export interface FilterCharacterResponse {
  characters: Characters;
}

interface Characters {
  results: Result[];
}

interface Result {
  id: string;
  image: string;
  name: string;
  episode: Episode[];
}

interface Episode {
  id: string;
}
