"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type {
  SiteContent,
  Hero,
  About,
  Service,
  PortfolioItem,
  BlogPost,
  Testimonial,
  Contact,
  ContactSubmission,
  Expertise,
  Experience,
  Certification,
  Tool,
  Social,
} from "@/lib/types";

type Tab = "content" | "submissions" | "settings";
type AboutArrayKey = "expertise" | "experience" | "certifications" | "tools";

const inputCls =
  "w-full rounded-xl border border-charcoal/15 bg-cream px-4 py-2.5 text-sm text-charcoal outline-none transition-colors focus:border-teal";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/* ---------- Shared field components ---------- */

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-charcoal">
        {label}
      </span>
      {children}
      {helper ? (
        <span className="mt-1 block text-xs text-charcoal/50">{helper}</span>
      ) : null}
    </label>
  );
}

function TextInput({
  label,
  value,
  onChange,
  helper,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Field label={label} helper={helper}>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  );
}

function TextArea({
  label,
  value,
  onChange,
  helper,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  helper?: string;
  rows?: number;
}) {
  return (
    <Field label={label} helper={helper}>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} resize-y`}
      />
    </Field>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as {
        success: boolean;
        url?: string;
        message?: string;
      };
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        setError(data.message ?? "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <Field label={label} helper="Paste an image URL or upload a file (max 8MB).">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or /uploads/..."
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-xl bg-teal px-4 py-2.5 text-sm font-medium text-cream transition-opacity disabled:opacity-60"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            Remove photo
          </button>
        ) : null}
        <input
          ref={ref}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="mt-3 h-24 w-24 rounded-lg border border-charcoal/10 object-cover"
        />
      ) : null}
      {error ? (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      ) : null}
    </Field>
  );
}

function TagList({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim();
    if (!t) return;
    onChange([...items, t]);
    setDraft("");
  }
  return (
    <Field label={label}>
      <div className="flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-1 rounded-md bg-teal/10 px-2.5 py-1 text-xs font-medium text-teal"
          >
            {t}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-teal/70 transition-colors hover:text-teal"
              aria-label={`Remove ${t}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a tag and press Enter"
          className={inputCls}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-teal hover:text-teal"
        >
          Add
        </button>
      </div>
    </Field>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 mt-2 font-playfair text-xl font-semibold text-charcoal">
      {children}
    </h3>
  );
}

