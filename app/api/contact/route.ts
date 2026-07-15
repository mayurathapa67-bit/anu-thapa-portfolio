import { NextRequest } from "next/server";
import { saveSubmission } from "@/lib/content";
import type { ContactSubmission } from "@/lib/types";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim();
    const subject = (body.subject ?? "").trim();
    const message = (body.message ?? "").trim();

    if (!name || !email || !message) {
      return Response.json(
        { success: false, message: "Name, email and message are required." },
        { status: 400, headers: NO_STORE },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400, headers: NO_STORE },
      );
    }

    const submission: ContactSubmission = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `sub_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    const ok = await saveSubmission(submission);
    if (!ok) {
      return Response.json(
        {
          success: false,
          message: "Could not save your message. Please try again.",
        },
        { status: 500, headers: NO_STORE },
      );
    }

    return Response.json(
      { success: true, message: "Thank you. Your message has been received." },
      { status: 200, headers: NO_STORE },
    );
  } catch (error) {
    console.error("Contact submission error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500, headers: NO_STORE },
    );
  }
}
