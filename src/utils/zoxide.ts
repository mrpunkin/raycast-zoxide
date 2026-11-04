import { execFileSync } from "child_process";
import { pathFor } from "@utils/path-helpers";

// Synchronous so it completes inside Action.Open's onOpen, before opening the
// target tears the command down. execFile passes the path as an argument (no shell).
export const addToZoxide = (folder: string) => {
  execFileSync("zoxide", ["add", folder], { env: { PATH: pathFor("zoxide") } });
};
