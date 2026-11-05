import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { submitNewsTip, submitPowerReport } from "./actions";

type SearchParams = Promise<Record<string,string|string[]|undefined>>;
export default async function DashboardPage({searchParams}:{searchParams:SearchParams}) {
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const [{data:profile},{data:news},{data:power},{data:campusRoles},params]=await Promise.all([
    supabase.from("profiles").select("full_name,campus_id").eq("id",user.id).single(),
    supabase.from("news_posts").select("id,title,body,category,is_breaking,published_at,source_url").eq("status","published").order("published_at",{ascending:false}).limit(8),
    supabase.from("hostel_power_reports").select("id,hostel_name,status,note,reported_at,expires_at,is_confirmed").gt("expires_at",new Date().toISOString()).order("reported_at",{ascending:false}).limit(8),
    supabase.from("campus_roles").select("role").eq("user_id",user.id),
    searchParams
  ]);
  const campusId=profile?.campus_id;
  const {data:campus}=campusId?await supabase.from("campuses").select("name,city,state").eq("id",campusId).single():{data:null};
  const displayName=profile?.full_name?.split(" ")[0]||user.email?.split("@")[0]||"Student";
  const roles=campusRoles||[];
  const isAdmin=roles.some(r=>["super_admin","campus_admin","news_editor","moderator"].includes(r.role));
  const alert=typeof params.error==="string"?params.error:"";
  const statusLabel=(value:string)=>({electricity_available:"Electricity available",no_light:"No light",power_restored:"Power restored",power_interrupted:"Power interrupted"}[value]||value.replaceAll("_"," "));
  return <main className="dashboard-shell">
    <header className="dashboard-topbar"><Link className="brand" href="/"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></Link><nav><span className="campus-pill">{campus?.name||"Campus not selected"}</span>{isAdmin&&<Link href="/dashboard/admin">Admin</Link>}<form action="/auth/signout" method="post"><button className="text-button">Sign out</button></form></nav></header>
    <section className="dashboard-welcome"><div><div className="eyebrow">YOUR CAMPUS, RIGHT NOW</div><h1>Hello, {displayName}.</h1><p>{campus?.city?campus.city+", "+campus.state:"Your campus community"} — here is what is happening.</p></div><span className="welcome-date">CAMPUS GIST / LIVE FEED</span></section>
    {params.power==="sent"&&<p className="notice success">Your power update has been submitted.</p>}
    {params.tip==="sent"&&<p className="notice success">Your campus tip has been sent for review.</p>}
    {alert&&<p className="notice">We could not submit that item. Please check the details and try again.</p>}
    <section className="dashboard-grid">
      <div className="dashboard-main">
        <div className="section-title"><div><div className="eyebrow">STAY INFORMED</div><h2>Campus news</h2></div><span className="live-indicator">VERIFIED UPDATES</span></div>
        {news?.length?<div className="news-list">{news.map(item=><article className="news-item" key={item.id}><div className="news-meta"><span>{item.category}</span>{item.is_breaking&&<b>BREAKING</b>}<time>{item.published_at?new Date(item.published_at).toLocaleDateString("en-NG",{day:"numeric",month:"short"}):"Recently"}</time></div><h3>{item.title}</h3><p>{item.body.length>220?item.body.slice(0,220)+"…":item.body}</p>{item.source_url&&<a href={item.source_url} target="_blank" rel="noreferrer">View source ↗</a>}</article>)}</div>:<div className="empty-state"><h3>No published updates yet</h3><p>Campus news will appear here as verified stories are published.</p></div>}
        <div className="section-title power-heading"><div><div className="eyebrow">COMMUNITY-SOURCED</div><h2>Campus Power Update</h2></div><span className="live-indicator">RECENT REPORTS</span></div>
        {power?.length?<div className="power-list">{power.map(item=><article className="power-item" key={item.id}><span className="power-indicator"/><div><b>{item.hostel_name}</b><p>{statusLabel(item.status)}{item.note?" · "+item.note:""}</p><small>{new Date(item.reported_at).toLocaleString("en-NG",{dateStyle:"medium",timeStyle:"short"})} · {item.is_confirmed?"Confirmed":"Community report"}</small></div></article>)}</div>:<div className="empty-state compact"><p>No recent power reports. Be the first to share an update.</p></div>}
      </div>
      <aside className="dashboard-sidebar">
        <section className="action-card"><div className="eyebrow">HELP YOUR COMMUNITY</div><h3>Report power status</h3><p>Share a recent update for your hostel. Reports expire automatically to keep information fresh.</p><form action={submitPowerReport} className="stack-form"><label>Hostel name<input name="hostel_name" required placeholder="e.g. Jibowu Hall"/></label><label>Current status<select name="status" required defaultValue=""><option value="" disabled>Select status</option><option value="electricity_available">Electricity available</option><option value="no_light">No light</option><option value="power_restored">Power restored</option><option value="power_interrupted">Power interrupted</option></select></label><label>Extra detail <span className="optional">(optional)</span><textarea name="note" rows={2} maxLength={240} placeholder="Anything students should know?"/></label><button className="button button-primary">Submit update ↗</button></form></section>
        <section className="action-card tip-card"><div className="eyebrow">HAVE A STORY?</div><h3>Submit a campus tip</h3><p>Send a lead to the editorial team. Tips are reviewed before publication.</p><form action={submitNewsTip} className="stack-form"><label>Story headline<input name="title" required minLength={5} maxLength={140} placeholder="What happened?"/></label><label>What should we know?<textarea name="body" required minLength={10} maxLength={2000} rows={4} placeholder="Share the details and any source information…"/></label><button className="button button-outline">Send tip for review ↗</button></form></section>
      </aside>
    </section>
    <footer className="dashboard-footer"><span>© {new Date().getFullYear()} Campus Gist</span><span>Information may change. Check timestamps and confirmation labels.</span></footer>
  </main>;
}
