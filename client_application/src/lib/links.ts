import { env } from "@/lib/env";

/** A path inside Playground's folder in the repository. */
function repositoryPath(path: string): string {
  return env.repositoryFolder ? `${env.repositoryFolder}/${path}` : path;
}

/** A folder in this repository on GitHub, e.g. "server_application". */
export function repositoryFolderUrl(folder: string): string {
  return `${env.repositoryUrl}/tree/main/${repositoryPath(folder)}`;
}

/** A section of a file in this repository on GitHub, e.g. a README heading. */
export function repositorySectionUrl(file: string, section: string): string {
  return `${env.repositoryUrl}/blob/main/${repositoryPath(file)}#${section}`;
}

/** The full address of an API path on the current environment, e.g. apiUrl("/sandbox/headcount"). */
export function apiUrl(path: string): string {
  return `${env.apiBaseUrl}${path}`;
}

/** Where the Server Application's endpoints are defined. */
export const serverRoutesFolder = "server_application/app/api/v1/routes";

/** Where the sandbox endpoints are defined, one folder per sandbox page. */
export const serverSandboxFolder = "server_application/app/sandbox";
