"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Campus = { id: string; name: string };
export default function SignupPage() {
  const [campuses,setCampuses]=useState<Campus[]>([]);
  const [fullName,setFullName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [campusId,setCampusId]=useState("");
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [success,setSuccess]=useState(false);
  useEffect(()=>{ const supabase=createClient(); supabase.from("campuses").select("id,name").eq("is_active",true).order("name").then(({data})=>{const rows=(data||[]) as Campus[];setCampuses(rows);if(rows[0])setCampusId(rows[0].id);}); },[]);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage("");const supabase=createClient();const {error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:`${window.location.origin}/auth/callback`,data:{full_name:fullName,campus_id:campusId}}});setBusy(false);if(error){setMessage(error.message);return;}setSuccess(true);setMessage("Your account has been created. Check your email to confirm your address before signing in.");}
  return <main className="auth-layout"><section className="auth-card auth-card-wide">
    <Link className="brand" href="/"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></Link>
    <div className="eyebrow auth-eyebrow">JOIN YOUR CAMPUS</div><h1>Make campus<br/><em>feel connected.</em></h1><p className="auth-copy">Create your account to get trusted campus updates and useful student services in one place.</p>
    <form onSubmit={submit} className="auth-form">
      <label>Full name<input required value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your full name" autoComplete="name"/></label>
      <label>Campus<select required value={campusId} onChange={e=>setCampusId(e.target.value)}><option value="" disabled>{campuses.length?"Choose your campus":"Loading campuses…"}</option>{campuses.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email"/></label>
      <label>Password<input type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password"/></label>
      {message && <p className={success?"form-message success":"form-message"} role="status">{message}</p>}
      <button className="button button-primary auth-submit" disabled={busy||!campusId}>{busy?"Creating account…":"Create account"} <span>↗</span></button>
    </form><p className="auth-switch">Already registered? <Link href="/login">Sign in</Link></p>
  </section><aside className="auth-aside"><span className="aside-label">BUILT AROUND CAMPUS LIFE</span><div><div className="aside-mark">CG</div><h2>Your campus,<br/><em>right now.</em></h2><p>News, power updates and student stories — all in one reliable place.</p></div><span className="aside-foot">CAMPUS GIST · YOUR CAMPUS, CONNECTED</span></aside></main>;
}
