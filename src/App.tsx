import { useState } from "react";
import DnaGame from "./DnaGame";

function NavBar() {
  return (
    <nav className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center gap-2">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4fc3f7", letterSpacing: "0.15em" }}>DNA</span>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>Helixis</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#69f0ae", marginLeft: 8, letterSpacing: "0.1em" }}>สื่อการเรียนรู้</span>
      </div>
      <div className="flex gap-6">
        {["หน้าแรก", "เกมทั้งหมด", "เกี่ยวกับ"].map((item) => (
          <a key={item} href="#" className="text-sm transition-colors" style={{ color: "#8896a8", fontFamily: "'Instrument Sans', sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#dde4ee")}
            onMouseLeave={e => (e.currentTarget.style.color = "#8896a8")}
          >{item}</a>
        ))}
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative flex flex-col items-center text-center px-6 py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(79,195,247,0.09) 0%, transparent 70%)",
      }} />

      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
        style={{ border: "1px solid rgba(105,240,174,0.3)", background: "rgba(105,240,174,0.06)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#69f0ae", letterSpacing: "0.12em" }}
      >
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#69f0ae", animation: "pulse 2s infinite" }} />
        สื่อการเรียนการสอนวิทยาศาสตร์
      </div>

      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", lineHeight: 1.15, marginBottom: "1.25rem" }}>
        เรียนรู้วิทยาศาสตร์<br />
        <span style={{ fontStyle: "italic", background: "linear-gradient(90deg, #4fc3f7, #69f0ae)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          ผ่านเกมสนุก
        </span>
      </h1>

      <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 16, color: "#8896a8", maxWidth: 480, lineHeight: 1.7, marginBottom: "2.5rem" }}>
        สำรวจโลกของ DNA พันธุกรรม และชีววิทยาโมเลกุล
        ผ่านเกมและกิจกรรมที่ออกแบบมาสำหรับนักเรียนโดยเฉพาะ
      </p>

      <a
        href="#games"
        style={{
          display: "inline-block",
          padding: "14px 36px",
          borderRadius: 6,
          background: "linear-gradient(135deg, #4fc3f7, #69f0ae)",
          color: "#05080f",
          fontFamily: "'Instrument Sans', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          transition: "opacity 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        เริ่มเล่นเกม →
      </a>
    </section>
  );
}

function GamesSection({ onPlay }: { onPlay: () => void }) {
  const games = [
    {
      emoji: "🧫",
      title: "จับคู่โครโมโซม",
      desc: "จำลองการส่องกล้องจุลทรรศน์ จับคู่โครโมโซมทั้ง 23 คู่ และวิเคราะห์ความผิดปกติทางพันธุกรรม",
      level: "ทุกระดับ",
      color: "#4dd0e1",
    },
  ];

  return (
    <section id="games" className="px-6 py-16">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="mb-10">
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#4fc3f7", letterSpacing: "0.15em" }}>GAMES</span>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#fff", marginTop: 8 }}>เลือกกิจกรรมที่ต้องการ</h2>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {games.map((g) => (
            <div
              key={g.title}
              className="group cursor-pointer rounded-lg p-5 transition-all duration-200"
              style={{ background: "#090d16", border: "1px solid rgba(255,255,255,0.07)" }}
              onClick={onPlay}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(79,195,247,0.25)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.emoji}</div>
              <div style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 11, color: g.color, letterSpacing: "0.1em", marginBottom: 6 }}>{g.level}</div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#fff", marginBottom: 8 }}>{g.title}</h3>
              <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{g.desc}</p>
              <div style={{ marginTop: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: g.color, letterSpacing: "0.05em" }}>
                เล่นเลย →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="เกี่ยวกับ"
      className="px-6 py-16"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
    >
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#69f0ae", letterSpacing: "0.15em" }}>เกี่ยวกับสื่อนี้</span>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: "#fff", marginTop: 8, marginBottom: 16 }}>
          ออกแบบสำหรับห้องเรียน
        </h2>
        <p style={{ fontFamily: "'Instrument Sans', sans-serif", fontSize: 15, color: "#8896a8", lineHeight: 1.8 }}>
          สื่อการเรียนรู้ชุดนี้จัดทำขึ้นเพื่อใช้ในชั้นเรียนวิทยาศาสตร์ระดับมัธยมศึกษา
          ครอบคลุมเนื้อหาด้าน DNA พันธุกรรม และชีววิทยาโมเลกุล
          ตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-6 py-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#374151", letterSpacing: "0.08em" }}>
        Helixis — สื่อการเรียนการสอนวิทยาศาสตร์ DNA
      </p>
    </footer>
  );
}

export default function App() {
  const [showDnaGame, setShowDnaGame] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#05080f", color: "#dde4ee" }}>
      <NavBar />
      <HeroSection />
      <GamesSection onPlay={() => setShowDnaGame(true)} />
      <AboutSection />
      <Footer />

      {showDnaGame && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">
          <DnaGame onClose={() => setShowDnaGame(false)} />
        </div>
      )}
    </div>
  );
}
