import { useState } from "react";
import DnaGame from "./DnaGame";

const KID_FONT = "'Mali', 'Instrument Sans', sans-serif";

function NavBar() {
  const links = [
    { label: "🏠 หน้าแรก", href: "#" },
    { label: "🎮 เกมทั้งหมด", href: "#games" },
    { label: "💡 เกี่ยวกับ", href: "#about" },
  ];

  return (
    <nav
      className="px-6 py-3 flex items-center justify-between flex-wrap gap-3"
      style={{ background: "rgba(255,255,255,0.9)", borderBottom: "2px solid #e0f2fe", backdropFilter: "blur(8px)" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: "linear-gradient(135deg, #38bdf8, #34d399)",
            fontSize: 22,
            boxShadow: "0 3px 0 rgba(13,148,136,0.4)",
          }}
        >
          🧬
        </div>
        <span style={{ fontFamily: KID_FONT, fontSize: 24, fontWeight: 700, color: "#0f172a" }}>Helixis</span>
        <span
          className="hidden sm:inline-block"
          style={{
            fontFamily: KID_FONT,
            fontSize: 13,
            fontWeight: 600,
            color: "#854d0e",
            background: "#fef9c3",
            border: "2px solid #fde047",
            borderRadius: 999,
            padding: "2px 12px",
          }}
        >
          วิทยาศาสตร์สนุกๆ ✨
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="transition-colors"
            style={{
              fontFamily: KID_FONT,
              fontSize: 16,
              fontWeight: 600,
              color: "#475569",
              padding: "6px 14px",
              borderRadius: 999,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

function HeroSection({ onPlay }: { onPlay: () => void }) {
  return (
    <section className="relative flex flex-col items-center text-center px-6 pt-20 pb-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 45% at 20% 20%, rgba(251,191,36,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 45% at 80% 30%, rgba(244,114,182,0.10) 0%, transparent 70%), radial-gradient(ellipse 70% 50% at 50% 90%, rgba(56,189,248,0.12) 0%, transparent 70%)" }} />

      <span className="animate-float hidden sm:block absolute" style={{ top: "16%", left: "10%", fontSize: 46 }}>🧬</span>
      <span className="animate-float hidden sm:block absolute" style={{ top: "30%", right: "12%", fontSize: 42, animationDelay: "1.2s" }}>🔬</span>
      <span className="animate-float hidden sm:block absolute" style={{ bottom: "20%", left: "16%", fontSize: 38, animationDelay: "2s" }}>🧪</span>
      <span className="animate-float hidden sm:block absolute" style={{ bottom: "26%", right: "18%", fontSize: 34, animationDelay: "0.6s" }}>⭐</span>

      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7"
        style={{ border: "2px solid #fde047", background: "#fefce8", fontFamily: KID_FONT, fontSize: 15, fontWeight: 600, color: "#854d0e" }}
      >
        🔬 สื่อการเรียนการสอนวิทยาศาสตร์
      </div>

      <h1 style={{ fontFamily: KID_FONT, fontSize: "clamp(2.6rem, 7vw, 4.8rem)", fontWeight: 700, color: "#1e293b", lineHeight: 1.25, marginBottom: "1.25rem" }}>
        เรียนรู้วิทยาศาสตร์
        <br />
        ผ่าน
        <span style={{ background: "linear-gradient(90deg, #0ea5e9, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          เกมสนุก
        </span>
        {" "}🎉
      </h1>

      <p style={{ fontFamily: KID_FONT, fontSize: 19, fontWeight: 500, color: "#64748b", maxWidth: 560, lineHeight: 1.8, marginBottom: "2.5rem" }}>
        สำรวจโลกแสนมหัศจรรย์ของ DNA และพันธุกรรม
        ผ่านเกมสนุกๆ 
      </p>

      <button
        type="button"
        onClick={onPlay}
        style={{
          padding: "18px 44px",
          borderRadius: 999,
          background: "linear-gradient(135deg, #38bdf8, #34d399)",
          color: "#ffffff",
          fontFamily: KID_FONT,
          fontWeight: 700,
          fontSize: 20,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 6px 0 #0d9488",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 9px 0 #0d9488";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 0 #0d9488";
        }}
      >
        เริ่มเล่นเกมเลย! 🚀
      </button>

      <p style={{ fontFamily: KID_FONT, fontSize: 15, fontWeight: 500, color: "#94a3b8", marginTop: 18 }}>
        ไม่ต้องสมัคร เข้ามาเล่นได้เลย ฟรี! 😊
      </p>
    </section>
  );
}

function GamesSection({ onPlay }: { onPlay: () => void }) {
  const games = [
    {
      emoji: "🧫",
      title: "จับคู่โครโมโซม",
      desc: "ส่องกล้องจุลทรรศน์แบบนักวิทยาศาสตร์ตัวจริง จับคู่โครโมโซมทั้ง 23 คู่ ให้ครบและถูกต้องทุกคู่!",
      level: "ทุกระดับชั้น",
      color: "#0ea5e9",
      tint: "#e0f2fe",
    },
  ];

  return (
    <section id="games" className="px-6 py-16">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="mb-10 text-center">
          <h2 style={{ fontFamily: KID_FONT, fontSize: 38, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
            🎮 เลือกกิจกรรมที่อยากเล่น
          </h2>
          <p style={{ fontFamily: KID_FONT, fontSize: 17, fontWeight: 500, color: "#64748b" }}>
            กดเลือกเกมที่ชอบ แล้วมาสนุกไปด้วยกันเลย!
          </p>
        </div>

        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {games.map((g) => (
            <div
              key={g.title}
              className="cursor-pointer transition-all duration-200"
              style={{
                background: "#ffffff",
                border: `2px solid #e2e8f0`,
                borderRadius: 28,
                padding: 28,
                textAlign: "center",
                boxShadow: "0 4px 0 rgba(15,23,42,0.06)",
              }}
              onClick={onPlay}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = g.color;
                e.currentTarget.style.boxShadow = "0 14px 28px rgba(14,165,233,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "0 4px 0 rgba(15,23,42,0.06)";
              }}
            >
              <div
                className="inline-flex items-center justify-center"
                style={{ width: 92, height: 92, borderRadius: 999, background: g.tint, fontSize: 50, marginBottom: 16 }}
              >
                {g.emoji}
              </div>
              <div className="mb-3">
                <span
                  style={{
                    fontFamily: KID_FONT,
                    fontSize: 13,
                    fontWeight: 600,
                    color: g.color,
                    background: g.tint,
                    borderRadius: 999,
                    padding: "4px 14px",
                  }}
                >
                  {g.level}
                </span>
              </div>
              <h3 style={{ fontFamily: KID_FONT, fontSize: 25, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>{g.title}</h3>
              <p style={{ fontFamily: KID_FONT, fontSize: 16, fontWeight: 500, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>{g.desc}</p>
              <div
                className="inline-block"
                style={{
                  fontFamily: KID_FONT,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#ffffff",
                  background: g.color,
                  borderRadius: 999,
                  padding: "10px 28px",
                  boxShadow: "0 4px 0 rgba(2,132,199,0.5)",
                }}
              >
                เล่นเลย 🚀
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const features = [
    { emoji: "🎯", label: "ตามหลักสูตร มัธยม" },
    { emoji: "💡", label: "อธิบายเข้าใจง่าย" },
    { emoji: "🎮", label: "เรียนรู้ผ่านการเล่น" },
  ];

  return (
    <section id="about" className="px-6 py-16">
      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "linear-gradient(135deg, #eff6ff, #ecfdf5)",
          border: "2px solid #e0f2fe",
          borderRadius: 32,
          padding: "48px 32px",
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: KID_FONT, fontSize: 15, fontWeight: 600, color: "#0d9488" }}>🧡 เกี่ยวกับเว็บนี้</span>
        <h2 style={{ fontFamily: KID_FONT, fontSize: 34, fontWeight: 700, color: "#1e293b", marginTop: 8, marginBottom: 16 }}>
          
        </h2>
        <p style={{ fontFamily: KID_FONT, fontSize: 17, fontWeight: 500, color: "#475569", lineHeight: 1.9, maxWidth: 620, margin: "0 auto 28px" }}>
          สื่อการเรียนรู้ชุดนี้สร้างขึ้นเพื่อใช้ในห้องเรียนวิทยาศาสตร์ระดับมัธยมศึกษา
          ครอบคลุมเนื้อหาเรื่อง DNA พันธุกรรม และชีววิทยาโมเลกุล
          ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน ให้เรียนรู้ได้ง่ายและสนุกกว่าเดิม
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              style={{
                fontFamily: KID_FONT,
                fontSize: 15,
                fontWeight: 600,
                color: "#334155",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                borderRadius: 999,
                padding: "10px 20px",
              }}
            >
              {f.emoji} {f.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-8 text-center" style={{ borderTop: "2px solid #e0f2fe", background: "rgba(255,255,255,0.7)" }}>
      <p style={{ fontFamily: KID_FONT, fontSize: 15, fontWeight: 600, color: "#64748b" }}>
        🧬 Helixis — สื่อการเรียนรู้วิทยาศาสตร์ DNA 
      </p>
    </footer>
  );
}

export default function App() {
  const [showDnaGame, setShowDnaGame] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f9ff 0%, #ffffff 45%, #f0fdf4 100%)",
        color: "#1e293b",
        fontFamily: KID_FONT,
      }}
    >
      <NavBar />
      <HeroSection onPlay={() => setShowDnaGame(true)} />
      <GamesSection onPlay={() => setShowDnaGame(true)} />
      <AboutSection />
      <Footer />

      {showDnaGame && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-100"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <DnaGame onClose={() => setShowDnaGame(false)} />
        </div>
      )}
    </div>
  );
}
