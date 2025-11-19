import { headers } from "next/headers";
import Link from "next/link";

type Item = {
  id: string;
  title: string;
  description: string | null;
  type: "FOUND" | "LOST";
  category: string | null;
  locationFound: string | null;
  dateFound: string | null;
  imageUrl: string | null;
  createdAt: string;
};

async function getLostItems(): Promise<Item[]> {
  const h = headers();
  const host = h.get("host") || "localhost:3000";
  const protocol =
    host.includes("localhost") || host.startsWith("127.") ? "http" : "https";
  const base = `${protocol}://${host}`;
  const res = await fetch(`${base}/api/items?type=LOST`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function LostPage() {
  const items = await getLostItems();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Lost Items</h1>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No lost items available.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li key={it.id} className="border rounded-lg p-4 hover:shadow-sm">
              <Link href={`/items/${it.id}`} className="block space-y-1">
                <div className="font-semibold">{it.title}</div>
                {it.description && (
                  <div className="text-sm text-gray-700">
                    {it.description}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  {it.category ?? "Uncategorized"}
                  {it.locationFound ? ` • ${it.locationFound}` : ""}
                </div>
                {it.imageUrl && (
                  <img
                    src={it.imageUrl}
                    alt={it.title}
                    className="mt-2 w-full max-w-xs rounded"
                  />
                )}
                <div className="mt-2 text-xs text-blue-600 underline">
                  View details
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
