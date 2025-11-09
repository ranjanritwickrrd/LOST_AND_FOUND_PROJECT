"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ItemResponse } from "@/lib/types";
import { ItemCard } from "@/components/items/ItemCard";
import { AuthGuard } from "@/lib/guards";
import Link from "next/link";

function MyItemsContent() {
  const { userId, isLoading: isAuthLoading } = useAuth();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading || !userId) return; // Wait for auth context
    
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const allItems = await api.listItems();
        // Client-side filter as per brief. THIS REQUIRES `ownerId` FROM YOUR API
        const myItems = allItems.filter(item => item.ownerId === userId).reverse();
        setItems(myItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [userId, isAuthLoading]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Reported Items</h1>
      
      {loading && <div className="text-center py-10">Loading my items...</div>}
      {error && <div className="p-3 bg-red-100 text-red-700">{error}</div>}
      
      {!loading && !error && items.length === 0 && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-lg">You have not reported any items yet.</p>
          <div className="mt-4 space-x-4">
            <Link href="/report-found" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Report a Found Item
            </Link>
            <Link href="/report-lost" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Report a Lost Item
            </Link>
          </div>
        </div>
      )}

      {!loading && items.length > 0 && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyItemsPage() {
  return (
    <AuthGuard>
      <MyItemsContent />
    </AuthGuard>
  );
}
