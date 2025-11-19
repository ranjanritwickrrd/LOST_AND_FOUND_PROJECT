"use client";

import Link from "next/link";

export default function ReportUploadDemoPage() {
  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Lost &amp; Found — Image Upload Demo</h1>

      <p>
        This page explains how the Lost &amp; Found reporting form supports
        both <strong>image URL</strong> and <strong>file upload</strong> from
        your system.
      </p>

      <ol className="list-decimal list-inside space-y-2">
        <li>Login to the system using your account.</li>
        <li>
          Open the actual report page:{" "}
          <Link href="/items/new" className="text-blue-600 underline">
            /items/new
          </Link>
          .
        </li>
        <li>
          Fill in item details (Lost / Found, title, description, category,
          location, date).
        </li>
        <li>
          Either paste an existing image URL, or choose an image file from your
          computer. The file is uploaded to <code>/uploads/</code> and the
          generated URL is stored with the item.
        </li>
        <li>
          Submit the form. A new Lost &amp; Found item is created via
          <code>POST /api/items</code> (JWT/Bearer protected).
        </li>
      </ol>

      <p className="text-sm text-gray-600">
        You can show this flow along with Swagger documentation to your
        professor to demonstrate both the REST API and the frontend integration.
      </p>
    </main>
  );
}
