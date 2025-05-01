import { useExec } from "@raycast/utils";
import { makeUnfriendly } from "@utils/path-helpers";

export const useFzf = (filterText: string, options?: {}):[boolean, string | undefined, () => void] => {
  options = {
    shell: true,
    timeout: 500,
    env: {
      PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/opt/homebrew/sbin"
    },
    ...options
  };

  filterText = makeUnfriendly(filterText);
  const { isLoading, data, revalidate } = useExec(`fzf --exact --no-sort --cycle --info=inline --layout=reverse --exit-0 --filter "${filterText}" `, options);
  return [isLoading, data, revalidate];
}
