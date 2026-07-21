import { useState, useEffect, useRef } from "react";
import "./App.css";

// =============================================================================
// DATA
// =============================================================================

const BOOKS = [
  {
    id: 1,
    src: "/book-1.png",
    fallback: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=700&fit=crop",
    title: "Don't Wait: Paperback",
    genre: "Philosophy & Leadership",
    year: "2024",
  },
  {
    id: 2,
    src: "/book-2.png",
    fallback: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop",
    title: "The Anatomy of Choice",
    genre: "Behavioral Science",
    year: "2024",
  },
  {
    id: 3,
    src: "/book-3.png",
    fallback: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&h=700&fit=crop",
    title: "Standing in your Truth",
    genre: "Self-Realization",
    year: "2024",
  },
];

const FEATURED = [
  {
    num: "I",
    title: "Shunyata",
    author: "Emptiness & Freedom",
    tag: "Core Theme",
    desc: "In Simple terms, emptiness in Buddhist philosophy is the undifferentiation out of which all apparent entities arise. It is used to express that everything in life is interrelated and mutually dependent. Give up the fight with emptiness to experience freedom.",
  },
  {
    num: "II",
    title: "Bardo",
    author: "Transition & Oscillation",
    tag: "Core Theme",
    desc: "A Tibetan word meaning transition from one situation to the next. We live in a Bardo realm, the constant oscillation between clarity and confusion, bewilderment and insight, sanity and insanity etc.",
  },
  {
    num: "III",
    title: "enkrateia",
    author: "Power Over Oneself",
    tag: "Core Theme",
    desc: "Literally meaning power over oneself. Designing your future actions, reducing the friction of starting good behaviours and using it to find your north star. There is no when and where, only here and now.",
  },
];

const NAV_LINKS = [
  { label: "The Book",    target: "hero"   },
  { label: "About",       target: "about"  },
  { label: "Core Themes", target: "themes" },
  { label: "FAQ",         target: "faq"    },
  { label: "Author",      target: "author" },
  { label: "Order",       target: "buy"    },
];

const STATS = [
  { end: 25,  suffix: "+",  label: "Years of Experience", duration: 2.2 },
  { end: 100, suffix: "k+", label: "Lives Impacted",      duration: 2.8 },
];

const TEACHINGS = [
  {
    num: "01",
    title: "Ichigo ichie",
    desc: "One question from my daughter that made me start my journey - “If you could do one thing you wanted to, what would you do”?",
  },
  {
    num: "02",
    title: "It whispered",
    desc: "Acknowledging the concept of the present and integrating it across thoughts, actions and behaviours.",
  },
  {
    num: "03",
    title: "The pause",
    desc: "Realising what we foolishly search outside all our lives, was inside us all along.",
  },
  {
    num: "04",
    title: "The finite search for purpose",
    desc: "Fighting distractions, procrastination and uncertainty while building habits and taking decisions with intent.",
  },
  {
    num: "05",
    title: "The pursuit of passion",
    desc: "Passion lights up your soul, gives you something to build for life, all while challenging, intriguing and motivating you.",
  },
  {
    num: "06",
    title: "Moments of truth",
    desc: "Leading with kindness, generosity and integrity and most importantly, being true to oneself.",
  },
];

const FAQS = [
  {
    q: "What is the book \"Don't Wait\" about?",
    a: "Don't Wait is a profound guide to personal transformation, alignment, and standing in your own truth. The book explores the core idea that purpose is the only sustainable advantage in life. It bridges timeless philosophical concepts like Shunyata (interdependence) and Bardo (transition phases) with real-world applications to help readers find absolute clarity in the here and now.",
  },
  {
    q: "Does the book include practical frameworks, or is it purely philosophical?",
    a: "While the book draws beautifully from deep Eastern and Western philosophies, it is designed for real-world execution. Every chapter bridges profound concepts from Stoicism, Buddhism, and Indian mythological contexts and practical strategies to build intentional daily habits and clear executive hesitation.",
  },
  {
    q: "Is the book available in digital (E-Book) formats?",
    a: "Yes, \"Don't Wait\" is accessible across digital platforms, including Kindle, allowing you to download and read the book instantly on any e-reader or mobile device.",
  },
  {
    q: "How long does it take to see the impact of implementing these principles?",
    a: "The book is structured around the concept of tackling uncertainties of life, being generous and showing integrity whenever possible. All of this when implemented with earnest intentions, results will follow surely.",
  },
];

