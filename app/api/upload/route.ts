import { v2 as cloudinary } from "cloudinary";
import { NextRequest } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return Response.json(
      { success: false, message: "Unauthorized" },
      { status: 401, headers: NO_STORE },
    );
  }

  let file: File | null = null;
  try {
    const formData = await request.formData();
    const f = formData.get("file");
    if (f instanceof File) {
      file = f;
    }
  } catch {
    file = null;
  }

  if (!file) {
    return Response.json(
      { success: false, message: "No file provided." },
      { status: 400, headers: NO_STORE },
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { success: false, message: "Unsupported image type." },
      { status: 400, headers: NO_STORE },
    );
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { success: false, message: "File is too large (max 8MB)." },
      { status: 400, headers: NO_STORE },
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    try {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "portfolio",
      });

      return Response.json(
        {
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          storage: "cloudinary",
        },
        { status: 200, headers: NO_STORE },
      );
    } catch (error) {
      console.error(
        "Cloudinary upload failed, falling back to local storage:",
        error,
      );
      // Do not fail hard — fall through to local storage below.
    }
  }

  try {
    const ext = (file.name.split(".").pop() ?? "jpg")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 5) || "jpg";
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `img_${Date.now()}`;
    const fileName = `${id}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(dir, fileName), bytes);
    return Response.json(
      {
        success: true,
        url: `/uploads/${fileName}`,
        public_id: fileName,
        storage: "local",
      },
      { status: 200, headers: NO_STORE },
    );
  } catch (error) {
    console.error("Local upload error:", error);
    return Response.json(
      {
        success: false,
        message:
          "Local upload failed. Configure Cloudinary for production uploads.",
      },
      { status: 500, headers: NO_STORE },
    );
  }
}
