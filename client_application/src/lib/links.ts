import { env } from "@/lib/env";

/** A folder in this repository on GitHub, e.g. "server_application". */
export function repositoryFolderUrl(folder: string): string {
  return `${env.repositoryUrl}/tree/main/${folder}`;
}

/** Where the Server Application's endpoints are defined. */
export const serverRoutesFolder = "server_application/app/api/v1/routes";

/** Where the sandbox endpoints are defined, one folder per sandbox page. */
export const serverSandboxFolder = "server_application/app/sandbox";
