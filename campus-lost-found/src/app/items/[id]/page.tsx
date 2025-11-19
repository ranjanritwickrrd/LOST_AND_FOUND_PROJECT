"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type ItemDetail = {
  id: string;
  title: string;
  description: string | null;
  type: "FOUND" | "LOST";
  category: string | null;
  locationFound: string | null;
  dateFound: string | null;
  imageUrl: string | null;
  createdAt: string;
  isResolved?: boolean;
  isOwner?: boolean;
};

type FoundItemOption = {
  id: string;
  title: string;
};

const fetcher = (url: string) => api.get(url).then((res) => res.data);

export default function ItemDetailPage() {
  const { isAuthed } = useAuth();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [foundItems, setFoundItems] = useState<FoundItemOption[]>([]);
  const [selectedFoundId, setSelectedFoundId] = useState("");
  const [creatingMatch, setCreatingMatch] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  if (!isAuthed) {
    if (typeof window !== "undefined") router.replace("/login");
    return null;
  }
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<ItemDetail>(id ? `/api/items/${id}` : null, fetcher);

  useEffect(() => {
    async function loadFoundItems() {
      try {
        const res = await api.get<ItemDetail[]>("/api/items?type=FOUND");
        const options = (res.data || [])
          .filter((it) => !it.isResolved)
          .map((it) => ({ id: it.id, title: it.title }));
        setFoundItems(options);
      } catch (err) {
        console.error("Failed to load found items for matching", err);
      }
    }

    if (data && data.type === "LOST" && !data.isResolved) {
      loadFoundItems();
    }
  }, [data]);

  const handleCreateMatch = async () => {
    if (!data) return;
    if (!selectedFoundId) {
      setErrMsg("Please select a found item to match.");
      setMsg(null);
      return;
    }

    setCreatingMatch(true);
    setErrMsg(null);
    setMsg(null);

    try {
      await api.post("/api/matches", {
        lostItemId: data.id,
        foundItemId: selectedFoundId,
      });

      setMsg("Found match request created successfully.");
      setErrMsg(null);
      mutate();
    } catch (err: any) {
      console.error("Failed to create match", err);
      const apiError =
        err?.response?.data?.error || "Failed to create match. Try again.";
      setErrMsg(apiError);
      setMsg(null);
    } finally {
      setCreatingMatch(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load.</div>;
  if (!data) return null;

  const isLost = data.type === "LOST";
  const resolvedLabel = data.isResolved ? "Yes" : "No";

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{data.title}</h1>

      {data.imageUrl && (
        <img
          src={data.imageUrl}
          alt={data.title}
          className="w-full max-w-md rounded border"
        />
      )}

      <p className="opacity-80">{data.description}</p>
      <div className="text-sm space-y-1">
        <div>
          <span className="font-semibold">Type:</span> {data.type}
        </div>
        <div>
          <span className="font-semibold">Category:</span> {data.category ?? "—"}
        </div>
        <div>
          <span className="font-semibold">Location:</span> {data.locationFound ?? "—"}
        </div>
        <div>
          <span className="font-semibold">Resolved:</span> {resolvedLabel}
        </div>
      </div>

      {isLost && !data.isResolved && (
        <div className="mt-6 border-t pt-4 space-y-3">
          <h2 className="text-lg font-semibold">Found match</h2>
          <p className="text-sm text-gray-600">
            Select the found item that matches this lost item, then click{" "}
            <strong>Found match</strong> to create a match request.
          </p>
          {foundItems.length === 0 ? (
            <p className="text-sm text-gray-500">
              No unresolved found items available to match right now.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-w-md">
              <select
                className="border rounded px-3 py-2 text-sm"
                value={selectedFoundId}
                onChange={(e) => setSelectedFoundId(e.target.value)}
              >
                <option value="">Select a found item…</option>
                {foundItems.map((fi) => (
                  <option key={fi.id} value={fi.id}>
                    {fi.title}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleCreateMatch}
                disabled={creatingMatch}
                className="inline-flex items-center justify-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {creatingMatch ? "Creating match…" : "Found match"}
              </button>
            </div>
          )}

          {msg && <div className="text-sm text-green-700">{msg}</div>}
          {errMsg && <div className="text-sm text-red-600">{errMsg}</div>}
        </div>
      )}
    </div>
  );
}
