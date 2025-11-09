"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/lib/ui";

interface ClaimFormProps {
  itemId: string;
  onClaimSubmitted: () => void;
}

export function ClaimForm({ itemId, onClaimSubmitted }: ClaimFormProps) {
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
      onClaimSubmitted(); // Notify parent to refetch data if needed
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-lg bg-gray-50 shadow-md">
      <h3 className="text-xl font-bold">Claim This Item</h3>
      <p className="text-sm text-gray-600">
        Please provide details to help the owner verify your claim.
      </p>
      
      {error && <div className="p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Identifying Message*</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="e.g., 'My phone has a crack on the top left corner...'"
          required
        />
      </div>
      <div>
        <label htmlFor="contact" className="block text-sm font-medium mb-1">Contact Info* (Phone/Email)</label>
        <Input
          id="contact"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Your phone number or email"
          required
        />
      </div>
      
      <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700 transition-colors disabled:opacity-50">
        {isSubmitting ? "Submitting Claim..." : "Submit Claim"}
      </button>
    </form>
  );
}
