import { ActionPanel, Action, List, Icon } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useState, useMemo } from "react";
import { SearchResult } from "@components/search-result";
import { AddFromFinderAction } from "@components/add-from-finder-action";
import { SpotlightResults } from "@components/spotlight-results";
import { useZoxide } from "@hooks/use-zoxide";
import { useFzf } from "@hooks/use-fzf";
import { makeFriendly, base64Encode } from "@utils/path-helpers";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [removedKeys, setRemovedKeys] = useCachedState<string[]>("removed-keys", []);

  const [isLoading, data, queryZoxide] = useZoxide(`query -ls`, {
    keepPreviousData: true,
    execute: false,
    failureToastOptions: {title: "Error querying zoxide"}
  });

  // Query zoxide results once on load and reset removed keys
  useMemo(() => {
    setRemovedKeys([]);
    queryZoxide();
  }, []);

  const [fzfLoading, fzfResults] = useFzf(searchText, {
    input: data,
    parseOutput: parseResponse,
    keepPreviousData: true,
    execute: !!data,
    failureToastOptions: {title: "Error querying fzf"}
  });

  const filteredResults = useMemo(() => {
    return fzfResults?.filter((result) => {
      return !removedKeys.includes(result.key);
    });
  }, [fzfResults, removedKeys]);

  return (
    <List
      isLoading={isLoading || fzfLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search frequently used directories..."
    >
      <List.Section title="Results" subtitle={filteredResults?.length.toString()}>
        {filteredResults?.map((searchResult) => (
          <SearchResult key={searchResult.key} searchResult={searchResult} />
        ))}
      </List.Section>
      <List.EmptyView
        title="No results found"
        description="Would you like to search using Spotlight? Directories found and opened using Spotlight will be added to zoxide."
        actions={
          <ActionPanel>
            <Action.Push
              title="Search Using Spotlight"
              icon={Icon.MagnifyingGlass}
              target={<SpotlightResults query={searchText} />}
            />
            <AddFromFinderAction />
          </ActionPanel>
        }
      />
    </List>
  );
}

const parseResponse = (args):SearchResult[] => {
  if(args.stderr.length || args.error ) throw args.error || new Error(args.stderr);
  if(!args.stdout.trim().length) return [];

  return args.stdout.split('\n').map((row: string, idx: number) => {
    let [score, path] = row.trim().match(/^\s*([\d\.]+)\s+(.*)$/)?.slice(1);
    const originalPath = path;
    const key = base64Encode(originalPath);
    path = makeFriendly(path);
    return {key, score, path, originalPath} as SearchResult;
  });
}
