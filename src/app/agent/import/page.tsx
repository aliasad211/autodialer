"use client";

import { useState } from "react";
import Link from "next/link";

export default function ImportLeadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <Link
          href="/agent/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Dashboard
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          Import Leads
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Upload your customer numbers using a CSV file.
        </p>
      </div>

      {/* Region Notice */}
      <div className="mt-6 flex gap-3 rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          📍
        </div>

        <div>
          <h2 className="font-semibold text-gray-900">
            Your assigned region: Islamabad
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Leads imported from your account will be associated
            with your assigned region automatically.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">
            Upload CSV
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a CSV file containing customer information.
          </p>
        </div>

        {/* Dropzone */}
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`mt-6 flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition ${
            dragging
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) =>
              handleFile(e.target.files?.[0])
            }
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📄
          </div>

          {file ? (
            <>
              <h3 className="mt-4 font-semibold text-gray-900">
                {file.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>

              <p className="mt-3 text-sm font-medium text-green-600">
                File selected successfully
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-4 font-semibold text-gray-900">
                Drop your CSV file here
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                or click to browse from your computer
              </p>

              <p className="mt-4 text-xs text-gray-400">
                Only CSV files are supported
              </p>
            </>
          )}
        </label>

        {/* File Actions */}
        {file && (
          <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Ready to import
              </p>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {/* Import Button */}
        <div className="mt-6 flex justify-end">
          <button
            disabled={!file}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Import Leads
          </button>
        </div>
      </div>

      {/* CSV Format */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            CSV Format
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your CSV should contain the following columns.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Column
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Required
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Example
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Description
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <CsvRow
                column="name"
                required="Yes"
                example="Ahmed Khan"
                description="Customer full name"
              />

              <CsvRow
                column="phone"
                required="Yes"
                example="03001234567"
                description="Customer mobile number"
              />

              <CsvRow
                column="city"
                required="Yes"
                example="Islamabad"
                description="Customer city"
              />

              <CsvRow
                column="vehicle"
                required="No"
                example="Toyota Aqua"
                description="Vehicle customer is interested in"
              />

              <CsvRow
                column="notes"
                required="No"
                example="Looking for 2021 model"
                description="Additional information"
              />
            </tbody>
          </table>
        </div>

        {/* Download Template */}
        <div className="border-t p-5">
          <button className="text-sm font-medium text-gray-900 hover:underline">
            ↓ Download CSV Template
          </button>
        </div>
      </div>

      {/* Import Rules */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Import Rules
        </h2>

        <div className="mt-5 space-y-4">
          <Rule
            icon="✓"
            text="Only CSV files are accepted."
          />

          <Rule
            icon="✓"
            text="Phone number is required for every lead."
          />

          <Rule
            icon="✓"
            text="Duplicate phone numbers will not be imported."
          />

          <Rule
            icon="✓"
            text="Imported leads will automatically belong to your assigned region."
          />

          <Rule
            icon="✓"
            text="You cannot import leads into another region."
          />
        </div>
      </div>

      {/* Previous Imports */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">
            Recent Imports
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your recent CSV imports.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  File
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Leads
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Imported
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <ImportRow
                file="islamabad-customers.csv"
                leads="124"
                date="Today, 11:30 AM"
              />

              <ImportRow
                file="new-numbers.csv"
                leads="86"
                date="Yesterday, 04:20 PM"
              />

              <ImportRow
                file="july-leads.csv"
                leads="210"
                date="Aug 18, 2026"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CsvRow({
  column,
  required,
  example,
  description,
}: {
  column: string;
  required: string;
  example: string;
  description: string;
}) {
  return (
    <tr>
      <td className="px-6 py-4">
        <code className="rounded bg-gray-100 px-2 py-1 text-xs">
          {column}
        </code>
      </td>

      <td className="px-6 py-4 text-sm">
        {required === "Yes" ? (
          <span className="font-medium text-red-600">
            Required
          </span>
        ) : (
          <span className="text-gray-500">
            Optional
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {example}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {description}
      </td>
    </tr>
  );
}

function Rule({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
        {icon}
      </span>

      <p className="text-sm text-gray-600">
        {text}
      </p>
    </div>
  );
}

function ImportRow({
  file,
  leads,
  date,
}: {
  file: string;
  leads: string;
  date: string;
}) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
            📄
          </span>

          <span className="text-sm font-medium text-gray-900">
            {file}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">
        {leads}
      </td>

      <td className="px-6 py-4 text-sm text-gray-500">
        {date}
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          Completed
        </span>
      </td>
    </tr>
  );
}