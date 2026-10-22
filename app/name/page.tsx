"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, Config, Me, Session, api, getSession, setSession } from "@/lib/api";

export default function NamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [profiles, setProfiles] = useState<Config["profiles"]>();

  useEffect(() => {
    if (!getSession()) {
      router.replace("/login");
      return;
    }
    api<Me>("/me")
      .then((me) => setName((n) => n || me.user))
      .catch(() => {});
    api<Config>("/config", { authed: false })
      .then((c) => setProfiles(c.profiles || []))
      .catch(() => setProfiles([]));
  }, [router]);

  async function choose(who: string) {
    setBusy(true);
    setError("");
    try {
      const s = await api<Session>("/name", { method: "POST", body: { name: who } });
      setSession(s.session);
      router.replace("/");
    } catch (err) {
      setError((err as ApiError).message);
      setBusy(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    await choose(name);
  }

  const label = (p: string) => (p === "instagram" ? "Instagram" : p === "x" ? "X" : p);
  const cap = (n: string) => n.charAt(0).toUpperCase() + n.slice(1);

  if (profiles === undefined) {
    return (
      <>
        <h1>
          Who&apos;s <em>sending?</em>
        </h1>
        <div className="card">
          <p className="muted">Loading…</p>
        </div>
      </>
    );
  }

  if (profiles.length > 0) {
    return (
      <>
        <h1>
          Who&apos;s <em>sending?</em>
        </h1>
        <div className="card">
          <p className="muted">Pick your profile. You will only see DMs for your account.</p>
          {profiles.map((p) => (
            <button key={p.name} className="btn primary" type="button" disabled={busy} onClick={() => choose(cap(p.name))}>
              {cap(p.name)} · {label(p.platform)}
            </button>
          ))}
          {error && <p className="err">{error}</p>}
        </div>
      </>
    );
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
