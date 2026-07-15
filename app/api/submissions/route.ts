import { NextRequest } from "next/server";
import { getSubmissions, deleteSubmission } from "@/lib/content";
import { isAuthenticated } from "@/lib/auth";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }
  const submissions = await getSubmissions();
  return Response.json(
    { success: true, submissions },
    { status: 200, headers: NO_STORE },
  );
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }
  try {
    const id = request.nextUrl.searchParams.get("id") ?? "";
    if (!id) {
      return Response.json(
        { success: false, message: "Missing id" },
        { status: 400, headers: NO_STORE },
      );
    }
    const ok = await deleteSubmission(id);
    if (!ok) {
      return Response.json(
        { success: false, message: "Failed to delete" },
        { status: 500, headers: NO_STORE },
      );
    }
    return Response.json(
      { success: true },
      { status: 200, headers: NO_STORE },
    );
  } catch (error) {
    console.error("Delete submission error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500, headers: NO_STORE },
    );
  }
}
