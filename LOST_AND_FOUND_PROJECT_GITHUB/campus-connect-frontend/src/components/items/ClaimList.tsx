"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ClaimWithClaimer } from "@/lib/types";

interface ClaimListProps {
  itemId: string;
}

export function ClaimList({ itemId }: ClaimListProps) {
  const [claims, setClaims] = useState<ClaimWithClaimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listItemClaimsAsOwner(itemId);
      setClaims(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [itemId]);

  const handleAction = async (claimId: string, action: "approve" | "reject") => {
    try {
      if (action === "approve") {
        await api.approveClaim(claimId);
      } else {
        await api.rejectClaim(claimId);
      }
      // Refresh the list to show the new status
      fetchClaims();
    } catch (err) {
      alert(`Failed to ${action} claim: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  if (loading) return <div className="text-center p-4">Loading claims...</div>;
  if (error) return <div className="p-3 bg-red-100 text-red-700">{error}</div>;
  if (claims.length === 0) {
    return (
      <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-md">
        <h3 className="font-bold text-blue-800">No Incoming Claims</h3>
        <p className="text-sm text-blue-700">There are currently no claims for this item.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Incoming Claims</h3>
      {claims.map((claim) => (
        <div key={claim.id} className="p-4 border rounded-lg shadow-md bg-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold text-lg">
                Claim from: {claim.claimer.name || claim.claimer.username}
              </p>
              <p className="text-sm text-gray-500">Contact: {claim.contact || "Not provided"}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
              claim.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
              claim.status === "APPROVED" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            }`}>
              {claim.status}
            </span>
          </div>
          <p className="mt-4 text-gray-700 italic border-l-4 border-gray-200 pl-4 py-1">
            "{claim.message || "No message provided."}"
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Claimed on: {new Date(claim.createdAt).toLocaleString()}
          </p>

          {claim.status === "PENDING" && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleAction(claim.id, "approve")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(claim.id, "reject")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
