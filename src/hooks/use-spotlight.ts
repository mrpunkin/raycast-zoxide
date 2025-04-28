import { useExec } from "@raycast/utils";
import { makeUnfriendly } from "@utils/path-helpers";

export const useSpotlight = (query: string, options?: {}):[boolean, string | undefined, () => void] => {
  options = {
    shell: true,
    env: {
      PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/opt/homebrew/sbin"
    },
    ...options
  };
  const filters = [
    `kMDItemContentType=='public.folder'`,
    `kMDItemDisplayName=='*${query}*'cd`,
    `kMDItemUseCount > 0`,
  ];
  query = makeUnfriendly(query);
  const { isLoading, data, revalidate } = useExec(`mdfind "${filters.join(' && ')}"`, options);
  return [isLoading, data, revalidate];
}