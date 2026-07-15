import { NextRequest } from "next/server";
import {
  createSessionCookie,
  verifyPassword,
  isAuthenticated,
} from "@/lib/auth";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password ?? "";
    if (!verifyPassword(password)) {
      return Response.json(
        { success: false, message: "Invalid password" },
        { status: 401, headers: NO_STORE },
      );
    }
    const cookie = createSessionCookie();
    const response = Response.json(
      { success: true },
      { status: 200, headers: NO_STORE },
    );
    response.headers.append(
      "Set-Cookie",
      `${cookie.name}=${cookie.value}; Path=${cookie.options.path}; HttpOnly; SameSite=${cookie.options.sameSite}; Max-Age=${cookie.options.maxAge}${cookie.options.secure ? "; Secure" : ""}`,
    );
    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500, headers: NO_STORE },
    );
  }
}

export async function GET() {
  const authenticated = await isAuthenticated();
  return Response.json({ authenticated }, { status: 200, headers: NO_STORE });
}

export async function DELETE() {
  const response = Response.json(
    { success: true },
    { status: 200, headers: NO_STORE },
  );
  response.headers.append(
    "Set-Cookie",
    `admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  );
  return response;
}
