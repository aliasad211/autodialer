"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import { importLeads, type ImportRow } from "@/app/actions/imports";

type RecentLead = { id: string; customerName: string; phone: string; createdAt: Date };

function parseCsv(text: string): ImportRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const nameIdx = headers.indexOf("name");
  const phoneIdx = headers.indexOf("phone");
  const cityIdx = headers.indexOf("city");
  const vehicleIdx = headers.indexOf("vehicle");
  const notesIdx = headers.indexOf("notes");

  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    return {
      name: nameIdx >= 0 ? (cols[nameIdx] ?? "").trim() : "",
      phone: phoneIdx >= 0 ? (cols[phoneIdx] ?? "").trim() : "",
      city: cityIdx >= 0 ? cols[cityIdx]?.trim() : undefined,
      vehicle: vehicleIdx >= 0 ? cols[vehicleIdx]?.trim() : undefined,
      notes: notesIdx >= 0 ? cols[notesIdx]?.trim() : undefined,
    };
  });
}

export default function ImportForm({
  regionName,
  recentLeads,
}: {
  regionName: string;
  recentLeads: RecentLead[];
}) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; error?: string } | null>(
    null
  );

  const handleFile = async (selectedFile: File | undefined) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      alert("Please select a CSV file.");
      return;
    }

    setResult(null);
    setFile(selectedFile);
    const text = await selectedFile.text();
    setRows(parseCsv(text));
  };

  const handleImport = async () => {
    setImporting(true);
    const res = await importLeads(rows);
    setResult(res);
    setImporting(false);

    if (!res.error) {
      setFile(null);
      setRows([]);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <Link href="/agent/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to Dashboard
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">Import Leads</h1>
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
          <h2 className="font-semibold text-gray-900">Your assigned region: {regionName}</h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Leads imported from your account will be associated with your assigned region
            automatically.
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Upload CSV</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select a CSV file containing customer information.
          </p>
        </div>

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
            dragging ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📄
          </div>

          {file ? (
            <>
              <h3 className="mt-4 font-semibold text-gray-900">{file.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              <p className="mt-3 text-sm font-medium text-green-600">
                {rows.length} row{rows.length === 1 ? "" : "s"} detected
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-4 font-semibold text-gray-900">Drop your CSV file here</h3>
              <p className="mt-2 text-sm text-gray-500">or click to browse from your computer</p>
              <p className="mt-4 text-xs text-gray-400">Only CSV files are supported</p>
            </>
          )}
        </label>

        {file && (
          <div className="mt-5 flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="mt-1 text-xs text-gray-500">Ready to import</p>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setRows([]);
                setResult(null);
              }}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        {result && (
          <div
            className={`mt-5 rounded-lg p-4 text-sm ${
              result.error
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-700"
            }`}
          >
            {result.error
              ? result.error
              : `Imported ${result.imported} lead${result.imported === 1 ? "" : "s"}. Skipped ${result.skipped} duplicate${result.skipped === 1 ? "" : "s"}.`}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleImport}
            disabled={!file || rows.length === 0 || importing}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {importing ? "Importing..." : "Import Leads"}
          </button>
        </div>
      </div>

      {/* CSV Format */}
      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">CSV Format</h2>
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
              <CsvRow column="name" required="Yes" example="Ahmed Khan" description="Customer full name" />
              <CsvRow column="phone" required="Yes" example="03001234567" description="Customer mobile number" />
              <CsvRow column="city" required="No" example="Islamabad" description="Customer city" />
              <CsvRow column="vehicle" required="No" example="Toyota Aqua" description="Vehicle customer is interested in" />
              <CsvRow column="notes" required="No" example="Looking for 2021 model" description="Additional information" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Rules */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Import Rules</h2>

        <div className="mt-5 space-y-4">
          <Rule icon="✓" text="Only CSV files are accepted." />
          <Rule icon="✓" text="Name and phone number are required for every lead." />
          <Rule icon="✓" text="Duplicate phone numbers will not be imported." />
          <Rule
            icon="✓"
            text="Imported leads will automatically belong to your assigned region and be assigned to you."
          />
        </div>
      </div>

      {/* Recently Added Leads */}
      <div className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold text-gray-900">Recently Added Leads</h2>
          <p className="mt-1 text-sm text-gray-500">Leads you have created or imported.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                  Added
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {lead.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{lead.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDateTime(lead.createdAt)}
                  </td>
                </tr>
              ))}

              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-400">
                    You haven&apos;t added any leads yet.
                  </td>
                </tr>
              )}
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
        <code className="rounded bg-gray-100 px-2 py-1 text-xs">{column}</code>
      </td>

      <td className="px-6 py-4 text-sm">
        {required === "Yes" ? (
          <span className="font-medium text-red-600">Required</span>
        ) : (
          <span className="text-gray-500">Optional</span>
        )}
      </td>

      <td className="px-6 py-4 text-sm text-gray-600">{example}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{description}</td>
    </tr>
  );
}

function Rule({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs text-green-600">
        {icon}
      </span>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
