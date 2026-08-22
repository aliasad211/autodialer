"use client";

import { useState } from "react";

export default function AgentProfilePage() {
  const [name, setName] = useState("Ali Asad");
  const [phone, setPhone] = useState("0300-1234567");
  const [email, setEmail] = useState("ali@company.com");

  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Profile & Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your profile and calling preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            AA
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Sales Agent
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

              <span className="text-sm text-green-600">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your account information.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role
            </label>

            <input
              value="Sales Agent"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>

          {/* Region */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Assigned Region
            </label>

            <input
              value="Islamabad"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />

            <p className="mt-1 text-xs text-gray-400">
              Region can only be changed by an admin.
            </p>
          </div>

          {/* Agent ID */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Agent ID
            </label>

            <input
              value="AGT-00124"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800">
            Save Changes
          </button>
        </div>
      </div>

      {/* Calling Preferences */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Calling Preferences
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Configure how your calling interface behaves.
        </p>

        <div className="mt-6 divide-y">
          {/* Call Sound */}
          <SettingRow
            title="Call Sound"
            description="Play a sound when a call connects or ends."
            enabled={sound}
            onChange={() => setSound(!sound)}
          />

          {/* Notifications */}
          <SettingRow
            title="Notifications"
            description="Receive notifications about follow-ups and new leads."
            enabled={notifications}
            onChange={() =>
              setNotifications(!notifications)
            }
          />
        </div>
      </div>

      {/* Security */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">
          Security
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account security.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Password
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Change your account password.
            </p>
          </div>

          <button className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Change Password
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Active Session
            </p>

            <p className="mt-1 text-sm text-gray-500">
              You are currently logged in from this device.
            </p>
          </div>

          <button className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
            Logout
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Account
        </h2>

        <p className="mt-1 text-sm text-red-600">
          Contact your administrator if you need to deactivate
          your agent account.
        </p>
      </div>
    </div>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-medium text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>

      <button
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-gray-900" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}