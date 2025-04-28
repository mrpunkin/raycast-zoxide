import { List } from "@raycast/api";
import { useState } from "react";
import { SearchResult } from "@components/search-result";
import { useSpotlight } from "@hooks/use-spotlight";
import { makeFriendly, base64Encode } from "@utils/path-helpers";

export const SpotlightResults = ({query}:{query: string}) => {
  const [searchText, setSearchText] = useState(query || "");

  const [isLoading, data] = useSpotlight(searchText, {
    keepPreviousData: true,
    parseOutput: parseResponse,
    failureToastOptions: {title: "Error querying Spotlight"},
    execute: !!searchText.length,
  });

  const filteredData = searchText.length ? data : [];

  return (
    <List
      navigationTitle="Spotlight Results"
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search Spotlight for directories..."
    >
      <List.Section title="Results" subtitle={filteredData?.length.toString()}>
        {filteredData?.map((searchResult) => (
          <SearchResult key={searchResult.key} searchResult={searchResult} />
        ))}
      </List.Section>
    </List>
  );
}

const parseResponse = (args):SearchResult[] => {
  if(args.stderr.length || args.error ) throw args.error || new Error(args.stderr);
  if(!("stdout" in args)) return [];
  if(!!args.timedOut) return [];
  if(!args.stdout.trim().length) return [];

  return args.stdout.split('\n').map((row: string, idx: number) => {
    const originalPath = row.trim();
    const path = makeFriendly(originalPath);
    const key = base64Encode(originalPath);
    return {key, score: "", path, originalPath} as SearchResult;
  });
}

export default SpotlightResults;