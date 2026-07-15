import fs from "fs";
import path from "path";
import type { SiteContent, ContactSubmission } from "./types";
import {
  getGitHubConfig,
  getGitHubFile,
  putGitHubFile,
  isLocalhost,
} from "./github";

const CONTENT_PATH = path.join(process.cwd(), "content", "content.json");
const SUBMISSIONS_PATH = path.join(
  process.cwd(),
  "content",
  "submissions.json",
);

const EMPTY_CONTENT: SiteContent = {
  nav: { logo: "Anu Thapa", links: [] },
  hero: {
    title: "Anu Thapa",
    role: "Technical Writer",
    subtitle: "",
    headline: "",
    cta_primary: { label: "View Documentation", href: "/portfolio" },
    cta_secondary: { label: "Hire Me", href: "/contact" },
    image: "",
  },
  about: {
    headline: "",
    bio: "",
    philosophy: "",
    expertise: [],
    experience: [],
    certifications: [],
    tools: [],
    image: "",
  },
  services: [],
  portfolio: [],
  blog: [],
  testimonials: [],
  contact: { email: "", phone: "", location: "", socials: [] },
};

function readLocalContent(): SiteContent {
  try {
    const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
    const parsed = JSON.parse(raw) as SiteContent;
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.portfolio)) {
      return parsed;
    }
    return EMPTY_CONTENT;
  } catch (error) {
    console.error("Failed to read local content.json:", error);
    return EMPTY_CONTENT;
  }
}

export async function getContent(): Promise<SiteContent> {
  const config = getGitHubConfig();
  if (config && !isLocalhost()) {
    const file = await getGitHubFile("content/content.json", config);
    if (file) {
      try {
        const parsed = JSON.parse(file.content) as SiteContent;
        if (parsed && Array.isArray(parsed.portfolio)) {
          return parsed;
        }
      } catch (error) {
        console.error("Failed to parse GitHub content:", error);
      }
    }
  }
  return readLocalContent();
}

export async function saveContent(content: SiteContent): Promise<boolean> {
  const config = getGitHubConfig();
  if (config && !isLocalhost()) {
    const file = await getGitHubFile("content/content.json", config);
    const sha = file ? file.sha : null;
    const ok = await putGitHubFile(
      "content/content.json",
      JSON.stringify(content, null, 2),
      sha,
      "Update content via admin panel",
      config,
    );
    return ok;
  }
  try {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to write local content.json:", error);
    return false;
  }
}

function readLocalSubmissions(): ContactSubmission[] {
  try {
    if (!fs.existsSync(SUBMISSIONS_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(SUBMISSIONS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ContactSubmission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to read local submissions.json:", error);
    return [];
  }
}

function writeLocalSubmissions(submissions: ContactSubmission[]): void {
  try {
    fs.writeFileSync(
      SUBMISSIONS_PATH,
      JSON.stringify(submissions, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to write local submissions.json:", error);
  }
}

export async function getSubmissions(): Promise<ContactSubmission[]> {
  const config = getGitHubConfig();
  if (config && !isLocalhost()) {
    const file = await getGitHubFile("content/submissions.json", config);
    if (file) {
      try {
        const parsed = JSON.parse(file.content) as ContactSubmission[];
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error("Failed to parse GitHub submissions:", error);
        return [];
      }
    }
    return [];
  }
  return readLocalSubmissions();
}

export async function saveSubmission(
  submission: ContactSubmission,
): Promise<boolean> {
  const config = getGitHubConfig();
  if (config && !isLocalhost()) {
    const file = await getGitHubFile("content/submissions.json", config);
    const existing: ContactSubmission[] = file
      ? safeParseArray(file.content)
      : [];
    const next = [submission, ...existing];
    const ok = await putGitHubFile(
      "content/submissions.json",
      JSON.stringify(next, null, 2),
      file ? file.sha : null,
      "Add contact submission",
      config,
    );
    return ok;
  }
  const existing = readLocalSubmissions();
  writeLocalSubmissions([submission, ...existing]);
  return true;
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const config = getGitHubConfig();
  if (config && !isLocalhost()) {
    const file = await getGitHubFile("content/submissions.json", config);
    const existing: ContactSubmission[] = file
      ? safeParseArray(file.content)
      : [];
    const next = existing.filter((s) => s.id !== id);
    const ok = await putGitHubFile(
      "content/submissions.json",
      JSON.stringify(next, null, 2),
      file ? file.sha : null,
      "Delete contact submission",
      config,
    );
    return ok;
  }
  const existing = readLocalSubmissions();
  writeLocalSubmissions(existing.filter((s) => s.id !== id));
  return true;
}

function safeParseArray(raw: string): ContactSubmission[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
