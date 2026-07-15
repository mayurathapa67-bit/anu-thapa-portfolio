import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

export async function GET() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json(
      { github: false, cloudinary: false },
      { status: 401, headers: NO_STORE },
    );
  }

  const github =
    Boolean(process.env.GITHUB_TOKEN) && Boolean(process.env.GITHUB_REPO);
  const cloudinary =
    Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
    Boolean(process.env.CLOUDINARY_API_KEY) &&
    Boolean(process.env.CLOUDINARY_API_SECRET);

  return Response.json(
    { github, cloudinary },
    { status: 200, headers: NO_STORE },
  );
}
