import { ActionPanel, Action, List, open, Icon, showToast, Toast, launchCommand, LaunchType} from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { useZoxide } from "@hooks/use-zoxide";
import { basename, dirname } from "path";

export const SearchResult = ({ searchResult }: { searchResult: SearchResult }) => {
  const [removedKeys, setRemovedKeys] = useCachedState<string[]>("removed-keys", []);

  const [addQueryLoading, addQueryResponse, addQuery] = useZoxide(`add "${searchResult.originalPath}"`, {
    keepPreviousData: false,
    execute: false
  });

  const [removeQueryLoading, removeQueryResponse, removeQuery] = useZoxide(`remove "${searchResult.originalPath}"`, {
    keepPreviousData: false,
    execute: false
  });

  const folder = basename(searchResult.path);
  const parent = dirname(searchResult.path) == "." ? "/" : dirname(searchResult.path);

  const openResult = () => {
    addQuery();
    setRemovedKeys((prev) => prev.filter((key) => key !== searchResult.key));
    open(searchResult.originalPath);
  };

  const removeResult = async () => {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Removing result from zoxide..."
    });
    removeQuery();
    setRemovedKeys((prev) => prev.concat([searchResult.key]));
    toast.style = Toast.Style.Success;
    toast.title = "Successfully removed from zoxide";
  };

  return (
    <List.Item
      title={folder}
      subtitle={parent}
      icon={{ fileIcon: searchResult.originalPath || searchResult.path }}
      accessories={[{tag: {value: searchResult.score || "0.0"}}]}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action
              title="Open Folder"
              onAction={openResult}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action.CopyToClipboard
              title="Copy Path"
              icon={Icon.Clipboard}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
              content={searchResult.path}
            />
            <Action
              title="Add Current Finder Directory"
              icon={Icon.Folder}
              shortcut={{ modifiers: ["ctrl"], key: "f" }}
              onAction={() => launchCommand({name: "add-from-finder", type: LaunchType.UserInitiated})}
            />
            {searchResult.score && (
              <Action
                title="Remove Result"
                icon={Icon.Trash}
                shortcut={{ modifiers: ["ctrl"], key: "x" }}
                style={Action.Style.Destructive}
                onAction={removeResult}
              />
            )}
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}

export interface SearchResult {
  key: string;
  path: string;
  originalPath: string;
  score?: string;
}

export default SearchResult;