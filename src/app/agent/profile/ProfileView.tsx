"use client";

import { useActionState } from "react";
import { initials } from "@/lib/format";
import { changePassword, updateProfileName } from "@/app/actions/profile";
import { logout } from "@/app/actions/auth";

type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "AGENT";
  status: "ACTIVE" | "INACTIVE";
  region: { name: string } | null;
};

export default function ProfileView({ user }: { user: User }) {
  const [nameState, nameAction, namePending] = useActionState(updateProfileName, undefined);
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePassword,
    undefined
  );

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your profile and account security.</p>
      </div>

      {/* Profile Card */}
      <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-900 text-2xl font-bold text-white">
            {initials(user.name)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <p className="mt-1 text-sm text-gray-500">Sales Agent</p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  user.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm ${user.status === "ACTIVE" ? "text-green-600" : "text-gray-500"}`}
              >
                {user.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <form action={nameAction} className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          <p className="mt-1 text-sm text-gray-500">Your account information.</p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              name="name"
              defaultValue={user.name}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              value={user.email}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <input
              value="Sales Agent"
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Assigned Region</label>
            <input
              value={user.region?.name ?? "Unassigned"}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-400">
              Region can only be changed by an admin.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Agent ID</label>
            <input
              value={user.id}
              disabled
              className="mt-2 w-full cursor-not-allowed rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        {nameState?.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {nameState.error}
          </p>
        )}

        {nameState?.success && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {nameState.success}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={namePending}
            className="rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {namePending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Security */}
      <form action={passwordAction} className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500">Update your account password.</p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              required
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {passwordState?.error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {passwordState.error}
          </p>
        )}

        {passwordState?.success && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            {passwordState.success}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={passwordPending}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {passwordPending ? "Updating..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Active Session */}
      <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Active Session</p>
          <p className="mt-1 text-sm text-gray-500">
            You are currently logged in from this device.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Account</h2>
        <p className="mt-1 text-sm text-red-600">
          Contact your administrator if you need to deactivate your agent account.
        </p>
      </div>
    </div>
  );
}
