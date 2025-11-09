"use client";

import useSWR from "swr";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const fetcher = (url: string) => api.get(url).then(r => r.data);

export default function ItemsPage() {
  const { isLoggedIn } = useAuth();
  const { data: items, error, isLoading } = useSWR("/api/items", fetcher);

  if (!isLoggedIn) return <p>Please log in first.</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading items.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lost & Found Items</h1>
      {items?.map((item: any) => (
        <div key={item.id} className="border p-4 rounded mb-2">
          <h2 className="font-semibold">{item.title}</h2>
          <p>{item.description}</p>
          <Link href={`/items/${item.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
