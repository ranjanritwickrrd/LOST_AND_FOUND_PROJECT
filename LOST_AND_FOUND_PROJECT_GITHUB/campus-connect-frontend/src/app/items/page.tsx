"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ItemResponse } from "@/lib/types";
import { ItemCard } from "@/components/items/ItemCard";
import Link from "next/link";

function ItemsClientPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filterType = searchParams.get("type")?.toUpperCase(); // "FOUND" | "LOST" | undefined

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.listItems();
        setItems(data.reverse()); // Show newest first
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterType) return items;
    return items.filter((item) => item.type === filterType);
  }, [items, filterType]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">
          {filterType ? `${filterType} Items` : "All Items"}
        </h1>
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
          <Link href="/items?type=FOUND" className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === "FOUND" ? 'bg-white text-green-700 shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
            Found
          </Link>
          <Link href="/items?type=LOST" className={`px-4 py-2 rounded-md text-sm font-medium ${filterType === "LOST" ? 'bg-white text-red-700 shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
            Lost
          </Link>
          <Link href="/items" className={`px-4 py-2 rounded-md text-sm font-medium ${!filterType ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:bg-gray-100'}`}>
            All
          </Link>
        </div>
      </div>

      {loading && <div className="text-center py-10">Loading items...</div>}
      {error && <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}

      {!loading && !error && filteredItems.length === 0 && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg">
          <p className="text-lg">No {filterType ? `${filterType.toLowerCase()}` : ''} items found.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function ItemsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ItemsClientPage />
    </Suspense>
  )
}
