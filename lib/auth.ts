import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function expectedToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  return Buffer.from(`anu-admin::${password}`).toString("base64");
}

export function createSessionCookie(): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    path: string;
    maxAge: number;
  };
} {
  return {
    name: COOKIE_NAME,
    value: expectedToken(),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const store = await cookies();
    const session = store.get(COOKIE_NAME);
    if (!session) {
      return false;
    }
    return session.value === expectedToken();
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  return password === expected;
}