// =============================================================================
// ANIMATED COUNTER HOOK
// =============================================================================

function useCountUp(end, duration) {
  const [count, setCount]    = useState(0);
  const [triggered, setTrig] = useState(false);
  const ref                  = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTrig(true); observer.disconnect(); } },
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    const ms             = duration * 1000;
    let   start          = null;
    const easeOutCubic   = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (!start) start  = ts;
      const p            = Math.min((ts - start) / ms, 1);
      setCount(Math.round(easeOutCubic(p) * end));
      if (p < 1) requestAnimationFrame(tick);
      else       setCount(end);
    };
    requestAnimationFrame(tick);
  }, [triggered, end, duration]);

  return { count, ref };
}

function AnimatedStat({ end, suffix, label, duration }) {
  const { count, ref } = useCountUp(end, duration);
  return (
    <div ref={ref}>
      <span className="stat-num">
        {count}<span style={{ fontSize: "0.75em" }}>{suffix}</span>
      </span>
      <span className="stat-lbl">{label}</span>
    </div>
  );
}

// =============================================================================
// ICONS
// =============================================================================

const Prev = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const Next = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// =============================================================================
// 3D SCROLL BOOK COMPONENT
// =============================================================================

function ScrollBook({ progress }) {
  // Leaf 1 flips from 0 to -180 between progress 0.30 and 0.45
  const r1 = progress < 0.30
    ? 0
    : (progress > 0.45 ? -180 : ((progress - 0.30) / 0.15) * -180);
  
  // Leaf 2 flips from 0 to -180 between progress 0.60 and 0.75
  const r2 = progress < 0.60
    ? 0
    : (progress > 0.75 ? -180 : ((progress - 0.60) / 0.15) * -180);

  // Leaf 3 flips from 0 to -180 between progress 0.85 and 0.95
  const r3 = progress < 0.85
    ? 0
    : (progress > 0.95 ? -180 : ((progress - 0.85) / 0.10) * -180);

  // Determine dynamic z-indices to handle overlapping correctly during flips.
  const z1 = r1 > -90 ? 30 : 10;
  const z2 = 20; // Leaf 2 is always in the middle
  const z3 = r3 > -90 ? 10 : 30;

  // Calculate horizontal translation to center the active page spread or cover.
  let tx = 0;
  if (progress < 0.30) {
    tx = -25;
  } else if (progress <= 0.45) {
    const p = (progress - 0.30) / 0.15;
    tx = -25 * (1 - p);
  } else if (progress <= 0.85) {
    tx = 0;
  } else if (progress <= 0.95) {
    const p = (progress - 0.85) / 0.10;
    tx = 25 * p;
  } else {
    tx = 25;
  }

  return (
    <div className="book-container">
      <div 
        className="book-3d"
        style={{
          transform: `translateX(${tx}%)`
        }}
      >
        
        {/* Leaf 1 (Front Cover & Page 2) */}
        <div 
          className="book-leaf" 
          style={{ 
            transform: `rotateY(${r1}deg)`,
            zIndex: z1
          }}
        >
          {/* Page 1: Front Cover */}
          <div className="book-page page-front cover-front">
            <img 
              src="/book-cover-front.png" 
              alt="Front Cover" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback">
              <div className="cover-inner">
                <span className="cover-eyebrow">New Release</span>
                <h2 className="cover-title">DON'T WAIT</h2>
                <div className="cover-spine-line" />
                <p className="cover-author">Dr. Shibani Belwalkar</p>
                <div className="cover-decor">★</div>
              </div>
            </div>
          </div>
          
          {/* Page 2: Inside Left (Spread 1 Left) */}
          <div className="book-page page-back page-inside-left">
            <img 
              src="/book-page-2.png" 
              alt="Page 2" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback" style={{ padding: "1.8rem 1.6rem" }}>
              <div className="page-content" style={{ transform: "none", height: "100%", justifyContent: "space-between" }}>
                <div>
                  <span className="page-num" style={{ fontSize: "11px" }}>02</span>
                  <p style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--accent)",
                    marginBottom: "0.8rem",
                    marginTop: "0.2rem"
                  }}>About the Book</p>
                  <p style={{ fontSize: "10.5px", lineHeight: "1.5", fontStyle: "normal", color: "var(--ink-soft)" }}>
                    The pursuit of one's purpose in life and its actual realisation have one thing in common, and that is time. You can either choose to wait and discover what is at times an elusive vision, or instead be intentional about making every moment in life purposeful and make it count for something.
                  </p>
                </div>
                <div className="page-footer" style={{ fontSize: "9px" }}>About the Book I</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaf 2 (Page 3 & Page 4) */}
        <div 
          className="book-leaf" 
          style={{ 
            transform: `rotateY(${r2}deg)`,
            zIndex: z2
          }}
        >
          {/* Page 3: Inside Right (Spread 1 Right) */}
          <div className="book-page page-front page-inside-right">
            <img 
              src="/book-page-3.png" 
              alt="Page 3" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback" style={{ padding: "1.8rem 1.6rem" }}>
              <div className="page-content" style={{ transform: "none", height: "100%", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "15px", lineHeight: "1.25", marginBottom: "0.8rem", textAlign: "right" }}>
                    An Unusual<br />
                    <em style={{ fontStyle: "italic", fontWeight: "400" }}>Adventure</em>
                  </h3>
                  <p style={{ fontSize: "10px", lineHeight: "1.4", fontStyle: "normal", color: "var(--ink-soft)", textAlign: "right", marginBottom: "0.4rem" }}>
                    Join me as I wade through the peculiar waters of life in search of my own reason for being. This is an unusual adventure-filled undertaking that capitalises on the quality of fact and fiction, humour and science, logic and the surreal in order to lay bare the internal choices we make daily.
                  </p>
                  <p style={{ fontSize: "10px", lineHeight: "1.4", fontStyle: "normal", color: "var(--ink-soft)", textAlign: "right" }}>
                    And as passion and duty collide, I hope that this incredible journey of self-reflection will impart meaningful lessons that will transform your perspective on life. After all, the journey is as important as the destination!
                  </p>
                </div>
                <div className="page-footer" style={{ fontSize: "9px", textAlign: "right" }}>About the Book II</div>
              </div>
            </div>
          </div>

          {/* Page 4: Inside Left (Spread 2 Left) */}
          <div className="book-page page-back page-inside-left">
            <img 
              src="/book-page-4.png" 
              alt="Page 4" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback" style={{ padding: "1.8rem 1.6rem" }}>
              <div className="page-content" style={{ transform: "none", height: "100%", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "14px", lineHeight: "1.25", marginBottom: "0.8rem" }}>
                    Pause and ponder<br />
                    <em style={{ fontStyle: "italic", fontWeight: "400" }}>these questions:</em>
                  </h3>
                  <ul style={{ 
                    fontSize: "10px", 
                    lineHeight: "1.4", 
                    color: "var(--ink-soft)", 
                    listStyleType: "none",
                    padding: 0,
                    margin: "0.3rem 0 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.45rem"
                  }}>
                    <li style={{ display: "flex", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>Have we acknowledged and accepted the concept of the present?</span>
                    </li>
                    <li style={{ display: "flex", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>Have we integrated it with our thoughts, actions and behaviours?</span>
                    </li>
                    <li style={{ display: "flex", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>What is your why?</span>
                    </li>
                  </ul>
                </div>
                <div className="page-footer" style={{ fontSize: "9px" }}>Pause & Ponder I</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaf 3 (Page 5 & Back Cover) */}
        <div 
          className="book-leaf" 
          style={{ 
            transform: `rotateY(${r3}deg)`,
            zIndex: z3
          }}
        >
          {/* Page 5: Inside Right (Spread 2 Right) */}
          <div className="book-page page-front page-inside-right">
            <img 
              src="/book-page-5.png" 
              alt="Page 5" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback" style={{ padding: "1.8rem 1.6rem" }}>
              <div className="page-content" style={{ transform: "none", height: "100%", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: "14px", lineHeight: "1.25", marginBottom: "0.8rem", textAlign: "right" }}>
                    Pause and ponder<br />
                    <em style={{ fontStyle: "italic", fontWeight: "400" }}>these questions:</em>
                  </h3>
                  <ul style={{ 
                    fontSize: "10px", 
                    lineHeight: "1.4", 
                    color: "var(--ink-soft)", 
                    textAlign: "right", 
                    listStyleType: "none",
                    padding: 0,
                    margin: "0.3rem 0 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.45rem"
                  }}>
                    <li style={{ display: "flex", flexDirection: "row-reverse", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>What purpose do you pursue?</span>
                    </li>
                    <li style={{ display: "flex", flexDirection: "row-reverse", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>What rung are we on the ladder of integrity?</span>
                    </li>
                    <li style={{ display: "flex", flexDirection: "row-reverse", gap: "0.35rem", alignItems: "flex-start" }}>
                      <span style={{ color: "var(--accent)", fontWeight: "bold" }}>•</span>
                      <span>Do we practice integrity in form and spirit?</span>
                    </li>
                  </ul>
                </div>
                <div className="page-footer" style={{ fontSize: "9px", textAlign: "right" }}>Pause & Ponder II</div>
              </div>
            </div>
          </div>

          {/* Page 6: Back Cover */}
          <div className="book-page page-back cover-back">
            <img 
              src="/book-cover-back.png" 
              alt="Back Cover" 
              className="book-page-image" 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="book-page-fallback">
              <div className="cover-inner">
                <div className="cover-back-logo">S</div>
                <p className="cover-back-blurb">
                  "Purpose is not something you find. It is something you anchor."
                </p>
                <div className="cover-back-footer">
                  <span>Dr. Shibani Belwalkar</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shadow layer underneath the book */}
        <div className="book-shadow" />
      </div>
    </div>
  );
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div 
      style={{
        border: "1px solid var(--warm-rule, #e5ded6)",
        borderRadius: "12px",
        background: open ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.6)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: open ? "0 8px 25px rgba(0,0,0,0.05)" : "none"
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "1.5rem 1.8rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--f-serif, serif)",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "var(--ink, #1f1d1b)",
          gap: "1.5rem"
        }}
      >
        <span style={{ lineHeight: "1.4" }}>{question}</span>
        <span 
          style={{ 
            fontSize: "1.5rem", 
            transition: "transform 0.3s ease", 
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: "var(--accent, #c86d4b)",
            lineHeight: "1",
            flexShrink: 0
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div style={{ padding: "0 1.8rem 1.6rem 1.8rem" }}>
          <p style={{ 
            fontSize: "0.98rem", 
            lineHeight: "1.65", 
            color: "var(--ink-soft, #55504a)",
            fontFamily: "var(--f-body, sans-serif)",
            margin: 0
          }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PAGE
// =============================================================================

export default function BookShowcase() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const [progress, setProgress] = useState(0);
  const aboutRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [subscribed, setSubscribed] = useState(false);
  const [subEmail, setSubEmail] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const heroSlides = ["/hero-slide-1.jpg", "/hero-slide-2.jpg", "/hero-slide-3.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let animId;
    const tick = () => {
      // Lerp calculations for ultra-smooth scroll progression.
      // Easing speed coefficient (0.055) slows down transitions and adds inertia.
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.055;
        setProgress(currentProgressRef.current);
      } else {
        currentProgressRef.current = targetProgressRef.current;
        setProgress(targetProgressRef.current);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return;
      const rect = aboutRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const totalScrollRange = rect.height - viewportHeight;
      if (totalScrollRange <= 0) return;
      
      // rect.top is 0 when the section hits the top of viewport and starts pinning.
      // rect.top is -totalScrollRange when pinning ends.
      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollRange;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));
      targetProgressRef.current = clampedProgress;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav className="nav">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); scrollTo("hero"); }}>
          Don't Wait <span className="nav-logo-dot" />
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map((l) => (
            <li key={l.label}>
              <a href={`#${l.target}`} onClick={(e) => { e.preventDefault(); scrollTo(l.target); }}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button className="nav-cta" onClick={() => scrollTo("buy")}>Order Now</button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hero-scroll-container" id="hero">
        <div className="hero-sticky-content">
          <div className="hero-left">
            <div className="hero-bg-glyph">S</div>



            <h1 className="hero-h1">
              Purpose is the only sustainable advantage
            </h1>

            <p className="hero-body">
              Those who anchor themselves to a deeper purpose don't just
              survive, they thrive. They lead with clarity, decide with conviction,
              and build with unshakable awareness.{" "}
              <em>Don't Wait</em> is your guide to that inner axis.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo("buy")}>
                Get the Book (₹350)
              </button>
              <button className="btn-text" onClick={() => scrollTo("about")}>
                About the Book <span className="arrow">→</span>
              </button>
            </div>

            <div className="hero-stats">
              {STATS.map((stat) => (
                <AnimatedStat key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-slider-container">
              <div className="hero-slider-track">
                {heroSlides.map((src, index) => (
                  <div 
                    key={src}
                    className={`hero-slide ${index === activeSlide ? "active" : ""}`}
                  >
                    <img 
                      src={src} 
                      alt={`Don't Wait Book Mockup ${index + 1}`} 
                      className="hero-slide-img"
                    />
                  </div>
                ))}
              </div>
              <div className="hero-slider-dots">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-slider-dot ${index === activeSlide ? "active" : ""}`}
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT THE BOOK ───────────────────────────────────────────────── */}
      <section id="about" ref={aboutRef}>
        <div className="about-sticky-content">
          <div 
            onClick={() => {
              const cur = targetProgressRef.current;
              if (cur < 0.20) {
                targetProgressRef.current = 0.45; // Go to Spread 1 (Pages 2 & 3)
              } else if (cur < 0.60) {
                targetProgressRef.current = 0.75; // Go to Spread 2 (Pages 4 & 5)
              } else if (cur < 0.88) {
                targetProgressRef.current = 0.98; // Go to Back Cover
              } else {
                targetProgressRef.current = 0.0;  // Go to Front Cover
              }
            }}
            style={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}
            title="Click/tap the book to turn pages"
          >
            <ScrollBook progress={progress} />
          </div>
        </div>
      </section>

      {/* ── WHAT WILL THIS BOOK TEACH YOU ────────────────────────────────── */}
      <section id="teaches">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "3.5rem" }}>
            <p
              style={{
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: "1.2rem",
              }}
            >
              WHAT'S INSIDE:
            </p>
            <h2
              style={{
                fontSize: "clamp(36px, 4.5vw, 52px)",
                fontWeight: "600",
                lineHeight: "1.15",
                color: "var(--color-text-primary)",
                maxWidth: "540px",
              }}
            >
              A TASTE OF THE CHAPTERS
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: "1px",
              background: "var(--color-border-tertiary, #ddd6ce)",
              border: "1px solid var(--color-border-tertiary, #ddd6ce)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {TEACHINGS.map((t) => (
              <div
                key={t.num}
                style={{
                  background: "var(--color-background-secondary, #f7f4f0)",
                  padding: "2.5rem 2.2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.2rem",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-background-primary, #ffffff)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "var(--color-background-secondary, #f7f4f0)";
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "400",
                    letterSpacing: "0.05em",
                    color: "var(--accent)",
                    fontFamily: "var(--f-display)",
                    fontStyle: "italic",
                  }}
                >
                  {t.num}
                </span>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "var(--color-text-primary)",
                    lineHeight: "1.3",
                    margin: 0,
                  }}
                >
                  {t.title}
                </p>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.75",
                    color: "var(--color-text-secondary, #9a928a)",
                    margin: 0,
                  }}
                >
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE THEMES ──────────────────────────────────────────────────── */}
      <section className="section-featured" id="themes">
        <div className="sec-head">
          <div>
            <h2 className="sec-title">Core Themes</h2>
            <p className="sec-kicker" style={{ marginTop: "0.4rem" }}>The Journey Within</p>
          </div>
        </div>

        <div className="feat-list">
          {FEATURED.map((b) => (
            <div className="feat-row" key={b.num}>
              <span className="f-num">{b.num}</span>
              <div>
                <p className="f-title">{b.title}</p>
                <p className="f-author">{b.author}</p>
              </div>
              <p className="f-desc">{b.desc}</p>
              <span className="f-tag">{b.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQS ─────────────────────────────────────────────────────────── */}
      <section className="section-faq" id="faq" style={{ padding: "5rem 2rem", background: "var(--bg-card, #f7f4f0)", borderTop: "1px solid var(--warm-rule, #e5ded6)", borderBottom: "1px solid var(--warm-rule, #e5ded6)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="sec-head" style={{ marginBottom: "2.5rem" }}>
            <div>
              <h2 className="sec-title" style={{ fontSize: "clamp(32px, 4vw, 44px)" }}>Frequently Asked Questions</h2>
              <p className="sec-kicker" style={{ marginTop: "0.4rem" }}>Everything you need to know about Don't Wait</p>
            </div>
          </div>

          <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQS.map((faq, idx) => (
              <FaqItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AUTHOR ───────────────────────────────────────────────────────── */}
      <section className="section-author" id="author">
        <div className="author-content">
          <span className="author-section-kicker">About the Author</span>
          <h2 className="author-name">Dr. Shibani Belwalkar</h2>
          <p className="author-bio">
            Dr Shibani is an Organisational Culture Transformation Expert and Leadership Coach at Theory of Purpose, her own Learning and Development boutique. For over two decades, she has worked with high-growth leaders and organisations across the world with multiple industries, from FMCG, IT, Pharmaceuticals, to Manufacturing and telecom, to name a few, helping them understand that lasting culture change begins with individual consciousness.
          </p>
          <p className="author-bio">
            She holds a PhD and serves as the Head of Executive Education at SDA Bocconi, one of Europe's leading business schools. Her multicultural background, African and Indian heritage directly reflected in her work. She draws on Eastern philosophy and integrates it with Western organisational science and neuroscience. This isn't cultural tourism. It's her lived experience, brought into every framework she teaches.
          </p>
        </div>
        <div className="author-showcase">
          <div className="author-img-wrapper">
            <img
              src="/author_cropped.jpg"
              alt="Dr. Shibani Belwalkar"
              loading="lazy"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&fit=crop";
              }}
            />
          </div>
        </div>
      </section>

      {/* ── QUOTE BAND ───────────────────────────────────────────────────── */}
      <div className="quote-band">
        <p className="q-text">
          Ultimately, the deepest mastery is realising that the battlefield is
          never outside; it is always within. When nothing inside trembles,
          nothing outside threatens.
        </p>
        <p className="q-attr">Dr. Shibani Belwalkar</p>
      </div>

      {/* ── BUY SECTION ──────────────────────────────────────────────────── */}
      <section
        id="buy"
        style={{
          background: "#1a1410",
          padding: "12rem 2rem", /* Shifted more downwards and extended padding */
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#6b5f56",
            marginBottom: "1.25rem",
          }}
        >
          Available Now
        </p>

        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 46px)",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#f0ebe3",
            marginBottom: "3rem",
            maxWidth: "700px",
            margin: "0 auto 3rem",
            lineHeight: "1.2",
          }}
        >
          Get Your Copy of Don't Wait
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          {[
            { label: "Amazon India",  href: "https://www.amazon.in/Dont-Wait-Shibani/dp/B0BTT2Y55J" },
            { label: "Flipkart",      href: "https://www.flipkart.com/don-t-wait/p/itmf8320aba391e1" },
            { label: "Notion Press",  href: "https://notionpress.com/in/read/don-t-wait?srsltid=AfmBOoo1pNDa04KNX_VYLzygNtzUH7RX5nxUnBiJ81SqkJs7iFqjgXx9"  },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 2.25rem",
                background: "#f0ebe3",
                color: "#1a1410",
                borderRadius: "50px",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "all 0.2s ease",
                border: "1.5px solid #f0ebe3",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color       = "#f0ebe3";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f0ebe3";
                e.currentTarget.style.color       = "#1a1410";
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.75rem",
            padding: "1rem 2rem",
            border: "0.5px solid #3a302a",
            borderRadius: "4px",
          }}
        >
          <span
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#f0ebe3",
            }}
          >
            ₹350
          </span>
          <span
            style={{
              fontSize: "16px",
              color: "#6b5f56",
              textDecoration: "line-through",
            }}
          >
            ₹499
          </span>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#8b7a6e",
              marginLeft: "0.25rem",
            }}
          >
            · Paperback
          </span>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-top">
          <div>

            {subscribed ? (
              <p style={{ color: "var(--accent)", fontSize: "12px", marginTop: "10px", fontWeight: "600" }}>
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form
                className="f-newsletter"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (subEmail) {
                    setSubscribed(true);
                  }
                }}
              >
                <input
                  className="f-input"
                  type="email"
                  placeholder="Your email address"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  required
                />
                <button className="f-sub-btn" type="submit">Subscribe</button>
              </form>
            )}
            <p style={{ fontSize: "10px", color: "#9a928a", marginTop: "6px", fontStyle: "italic" }}>
              Join the newsletter for reflections & updates.
            </p>
          </div>

          {[
            { head: "Get the Book", links: ["Amazon India", "Flipkart", "Notion Press"] },
            { head: "The Author",   links: ["About Dr. Shibani"] },
            { head: "Connect",      links: ["LinkedIn", "Contact", "Theory of Purpose"] },
          ].map((col) => (
            <div key={col.head}>
              <p className="f-col-head">{col.head}</p>
              <ul className="f-links">
                {col.links.map((l) => {
                  const linksMap = {
                    "Amazon India": "https://www.amazon.in/Dont-Wait-Shibani/dp/B0BTT2Y55J",
                    "Flipkart": "https://www.flipkart.com/don-t-wait/p/itmf8320aba391e1",
                    "Notion Press": "https://notionpress.com/in/read/don-t-wait?srsltid=AfmBOoo1pNDa04KNX_VYLzygNtzUH7RX5nxUnBiJ81SqkJs7iFqjgXx9",
                    "About Dr. Shibani": "#author",
                    "LinkedIn": "https://www.linkedin.com/in/shibanibelwalkar/",
                    "Contact": "mailto:info@shibanibelwalkar.com",
                    "Theory of Purpose": "https://theoryofpurpose.com/",
                  };
                  const href = linksMap[l];
                  if (href) {
                    const isAnchor = href.startsWith('#');
                    const isMail = href.startsWith('mailto:');
                    return (
                      <li key={l}>
                        <a 
                          href={href} 
                          target={isAnchor || isMail ? undefined : "_blank"} 
                          rel={isAnchor || isMail ? undefined : "noreferrer"}
                          onClick={isAnchor ? (e) => { e.preventDefault(); scrollTo(href.substring(1)); } : undefined}
                        >
                          {l}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={l}>
                      <a href="#" onClick={(e) => e.preventDefault()}>{l}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <ul className="f-legal">
            {["Privacy Policy", "Terms of Use", "Cookies"].map((l) => (
              <li key={l}>
                <a href="#" onClick={(e) => e.preventDefault()}>{l}</a>
              </li>
            ))}
          </ul>
          <p className="f-copy">© 2026 Dr. Shibani Belwalkar. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}