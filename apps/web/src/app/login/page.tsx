"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(params.get("error") ? "Your confirmation link could not be completed. Please sign in or request a new link." : "");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setMessage(error.message); return; }
    window.location.assign(params.get("next") || "/dashboard");
  }
  return <main className="auth-layout"><section className="auth-card">
    <Link className="brand" href="/"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></Link>
    <div className="eyebrow auth-eyebrow">WELCOME BACK</div><h1>Good to have<br/><em>you here.</em></h1>
    <p className="auth-copy">Sign in to catch up with what is happening around your campus.</p>
    <form onSubmit={submit} className="auth-form">
      <label>Email address<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>
      {message && <p className="form-message" role="alert">{message}</p>}
      <button className="button button-primary auth-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"} <span>↗</span></button>
    </form>
    <p className="auth-switch">New to Campus Gist? <Link href="/signup">Create an account</Link></p>
  </section><aside className="auth-aside"><span className="aside-label">FUTA · AKURE</span><div><div className="aside-mark">CG</div><h2>Everything campus.<br/><em>One platform.</em></h2><p>Stay informed. Find your people. Make campus life easier.</p></div><span className="aside-foot">CAMPUS GIST · YOUR CAMPUS, CONNECTED</span></aside></main>;
}
