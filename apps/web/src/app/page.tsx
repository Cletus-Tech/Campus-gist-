const highlights = [
  { label: "Campus news", detail: "Verified updates and breaking campus stories", icon: "01" },
  { label: "Campus Power Update", detail: "See the latest hostel electricity reports", icon: "02" },
  { label: "Student community", detail: "Connect, share and stay informed", icon: "03" },
  { label: "Accommodation", detail: "Explore student housing around campus", icon: "04" },
];

export default function HomePage() {
  return (
    <main className="site-shell">
      <nav className="topbar">
        <a className="brand" href="/" aria-label="Campus Gist home">
          <span className="brand-mark">CG</span>
          <span>CAMPUS <b>GIST</b></span>
        </a>
        <div className="nav-links">
          <a href="#features">Explore</a>
          <a href="#about">About</a>
          <a className="nav-cta" href="#get-started">Get started <span>↗</span></a>
        </div>
      </nav>

      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> BUILT AROUND CAMPUS LIFE</div>
          <h1>Everything campus.<br /><em>One platform.</em></h1>
          <p className="hero-text">
            Your campus, connected. Get the latest gist, stay on top of important updates,
            find your people and make campus life easier.
          </p>
          <div className="hero-actions" id="get-started">
            <a className="button button-primary" href="#features">Explore Campus Gist <span>↗</span></a>
            <a className="button button-quiet" href="#about">Discover the platform</a>
          </div>
          <div className="hero-meta"><span>01</span> FIRST CAMPUS: FUTA, AKURE <i /> MORE CAMPUSES TO COME</div>
        </div>
        <div className="hero-art" aria-label="Campus Gist platform preview">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="glass-card card-main">
            <div className="card-top"><span className="mini-brand">CG</span><span className="live-tag">● CAMPUS LIVE</span></div>
            <div className="card-kicker">YOUR CAMPUS, RIGHT NOW</div>
            <div className="card-headline">The latest from<br />around campus.</div>
            <div className="feed-line"><span className="feed-dot dot-green" /><div><b>Campus Power Update</b><small>Hostel reports · Updated moments ago</small></div><strong>↗</strong></div>
            <div className="feed-line"><span className="feed-dot dot-blue" /><div><b>Campus Gist</b><small>News, events and student stories</small></div><strong>↗</strong></div>
            <div className="card-footer"><span>FUTA · AKURE</span><span>EVERYTHING CAMPUS.</span></div>
          </div>
          <div className="floating-chip chip-top"><span>✦</span> One campus community</div>
          <div className="floating-chip chip-bottom"><span className="chip-live" /> Updates that matter</div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-heading">
          <div><div className="eyebrow">WHAT'S INSIDE</div><h2>Campus life, <em>in one place.</em></h2></div>
          <p>From the important updates to the everyday moments, the things you need are coming together here.</p>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => (
            <article className="feature-card" key={item.label}>
              <span className="feature-number">{item.icon}</span>
              <div><h3>{item.label}</h3><p>{item.detail}</p></div>
              <span className="feature-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>
      <footer><a className="brand footer-brand" href="/"><span className="brand-mark">CG</span><span>CAMPUS <b>GIST</b></span></a><span>EVERYTHING CAMPUS. ONE PLATFORM.</span><span>© {new Date().getFullYear()} Campus Gist</span></footer>
    </main>
  );
}
