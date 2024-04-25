import { FilterCharacterResponse } from "@/dto/FilterCharacterResponse";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql", // Replace with your GraphQL server endpoint
  cache: new InMemoryCache(),
});

const FILTER_BY_NAME_QUERY = gql`
  query ExampleQuery($filter: FilterCharacter) {
    characters(filter: $filter) {
      results {
        id
        image
        name
        episode {
          id
        }
      }
    }
  }
`;

function filterByName(name: string): Promise<FilterCharacterResponse["characters"]["results"]> {
  return client
    .query<FilterCharacterResponse>({
      query: FILTER_BY_NAME_QUERY,
      variables: { filter: { name } },
    })
    .then((res) => res.data.characters.results);
}

export const rickAndMortyService = {
  filterByName,
};
