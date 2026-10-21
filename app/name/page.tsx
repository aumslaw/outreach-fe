"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, Me, Session, api, getSession, setSession } from "@/lib/api";

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    api<Me>("/me")
      .then((me) => setName((n) => n || me.user))
      .catch(() => {});
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const s = await api<Session>("/name", { method: "POST", body: { name } });
      setSession(s.session);
      router.replace("/");
    } catch (err) {
      setError((err as ApiError).message);
      setBusy(false);
    }
  }

  return (
    <>
      <h1>
        What&apos;s your <em>name?</em>
      </h1>
      <form className="card" onSubmit={submit}>
        <label htmlFor="nm" className="muted">
          Shown as who sent each DM
        </label>
        <input
          id="nm"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoComplete="given-name"
          autoFocus
          required
        />
        {error && <p className="err">{error}</p>}
        <button className="btn primary" type="submit" disabled={busy}>
          Continue
        </button>
      </form>
    </>
  );
}
