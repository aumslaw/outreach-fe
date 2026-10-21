"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, Session, api, setSession } from "@/lib/api";

export default function AccessPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    // the token is cleared from the URL on the first run, so a second (dev strict mode) run must not start over
    if (started.current) return;
    started.current = true;
    const token = window.location.hash.slice(1);
    window.history.replaceState(null, "", window.location.pathname);
    const exchange = token
      ? api<Session>("/session/link", { method: "POST", body: { token }, authed: false })
      : Promise.reject(new ApiError(404, ""));
    exchange
      .then((s) => {
        setSession(s.session);
        router.replace(s.user ? "/" : "/name");
      })
      .catch((e: ApiError) => {
        if (e.status === 429) setError("Too many tries. Wait a few minutes.");
        else if (e.status === 404) setError("This link doesn't work.");
        else setError(e.message);
      });
  }, [router]);

  return (
    <>
      <h1>
        Welcome <em>back.</em>
      </h1>
      <div className="card">{error ? <p className="err">{error}</p> : <p className="muted">Signing you in…</p>}</div>
    </>
  );
}
