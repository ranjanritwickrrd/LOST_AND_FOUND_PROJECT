"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ItemType } from "@/lib/types";
import { Input } from "@/lib/ui";

interface ItemCreateFormProps {
  type: ItemType;
}

export function ItemCreateForm({ type }: ItemCreateFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    locationFound: "",
    dateFound: "",
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };
  async function uploadFileIfNeeded(): Promise<string | null> {
    if (!file) {
      return form.imageUrl || null;
    }
    setIsUploading(true);
    try {
      const url = await api.uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      return url;
    } finally {
      setIsUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const finalImageUrl = await uploadFileIfNeeded();

      const payload = {
        type,
        title: form.title,
        description: form.description || undefined,
        category: form.category || undefined,
        locationFound: form.locationFound || undefined,
        dateFound: form.dateFound
          ? new Date(form.dateFound).toISOString()
          : null,
        imageUrl: finalImageUrl || undefined,
      };

      const newItem = await api.createItem(payload);
      router.push(`/items/${newItem.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">
        Report a {type === "FOUND" ? "Found" : "Lost"} Item
      </h1>
      <p className="text-gray-600">
        Please provide as much detail as possible, and optionally upload a
        photo of the item.
      </p>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title*
        </label>
        <Input
          id="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category (e.g., Phone, Keys)
          </label>
          <Input
            id="category"
            type="text"
            value={form.category}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            htmlFor="locationFound"
            className="block text-sm font-medium mb-1"
          >
            {type === "FOUND" ? "Location Found" : "Location Lost"}
          </label>
          <Input
            id="locationFound"
            type="text"
            value={form.locationFound}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="dateFound" className="block text-sm font-medium mb-1">
          {type === "FOUND" ? "Date Found" : "Date Lost"}
        </label>
        <Input
          id="dateFound"
          type="date"
          value={form.dateFound}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Item Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
        <p className="text-xs text-gray-500">
          You can also paste an image URL directly (advanced):
        </p>
        <Input
          id="imageUrl"
          type="text"
          placeholder="https://example.com/image.jpg or /uploads/..."
          value={form.imageUrl}
          onChange={handleChange}
        />
        {isUploading && (
          <p className="text-xs text-blue-600">Uploading image...</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploading}
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {isSubmitting || isUploading ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}
