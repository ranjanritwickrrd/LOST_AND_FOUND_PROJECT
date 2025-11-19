import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs"; // we need Node.js APIs (fs, path)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read file bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists (public/uploads)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Build a safe file name (preserve extension)
    const originalName = file.name || "upload";
    const ext = path.extname(originalName) || "";
    const safeBase =
      path
        .basename(originalName, ext)
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "_") || "file";

    const filename = `${safeBase}_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Write to disk
    await fs.writeFile(filePath, buffer);

    // Public URL (served by Next from /public)
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("File upload error:", err);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}
