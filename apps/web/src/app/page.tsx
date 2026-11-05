import Link from "next/link";

const highlights = [
  { label: "Campus news", detail: "Verified updates and breaking campus stories", number: "01" },
  { label: "Campus Power Update", detail: "Recent, community-sourced hostel electricity reports", number: "02" },
  { label: "Submit a campus tip", detail: "Send story leads to the editorial team for review", number: "03" },
  { label: "Student community", detail: "A connected home for campus life and useful services", number: "04" },
];

export default function HomePage() {
  return <main className="site-shell">
    <nav className="topbar"><Link className="brand" href="/" aria-label="Campus Gist home"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></Link><div className="nav-links"><a href="#features">Explore</a><a href="#about">About</a><Link className="nav-cta" href="/login">Sign in <span>↗</span></Link></div></nav>
    <section className="hero" id="about"><div className="hero-copy"><div className="eyebrow"><span className="pulse"/> BUILT AROUND CAMPUS LIFE</div><h1>Everything campus.<br/><em>One platform.</em></h1><p className="hero-text">Your campus, connected. Get trusted updates, stay on top of important campus information, and make student life easier.</p><div className="hero-actions"><Link className="button button-primary" href="/signup">Join Campus Gist <span>↗</span></Link><Link className="button button-quiet" href="/login">I already have an account</Link></div><div className="hero-meta"><span>01</span> FIRST CAMPUS: FUTA, AKURE <i/> MORE CAMPUSES TO COME</div></div>
      <div className="hero-art" aria-label="Campus Gist platform preview"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="glass-card card-main"><div className="card-top"><span className="mini-brand">CG</span><span className="live-tag">● CAMPUS LIVE</span></div><div className="card-kicker">YOUR CAMPUS, RIGHT NOW</div><div className="card-headline">The latest from<br/>around campus.</div><div className="feed-line"><span className="feed-dot dot-green"/><div><b>Campus Power Update</b><small>Recent hostel reports</small></div><strong>↗</strong></div><div className="feed-line"><span className="feed-dot dot-blue"/><div><b>Verified Campus News</b><small>Stories reviewed before publication</small></div><strong>↗</strong></div><div className="card-footer"><span>FUTA · AKURE</span><span>EVERYTHING CAMPUS.</span></div></div><div className="floating-chip chip-top"><span>✦</span> One campus community</div><div className="floating-chip chip-bottom"><span className="chip-live"/> Updates that matter</div></div>
    </section>
    <section className="features" id="features"><div className="section-heading"><div><div className="eyebrow">THE CAMPUS GIST EXPERIENCE</div><h2>Campus life, <em>in one place.</em></h2></div><p>Useful information first. Community trust always. Everything built around the real needs of campus life.</p></div><div className="feature-grid">{highlights.map(item=><article className="feature-card" key={item.number}><span className="feature-number">{item.number}</span><div><h3>{item.label}</h3><p>{item.detail}</p></div><span className="feature-arrow">↗</span></article>)}</div></section>
    <section className="closing-cta"><div><div className="eyebrow">START WITH YOUR CAMPUS</div><h2>Stay in the know.<br/><em>Be part of the story.</em></h2></div><Link className="button button-primary" href="/signup">Create your account ↗</Link></section>
    <footer><Link className="brand footer-brand" href="/"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></Link><span>EVERYTHING CAMPUS. ONE PLATFORM.</span><span>© {new Date().getFullYear()} Campus Gist</span></footer>
  </main>;
}
