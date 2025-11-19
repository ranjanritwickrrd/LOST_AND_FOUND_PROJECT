"use client";

import { ItemResponse } from "@/lib/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:3000";

function resolveImageSrc(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("/")) {
    return `${API_BASE}${imageUrl}`;
  }
  return imageUrl;
}

interface ItemDetailProps {
  item: ItemResponse;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const imageSrc = resolveImageSrc(item.imageUrl);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-extrabold mb-2">{item.title}</h1>

      <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400">No Image Provided</span>
        )}
      </div>

      <p className="text-lg text-gray-700">
        {item.description || "No description provided."}
      </p>

      <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
        <div>
          <h2 className="font-semibold mb-1">Category</h2>
          <p>{item.category || "N/A"}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">
            {item.type === "FOUND" ? "Location Found" : "Location Lost"}
          </h2>
          <p>{item.locationFound || "N/A"}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-1">
            {item.type === "FOUND" ? "Date Found" : "Date Lost"}
          </h2>
          <p>{formatDate(item.dateFound || null)}</p>
        </div>
      </div>
    </div>
  );
}
