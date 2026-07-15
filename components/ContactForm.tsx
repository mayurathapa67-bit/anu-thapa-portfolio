"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@/components/icons";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-2xl border border-teal/30 bg-teal/5 p-12 text-center"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-cream">
          <CheckIcon width={28} height={28} />
        </div>
        <h3 className="mt-5 font-playfair text-2xl font-semibold text-charcoal">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm text-charcoal/70">{message}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          value={form.name}
          onChange={(v) => update("name", v)}
          placeholder="Your name"
        />
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(v) => update("email", v)}
          placeholder="you@example.com"
        />
      </div>
      <Field
        label="Subject"
        value={form.subject}
        onChange={(v) => update("subject", v)}
        placeholder="How can I help?"
      />
      <div>
        <label className="mb-2 block text-sm font-medium text-charcoal">
          Message
        </label>
        <textarea
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          rows={6}
          placeholder="Tell me about your documentation needs..."
          className="w-full rounded-xl border border-charcoal/15 bg-white p-4 text-sm text-charcoal outline-none transition-colors focus:border-teal"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{message}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-charcoal px-8 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-teal disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-charcoal">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-charcoal/15 bg-white p-4 text-sm text-charcoal outline-none transition-colors focus:border-teal"
      />
    </div>
  );
}
