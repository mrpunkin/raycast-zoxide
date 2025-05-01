import { useExec } from "@raycast/utils";

export const useZoxide = (command: string, options?: {}):[boolean, string | undefined, () => void] => {
  options = {
    shell: true,
    timeout: 500,
    env: {
      PATH: "/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin:/opt/homebrew/sbin"
    },
    ...options
  };
  const { isLoading, data, revalidate } = useExec(`zoxide ${command}`, options);
  return [isLoading, data, revalidate];
}
