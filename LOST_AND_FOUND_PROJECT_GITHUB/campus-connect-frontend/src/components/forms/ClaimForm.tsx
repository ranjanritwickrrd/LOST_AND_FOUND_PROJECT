"use client";

import { useState } from "react";
import { api } from "@/lib/api";

interface Props {
  itemId: string;
  onClaimSubmitted: () => void;
  itemType?: "FOUND" | "LOST"; // optional: controls heading text
}

export function ClaimForm({ itemId, onClaimSubmitted, itemType }: Props) {
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.claimItem(itemId, { message, contact });
      setSuccess(true);
      onClaimSubmitted();
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (success) {
    return (
      <div className="p-4 bg-green-100 text-green-700 rounded border border-green-300 shadow-md">
        <p className="font-semibold">Claim Submitted!</p>
        <p className="text-sm">The item owner has been notified.</p>
      </div>
    );
  }

  const heading =
    itemType === "FOUND" ? "Found This Item?" : "Claim This Item";
  const subtitle =
    itemType === "FOUND"
      ? "Please provide details so the owner can confirm this found item is yours."
      : "Please provide details to help the owner verify your claim.";
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-6 border rounded-lg bg-gray-50 shadow-md"
    >
      <h3 className="text-xl font-bold">{heading}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-1"
        >
          Identifying Message*
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Describe the item details that prove it's yours..."
          required
        />
      </div>

      <div>
        <label
          htmlFor="contact"
          className="block text-sm font-medium mb-1"
        >
          Contact Info* (Phone/Email)
        </label>
        <input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Your phone number or email"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  );
}
