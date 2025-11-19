"use client";

import useSWR from "swr";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";

const fetcher = (url: string) => api.get(url).then((r) => r.data);

export default function ItemsPage() {
  const { isLoggedIn } = useAuth();
  const searchParams = useSearchParams();
  const typeParam = (searchParams.get("type") || "").toUpperCase(); // "", FOUND, LOST
  const key =
    typeParam === "FOUND" || typeParam === "LOST"
      ? `/api/items?type=${typeParam}`
      : `/api/items`;

  const { data: items, error, isLoading } = useSWR(key, fetcher);

  if (!isLoggedIn) return <p>Please log in first.</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading items.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Lost &amp; Found Items {typeParam ? `— ${typeParam}` : ""}
      </h1>

      {Array.isArray(items) && items.length === 0 && (
        <div className="border border-dashed rounded p-8 text-center text-gray-500">
          No {typeParam ? typeParam.toLowerCase() : ""} items found.
        </div>
      )}

      {Array.isArray(items) && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item: any) => (
            <div key={item.id} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{item.title}</h2>
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {item.type}
                </span>
              </div>
              {item.description && (
                <p className="text-sm text-gray-700 mt-1">{item.description}</p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {(item.category ?? "Uncategorized")}
                {item.locationFound ? ` • ${item.locationFound}` : ""}
              </div>
              <Link
                href={`/items/${item.id}`}
                className="inline-block mt-2 text-sm text-blue-600 underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
