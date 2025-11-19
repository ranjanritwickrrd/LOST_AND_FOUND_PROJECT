"use client";
import Link from "next/link";
import { ItemResponse } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { BASE } from "@/lib/api";

interface ItemCardProps {
  item: ItemResponse;
}

export function ItemCard({ item }: ItemCardProps) {
  const { userId } = useAuth();
  const isOwner = item.ownerId === userId;

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // If imageUrl is relative like "/uploads/...", serve it from the API server (port 3000)
  const imgSrc =
    item.imageUrl && !item.imageUrl.startsWith("http")
      ? `${BASE}${item.imageUrl}`
      : item.imageUrl || "";

  return (
    <div className="border rounded-lg shadow-lg bg-white relative overflow-hidden transition-transform hover:shadow-xl hover:scale-[1.01] flex flex-col">
      {isOwner && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Mine
        </div>
      )}

      <Link href={`/items/${item.id}`} className="block">
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <span
          className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2 self-start ${
            item.type === "FOUND"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.type}
        </span>

        <h3 className="text-xl font-bold mb-2 truncate">
          <Link
            href={`/items/${item.id}`}
            className="hover:text-blue-600"
          >
            {item.title}
          </Link>
        </h3>

        <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden flex-grow">
          {item.description || "No description provided."}
        </p>

        <div className="text-xs text-gray-500 space-y-1 mb-4 border-t pt-2">
          {item.locationFound && <p>Location: {item.locationFound}</p>}
          {item.dateFound && <p>Date: {formatDate(item.dateFound)}</p>}
        </div>

        <Link
          href={`/items/${item.id}`}
          className="block w-full text-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
