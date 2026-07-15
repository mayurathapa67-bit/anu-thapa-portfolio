import { NextRequest } from "next/server";
import { getContent, saveContent } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";
import type { SiteContent } from "@/lib/types";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const content = await getContent();
  return Response.json(content, { status: 200, headers: NO_STORE });
}

export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }
  try {
    const body = (await request.json()) as SiteContent;
    if (!body || typeof body !== "object" || !Array.isArray(body.portfolio)) {
      return Response.json(
        { success: false, message: "Invalid content payload" },
        { status: 400, headers: NO_STORE },
      );
    }
    const ok = await saveContent(body);
    if (!ok) {
      return Response.json(
        { success: false, message: "Failed to save content" },
        { status: 500, headers: NO_STORE },
      );
    }
    return Response.json(
      { success: true },
      { status: 200, headers: NO_STORE },
    );
  } catch (error) {
    console.error("Content save error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500, headers: NO_STORE },
    );
  }
}
