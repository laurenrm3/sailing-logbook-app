"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Nav() {
  const { data: session } = useSession();

  return (
    <nav className="border-b bg-white px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <Link href="/" className="font-semibold">
          ⛵ Sailing Logbook
        </Link>

        <div className="flex items-center gap-4 text-sm">
          {session ? (
            <>
              <Link href="/trips" className="hover:underline">
                Trips
              </Link>
              <Link href="/crew" className="hover:underline">
                Crew
              </Link>
              <Link
                href="/trips/new"
                className="rounded bg-slate-900 px-3 py-1.5 text-white"
              >
                New trip
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-slate-500 hover:underline"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:underline">
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
