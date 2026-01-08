import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Inquiry = {
  id: number;
  user: string;
  inquiry: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "inquiries.json");
const maxUserLength = 60;
const maxInquiryLength = 500;

const sanitizeString = (value: unknown, maxLength: number) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }

  return trimmed;
};

const readEntries = async (): Promise<Inquiry[]> => {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: unknown) {
    const nodeError = error as { code?: string };
    if (!nodeError || nodeError.code !== "ENOENT") {
      console.warn("Failed to read inquiries:", error);
    }
    return [];
  }
};

const writeEntries = async (items: Inquiry[]) => {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), "utf8");
};

export async function GET() {
  const items = await readEntries();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const data =
    payload && typeof payload === "object"
      ? (payload as Record<string, unknown>)
      : {};

  const user = sanitizeString(data.user, maxUserLength);
  const inquiry = sanitizeString(data.inquiry, maxInquiryLength);

  if (!user || !inquiry) {
    return NextResponse.json(
      { error: "Both user and inquiry are required." },
      { status: 400 }
    );
  }

  const entries = await readEntries();
  const entry: Inquiry = {
    id: Date.now(),
    user,
    inquiry,
    createdAt: new Date().toISOString(),
  };

  entries.push(entry);
  await writeEntries(entries);

  return NextResponse.json({ item: entry }, { status: 201 });
}
