"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ItemResponse } from "@/lib/types";
import { AuthGuard } from "@/lib/guards";
import { ItemDetail } from "@/components/items/ItemDetail";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { ClaimList } from "@/components/items/ClaimList";

function ItemDetailPageContent() {
  const params = useParams();
  const { userId, isLoading: isAuthLoading } = useAuth();
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (!id) return;
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getItem(id);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, claimSubmitted]); // Refetch if a claim is submitted

  if (loading || isAuthLoading) return <div className="text-center py-10">Loading item details...</div>;
  if (error) return <div className="p-3 bg-red-100 text-red-700">{error}</div>;
  if (!item) return <div className="text-center py-10">Item not found.</div>;

  // This is the critical logic that depends on your backend sending `ownerId`
  const isOwner = item.ownerId === userId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <ItemDetail item={item} />
      </div>
      
      <div className="lg:col-span-1 space-y-6">
        {isOwner ? (
          <ClaimList itemId={item.id} />
        ) : (
          <ClaimForm 
            itemId={item.id} 
            onClaimSubmitted={() => setClaimSubmitted(true)} 
          />
        )}
      </div>
    </div>
  );
}

export default function ItemDetailPage() {
  // We wrap the whole page in AuthGuard as per the brief
  // This ensures we always know who the user is for the owner-check
  return (
    <AuthGuard>
      <ItemDetailPageContent />
    </AuthGuard>
  );
}
