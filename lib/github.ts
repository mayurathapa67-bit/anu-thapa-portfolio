const GITHUB_API = "https://api.github.com";

export interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
}

export interface GitHubFile {
  content: string;
  sha: string;
}

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  if (!token || !repo) {
    return null;
  }
  return { token, repo, branch };
}

export function isLocalhost(): boolean {
  const vercelUrl = process.env.VERCEL_URL ?? "";
  const nodeEnv = process.env.NODE_ENV ?? "production";
  return nodeEnv === "development" || vercelUrl.includes("localhost");
}

async function githubFetch(
  path: string,
  init: RequestInit,
  config: GitHubConfig,
): Promise<Response> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(init.headers as Record<string, string>),
  };
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    next: { revalidate: 0 },
  });
}

export async function getGitHubFile(
  filePath: string,
  config: GitHubConfig,
): Promise<GitHubFile | null> {
  try {
    const url = `${GITHUB_API}/repos/${config.repo}/contents/${filePath}?ref=${config.branch}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as {
      content?: string;
      sha?: string;
    };
    if (!data.content || !data.sha) {
      return null;
    }
    return {
      content: Buffer.from(data.content, "base64").toString("utf-8"),
      sha: data.sha,
    };
  } catch (error) {
    console.error(`Failed to read GitHub file ${filePath}:`, error);
    return null;
  }
}

export async function putGitHubFile(
  filePath: string,
  content: string,
  sha: string | null,
  message: string,
  config: GitHubConfig,
): Promise<boolean> {
  try {
    const body: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch: config.branch,
    };
    if (sha) {
      body.sha = sha;
    }
    const res = await githubFetch(
      `/repos/${config.repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      config,
    );
    return res.ok;
  } catch (error) {
    console.error(`Failed to write GitHub file ${filePath}:`, error);
    return false;
  }
}
