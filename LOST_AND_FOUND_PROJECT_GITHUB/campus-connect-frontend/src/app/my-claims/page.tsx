"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ClaimPublic } from "@/lib/types";
import { AuthGuard } from "@/lib/guards";
import Link from "next/link";

function MyClaimsContent() {
  const [claims, setClaims] = useState<ClaimPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.myClaims();
        setClaims(data.reverse());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch claims.");
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);
  const getStatusColor = (status: ClaimPublic["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Claims</h1>

      {loading && (
        <div className="text-center py-10">Loading my claims...</div>
      )}
      {error && (
        <div className="p-3 bg-red-100 text-red-700">{error}</div>
      )}
      {!loading && !error && claims.length === 0 && (
        <div className="text-center text-gray-500 py-10 border-2 border-dashed rounded-lg bg-gray-50">
          <p className="text-lg">You have not made any claims yet.</p>
          <Link
            href="/items"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Items
          </Link>
        </div>
      )}

      {!loading && claims.length > 0 && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Claimed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/items/${claim.item.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {claim.item.title || "View Item"}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        claim.status
                      )}`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 truncate max-w-xs">
                    {claim.message || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyClaimsPage() {
  return (
    <AuthGuard>
      <MyClaimsContent />
    </AuthGuard>
  );
}
