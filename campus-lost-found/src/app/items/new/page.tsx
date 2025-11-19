"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const categories = [
  "ELECTRONICS",
  "ID_CARD",
  "BOOKS",
  "CLOTHING",
  "ACCESSORIES",
  "OTHER",
] as const;

type Category = (typeof categories)[number];
type ItemType = "LOST" | "FOUND";

export default function NewItem() {
  const router = useRouter();

  const [form, setForm] = useState<{
    type: ItemType;
    title: string;
    description: string;
    category: Category;
    locationFound: string;
    dateFound: string;
    imageUrlText: string;
  }>({
    type: "LOST",
    title: "",
    description: "",
    category: "ELECTRONICS",
    locationFound: "",
    dateFound: "",
    imageUrlText: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: any) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }
  async function uploadFileIfNeeded(): Promise<string | null> {
    if (!file) {
      return form.imageUrlText.trim() ? form.imageUrlText.trim() : null;
    }

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({} as any));
      throw new Error(data.error || `Upload failed (${res.status})`);
    }

    const data = await res.json();
    return data.url as string;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const finalImageUrl = await uploadFileIfNeeded();

      const payload = {
        type: form.type,
        title: form.title,
        description: form.description || null,
        category: form.category || null,
        locationFound: form.locationFound || null,
        dateFound: form.dateFound || null,
        imageUrl: finalImageUrl,
      };

      await api.post("/api/items", payload);
      router.push("/items");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="card" style={{ maxWidth: 620 }}>
      <h1>Report Item (Lost / Found)</h1>
      <form
        onSubmit={onSubmit}
        className="row"
        style={{ flexDirection: "column", gap: 12, marginTop: 12 }}
      >
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Type</label>
            <select
              className="select"
              value={form.type}
              onChange={(e) => set("type", e.target.value as ItemType)}
            >
              <option value="LOST">LOST</option>
              <option value="FOUND">FOUND</option>
            </select>
          </div>

          <div className="field" style={{ flex: 2 }}>
            <label>Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            className="textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>Category</label>
            <select
              className="select"
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Location</label>
            <input
              className="input"
              value={form.locationFound}
              onChange={(e) => set("locationFound", e.target.value)}
            />
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label>Date</label>
            <input
              className="input"
              type="date"
              value={form.dateFound}
              onChange={(e) => set("dateFound", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Image URL (optional)</label>
          <input
            className="input"
            value={form.imageUrlText}
            onChange={(e) => set("imageUrlText", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small className="muted">
            You can either paste an image URL here or choose a file below.
          </small>
        </div>

        <div className="field">
          <label>Upload from your system (optional)</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFile(f);
            }}
          />
          <small className="muted">
            If you choose a file, it will be uploaded to <code>/uploads/</code> and used.
          </small>
        </div>

        {error && (
          <div className="muted" style={{ color: "crimson" }}>
            {error}
          </div>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}
          <div className="field" style={{ flex: 1 }}>
            <label>Location</label>
            <input
              className="input"
              value={form.locationFound}
              onChange={(e) => set("locationFound", e.target.value)}
            />
          </div>

          <div className="field" style={{ flex: 1 }}>
            <label>Date</label>
            <input
              className="input"
              type="date"
              value={form.dateFound}
              onChange={(e) => set("dateFound", e.target.value)}
            />
          </div>
        </div>

        <div className="field">
          <label>Image URL (optional)</label>
          <input
            className="input"
            value={form.imageUrlText}
            onChange={(e) => set("imageUrlText", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <small className="muted">
            You can either paste an image URL here or choose a file below.
          </small>
        </div>

        <div className="field">
          <label>Upload from your system (optional)</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] ?? null;
              setFile(f);
            }}
          />
          <small className="muted">
            If you choose a file, it will be uploaded to <code>/uploads/</code> and used.
          </small>
        </div>

        {error && (
          <div className="muted" style={{ color: "crimson" }}>
            {error}
          </div>
        )}

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </section>
  );
}
