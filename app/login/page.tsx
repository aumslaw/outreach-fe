"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, Config, Session, api, setSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [config, setConfig] = useState<Config | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Config>("/config", { authed: false })
      .then(setConfig)
      .catch((e: ApiError) => setError(e.message));
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const s = await api<Session>("/session/password", {
        method: "POST",
        body: { username, password },
        authed: false,
      });
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
        Welcome <em>back.</em>
      </h1>
      {config?.pw_login ? (
        <form className="card" onSubmit={submit}>
          {config.ask_user && (
            <>
              <label htmlFor="user" className="muted">
                Your name
              </label>
              <input
                id="user"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                autoFocus
              />
            </>
          )}
          <label htmlFor="pw" className="muted">
            Password
          </label>
          <input
            id="pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus={!config.ask_user}
            required
          />
          {error && <p className="err">{error}</p>}
          <button className="btn primary" type="submit" disabled={busy}>
            Log in
          </button>
        </form>
      ) : (
        <div className="card">
          {error ? <p className="err">{error}</p> : config && <p>Open the private link you were given to sign in.</p>}
        </div>
      )}
    </>
  );
}