function ArrayEditor<T>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel,
  emptyHint,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (
    item: T,
    index: number,
    update: (field: keyof T, value: T[keyof T]) => void,
  ) => ReactNode;
  onAdd: () => void;
  addLabel: string;
  emptyHint?: string;
}) {
  function updateItem(index: number, field: keyof T, value: T[keyof T]) {
    onChange(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }
  return (
    <div className="space-y-4">
      {items.length === 0 && emptyHint ? (
        <p className="text-sm text-charcoal/50">{emptyHint}</p>
      ) : null}
      {items.map((item, i) => (
        <div
          key={i}
          className="relative rounded-2xl border border-charcoal/10 bg-white p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/40">
              Item {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              Remove
            </button>
          </div>
          <div className="space-y-4">
            {renderItem(item, i, (f, v) => updateItem(i, f, v))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-teal hover:text-teal"
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* ---------- Empty factories ---------- */

function emptyService(): Service {
  return { title: "", description: "", icon: "edit", price: "From $500", features: [] };
}
function emptyPortfolio(): PortfolioItem {
  return {
    id: newId(),
    title: "",
    category: "API Documentation",
    description: "",
    tech_stack: [],
    content: "",
    client: "",
    published_date: today(),
    read_time: "5 min read",
    featured_image: "",
    download_link: "",
  };
}
function emptyBlog(): BlogPost {
  return {
    id: newId(),
    title: "",
    excerpt: "",
    content: "",
    published_date: today(),
    read_time: "5 min read",
    category: "Best Practices",
    featured_image: "",
  };
}
function emptyExpertise(): Expertise {
  return { title: "", description: "", icon: "edit" };
}
function emptyExperience(): Experience {
  return { company: "", role: "", period: "", description: "" };
}
function emptyCertification(): Certification {
  return { name: "", issuer: "", year: "" };
}
function emptyTool(): Tool {
  return { name: "", category: "", proficiency: 80 };
}
function emptyTestimonial(): Testimonial {
  return { quote: "", name: "", role: "", company: "", avatar: "" };
}
function emptySocial(): Social {
  return { platform: "", url: "" };
}

/* ---------- Main dashboard ---------- */

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("content");
  const [section, setSection] = useState<SectionId>("hero");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      const data = (await res.json()) as SiteContent;
      setContent(data);
    } catch {
      setMessage("Failed to load content.");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function setField<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((c) => (c ? ({ ...c, [key]: value } as SiteContent) : c));
  }

  function setHeroField<F extends keyof Hero>(field: F, value: Hero[F]) {
    setContent((c) =>
      c ? ({ ...c, hero: { ...c.hero, [field]: value } as Hero } as SiteContent) : c,
    );
  }
  function setHeroCta(
    which: "cta_primary" | "cta_secondary",
    field: "label" | "href",
    value: string,
  ) {
    setContent((c) =>
      c
        ? ({
            ...c,
            hero: { ...c.hero, [which]: { ...c.hero[which], [field]: value } } as Hero,
          } as SiteContent)
        : c,
    );
  }

  function setAboutField<F extends keyof About>(field: F, value: About[F]) {
    setContent((c) =>
      c
        ? ({ ...c, about: { ...c.about, [field]: value } as About } as SiteContent)
        : c,
    );
  }
  function setAboutArray<K extends AboutArrayKey>(key: K, items: About[K]) {
    setContent((c) =>
      c
        ? ({ ...c, about: { ...c.about, [key]: items } as About } as SiteContent)
        : c,
    );
  }
  function addAboutItem<K extends AboutArrayKey>(key: K, item: About[K][number]) {
    setContent((c) =>
      c
        ? ({
            ...c,
            about: {
              ...c.about,
              [key]: [...(c.about[key] as unknown as About[K][number][]), item],
            } as About,
          } as SiteContent)
        : c,
    );
  }

  function setContactField<F extends keyof Contact>(field: F, value: Contact[F]) {
    setContent((c) =>
      c
        ? ({
            ...c,
            contact: { ...c.contact, [field]: value } as Contact,
          } as SiteContent)
        : c,
    );
  }
  function setSocialArray(items: Social[]) {
    setContent((c) =>
      c
        ? ({
            ...c,
            contact: { ...c.contact, socials: items } as Contact,
          } as SiteContent)
        : c,
    );
  }

  function addItem<K extends keyof SiteContent>(
    key: K,
    item: SiteContent[K] extends readonly (infer T)[] ? T : never,
  ) {
    setContent((c) => {
      if (!c) return c;
      const list = c[key] as unknown as (
        | string
        | number
        | boolean
        | object
        | null
      )[];
      return {
        ...c,
        [key]: [...list, item],
      } as SiteContent;
    });
  }

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");
    setSaved(false);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = (await res.json()) as { success: boolean; message?: string };
      if (data.success) {
        setSaved(true);
        setMessage("Saved & live.");
        setTimeout(() => setSaved(false), 2500);
      } else {
        setMessage(data.message ?? "Failed to save.");
      }
    } catch {
      setMessage("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    void fetch("/api/auth", { method: "DELETE" }).then(() => router.refresh());
  }

  function renderSection(): ReactNode {
    if (!content) return null;
    switch (section) {
      case "hero":
        return (
          <div className="space-y-5">
            <TextInput label="Title" value={content.hero.title} onChange={(v) => setHeroField("title", v)} />
            <TextInput label="Role" value={content.hero.role} onChange={(v) => setHeroField("role", v)} />
            <TextArea label="Subtitle" value={content.hero.subtitle} onChange={(v) => setHeroField("subtitle", v)} rows={3} />
            <TextArea label="Headline" value={content.hero.headline} onChange={(v) => setHeroField("headline", v)} rows={2} helper="Large hero text, e.g. 'Clarity Through Technical Writing'." />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput label="Primary CTA label" value={content.hero.cta_primary.label} onChange={(v) => setHeroCta("cta_primary", "label", v)} />
              <TextInput label="Primary CTA link" value={content.hero.cta_primary.href} onChange={(v) => setHeroCta("cta_primary", "href", v)} />
              <TextInput label="Secondary CTA label" value={content.hero.cta_secondary.label} onChange={(v) => setHeroCta("cta_secondary", "label", v)} />
              <TextInput label="Secondary CTA link" value={content.hero.cta_secondary.href} onChange={(v) => setHeroCta("cta_secondary", "href", v)} />
            </div>
            <ImageField label="Hero image" value={content.hero.image} onChange={(v) => setHeroField("image", v)} />
          </div>
        );
      case "about":
        return (
          <div className="space-y-5">
            <TextArea label="Headline" value={content.about.headline} onChange={(v) => setAboutField("headline", v)} rows={2} />
            <TextArea label="Bio" value={content.about.bio} onChange={(v) => setAboutField("bio", v)} rows={5} />
            <TextArea label="Philosophy" value={content.about.philosophy} onChange={(v) => setAboutField("philosophy", v)} rows={4} />
            <ImageField label="About image" value={content.about.image} onChange={(v) => setAboutField("image", v)} />
            <SectionTitle>Expertise</SectionTitle>
            <ArrayEditor
              items={content.about.expertise}
              onChange={(items) => setAboutArray("expertise", items)}
              onAdd={() => addAboutItem("expertise", emptyExpertise())}
              addLabel="Add expertise"
              renderItem={(item, _i, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="Title" value={item.title} onChange={(v) => update("title", v)} />
                    <TextInput label="Icon" value={item.icon} onChange={(v) => update("icon", v)} helper="api | software | manual | sdk | edit | strategy | audit" />
                  </div>
                  <TextArea label="Description" value={item.description} onChange={(v) => update("description", v)} rows={3} />
                </>
              )}
            />
            <SectionTitle>Experience</SectionTitle>
            <ArrayEditor
              items={content.about.experience}
              onChange={(items) => setAboutArray("experience", items)}
              onAdd={() => addAboutItem("experience", emptyExperience())}
              addLabel="Add experience"
              renderItem={(item, _i, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="Company" value={item.company} onChange={(v) => update("company", v)} />
                    <TextInput label="Role" value={item.role} onChange={(v) => update("role", v)} />
                  </div>
                  <TextInput label="Period" value={item.period} onChange={(v) => update("period", v)} helper="e.g. 2023 - Present" />
                  <TextArea label="Description" value={item.description} onChange={(v) => update("description", v)} rows={3} />
                </>
              )}
            />
            <SectionTitle>Certifications</SectionTitle>
            <ArrayEditor
              items={content.about.certifications}
              onChange={(items) => setAboutArray("certifications", items)}
              onAdd={() => addAboutItem("certifications", emptyCertification())}
              addLabel="Add certification"
              renderItem={(item, _i, update) => (
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextInput label="Name" value={item.name} onChange={(v) => update("name", v)} />
                  <TextInput label="Issuer" value={item.issuer} onChange={(v) => update("issuer", v)} />
                  <TextInput label="Year" value={item.year} onChange={(v) => update("year", v)} />
                </div>
              )}
            />
            <SectionTitle>Tools</SectionTitle>
            <ArrayEditor
              items={content.about.tools}
              onChange={(items) => setAboutArray("tools", items)}
              onAdd={() => addAboutItem("tools", emptyTool())}
              addLabel="Add tool"
              renderItem={(item, _i, update) => (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextInput label="Name" value={item.name} onChange={(v) => update("name", v)} />
                    <TextInput label="Category" value={item.category} onChange={(v) => update("category", v)} />
                  </div>
                  <TextInput label="Proficiency %" type="number" value={String(item.proficiency)} onChange={(v) => update("proficiency", Number(v) || 0)} />
                </>
              )}
            />
          </div>
        );
      case "services":
        return (
          <ArrayEditor
            items={content.services}
            onChange={(items) => setField("services", items)}
            onAdd={() => addItem("services", emptyService())}
            addLabel="Add service"
            emptyHint="No services yet."
            renderItem={(item, _i, update) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Title" value={item.title} onChange={(v) => update("title", v)} />
                  <TextInput label="Icon" value={item.icon} onChange={(v) => update("icon", v)} helper="api | software | manual | sdk | edit | strategy | audit" />
                </div>
                <TextArea label="Description" value={item.description} onChange={(v) => update("description", v)} rows={3} />
                <TextInput label="Price" value={item.price} onChange={(v) => update("price", v)} helper="e.g. From $1,200" />
                <TagList label="Features" items={item.features} onChange={(v) => update("features", v)} />
              </>
            )}
          />
        );
      case "portfolio":
        return (
          <ArrayEditor
            items={content.portfolio}
            onChange={(items) => setField("portfolio", items)}
            onAdd={() => addItem("portfolio", emptyPortfolio())}
            addLabel="Add sample"
            emptyHint="No writing samples yet."
            renderItem={(item, _i, update) => (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Title" value={item.title} onChange={(v) => update("title", v)} />
                  <TextInput label="Category" value={item.category} onChange={(v) => update("category", v)} helper="API Documentation | User Manuals | SDK Guides | Release Notes | Knowledge Base Articles" />
                </div>
                <TextArea label="Description" value={item.description} onChange={(v) => update("description", v)} rows={3} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Client" value={item.client} onChange={(v) => update("client", v)} />
                  <TextInput label="Published date" value={item.published_date} onChange={(v) => update("published_date", v)} helper="YYYY-MM-DD" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Read time" value={item.read_time} onChange={(v) => update("read_time", v)} helper="e.g. 6 min read" />
                  <TextInput label="Download link" value={item.download_link} onChange={(v) => update("download_link", v)} placeholder="https://… or leave blank" />
                </div>
                <TextArea label="Content excerpt" value={item.content} onChange={(v) => update("content", v)} rows={3} />
                <ImageField label="Featured image" value={item.featured_image} onChange={(v) => update("featured_image", v)} />
                <TagList label="Tech stack" items={item.tech_stack} onChange={(v) => update("tech_stack", v)} />
              </>
            )}
          />
        );
      case "blog":
        return (
          <ArrayEditor
            items={content.blog}
            onChange={(items) => setField("blog", items)}
            onAdd={() => addItem("blog", emptyBlog())}
            addLabel="Add article"
            emptyHint="No articles yet."
            renderItem={(item, _i, update) => (
              <>
                <TextInput label="Title" value={item.title} onChange={(v) => update("title", v)} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextInput label="Category" value={item.category} onChange={(v) => update("category", v)} />
                  <TextInput label="Published date" value={item.published_date} onChange={(v) => update("published_date", v)} helper="YYYY-MM-DD" />
                  <TextInput label="Read time" value={item.read_time} onChange={(v) => update("read_time", v)} />
                </div>
                <TextArea label="Excerpt" value={item.excerpt} onChange={(v) => update("excerpt", v)} rows={2} />
                <TextArea label="Content" value={item.content} onChange={(v) => update("content", v)} rows={10} helper="Use '## ' for headings and '- ' for bullet lists." />
                <ImageField label="Featured image" value={item.featured_image} onChange={(v) => update("featured_image", v)} />
              </>
            )}
          />
        );
      case "testimonials":
        return (
          <ArrayEditor
            items={content.testimonials}
            onChange={(items) => setField("testimonials", items)}
            onAdd={() => addItem("testimonials", emptyTestimonial())}
            addLabel="Add testimonial"
            emptyHint="No testimonials yet."
            renderItem={(item, _i, update) => (
              <>
                <TextArea label="Quote" value={item.quote} onChange={(v) => update("quote", v)} rows={3} />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextInput label="Name" value={item.name} onChange={(v) => update("name", v)} />
                  <TextInput label="Role" value={item.role} onChange={(v) => update("role", v)} />
                  <TextInput label="Company" value={item.company} onChange={(v) => update("company", v)} />
                </div>
                <ImageField label="Avatar" value={item.avatar} onChange={(v) => update("avatar", v)} />
              </>
            )}
          />
        );
      case "contact":
        return (
          <div className="space-y-5">
            <TextInput label="Email" value={content.contact.email} onChange={(v) => setContactField("email", v)} />
            <TextInput label="Phone" value={content.contact.phone} onChange={(v) => setContactField("phone", v)} />
            <TextArea label="Location" value={content.contact.location} onChange={(v) => setContactField("location", v)} rows={2} />
            <SectionTitle>Social links</SectionTitle>
            <ArrayEditor
              items={content.contact.socials}
              onChange={(items) => setSocialArray(items)}
              onAdd={() => setSocialArray([...content.contact.socials, emptySocial()])}
              addLabel="Add social"
              emptyHint="No social links yet."
              renderItem={(item, _i, update) => (
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextInput label="Platform" value={item.platform} onChange={(v) => update("platform", v)} />
                  <TextInput label="URL" value={item.url} onChange={(v) => update("url", v)} />
                </div>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
              Admin
            </p>
            <h1 className="font-playfair text-xl font-semibold text-charcoal">
              Content Studio
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {saved && <span className="text-sm font-medium text-teal">Saved ✓</span>}
            {message && !saved && (
              <span className="text-sm text-red-600">{message}</span>
            )}
            {tab === "content" && (
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving || !content}
                className="rounded-full bg-charcoal px-6 py-2 text-sm font-medium text-cream transition-colors hover:bg-teal disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            )}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal transition-colors hover:border-teal hover:text-teal"
            >
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-charcoal/15 px-4 py-2 text-sm text-charcoal transition-colors hover:border-teal hover:text-teal"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 flex gap-2 border-b border-charcoal/10">
          {(
            [
              { id: "content", label: "Content" },
              { id: "submissions", label: "Submissions" },
              { id: "settings", label: "Settings" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-teal text-teal"
                  : "border-transparent text-charcoal/60 hover:text-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "content" && (
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-56 lg:shrink-0">
              <nav className="flex gap-2 overflow-x-auto lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:overflow-visible">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSection(s.id)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                      section === s.id
                        ? "bg-charcoal text-cream"
                        : "text-charcoal/70 hover:bg-charcoal/5"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </aside>
            <div className="min-w-0 flex-1">
              <div className="rounded-3xl border border-charcoal/10 bg-white/60 p-6 lg:p-8">
                {content ? (
                  renderSection()
                ) : (
                  <p className="text-sm text-charcoal/50">Loading content…</p>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "submissions" && <SubmissionsTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

/* ---------- Submissions ---------- */

function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);
  const liveRef = useRef(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" });
      const data = (await res.json()) as {
        success: boolean;
        submissions?: ContactSubmission[];
      };
      if (data.success && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch {
      // ignore during auto-refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    liveRef.current = live;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSubmissions();
    const interval = setInterval(() => {
      if (liveRef.current) {
        void fetchSubmissions();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [fetchSubmissions, live]);

  async function remove(id: string) {
    try {
      await fetch(`/api/submissions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
            live ? "bg-teal/10 text-teal" : "bg-charcoal/10 text-charcoal/60"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              live ? "animate-pulse bg-teal" : "bg-charcoal/40"
            }`}
          />
          {live ? "Live" : "Paused"}
        </span>
        <button
          type="button"
          onClick={() => setLive((v) => !v)}
          className="text-sm font-medium text-charcoal/70 transition-colors hover:text-teal"
        >
          {live ? "Pause auto-refresh" : "Resume auto-refresh"}
        </button>
        <span className="text-sm text-charcoal/50">
          {submissions.length} submission{submissions.length === 1 ? "" : "s"}
        </span>
      </div>

      {loading && submissions.length === 0 ? (
        <p className="text-sm text-charcoal/50">Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-white p-10 text-center text-sm text-charcoal/50">
          No contact submissions yet.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-charcoal/10 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-charcoal">{s.name}</p>
                  <p className="text-sm text-charcoal/60">
                    {s.email}
                    {s.subject ? ` · ${s.subject}` : ""}
                  </p>
                  <p className="text-xs text-charcoal/40">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(s.id)}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-charcoal/80">
                {s.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Settings ---------- */

interface AdminStatus {
  github: boolean;
  cloudinary: boolean;
}

function SettingsTab() {
  const [status, setStatus] = useState<AdminStatus>({
    github: false,
    cloudinary: false,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/admin/status", { cache: "no-store" });
        const data = (await res.json()) as AdminStatus;
        setStatus(data);
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const rows = [
    {
      label: "GitHub integration",
      value: status.github,
      hint: "Set GITHUB_TOKEN & GITHUB_REPO to save content to the repo.",
    },
    {
      label: "Cloudinary uploads",
      value: status.cloudinary,
      hint: "Set CLOUDINARY_* env vars for cloud image hosting. Without it, uploads save locally to /public/uploads.",
    },
  ];

  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-charcoal/10 bg-white p-5"
        >
          <div>
            <p className="font-medium text-charcoal">{r.label}</p>
            <p className="mt-1 text-xs text-charcoal/60">{r.hint}</p>
          </div>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              loaded && r.value
                ? "bg-teal/10 text-teal"
                : "bg-charcoal/10 text-charcoal/50"
            }`}
          >
            {loaded ? (r.value ? "Connected" : "Not configured") : "Checking…"}
          </span>
        </div>
      ))}
      <p className="text-xs text-charcoal/50">
        Content saves write to GitHub when configured; otherwise they persist to
        the local content file. Image uploads use Cloudinary when configured,
        otherwise they are stored in /public/uploads. Submissions auto-refresh
        every 8 seconds.
      </p>
    </div>
  );
}
