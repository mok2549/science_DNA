import { useMemo, useState } from "react";

interface Band {
  pos: number;
  size: number;
  color: string;
}

interface ChromosomeType {
  id: string;
  height: number;
  width: number;
  bands: Band[];
}

interface Scenario {
  id: string;
  name: string;
  formula: string;
  diagnosis: string;
  isNormal: boolean;
}

type VisualStyle = "schematic" | "metaphase";
type GameMode = "normal" | "disease" | "metaphase";

interface SpreadItem {
  uid: string;
  typeId: string;
  config: ChromosomeType;
  isShortened: boolean;
  x: number;
  y: number;
  rotation: number;
}

interface ChromosomeProps {
  type: ChromosomeType;
  onClick?: () => void;
  isSelected?: boolean;
  isMatched?: boolean;
  scale?: number;
  label?: string;
  isShortened?: boolean;
  visualStyle?: VisualStyle;
}

// --- Chromosome Component ---
const Chromosome = ({
  type,
  onClick,
  isSelected,
  isMatched,
  scale = 1,
  label = "",
  isShortened = false,
  visualStyle = "schematic",
}: ChromosomeProps) => {
  const { bands, height, width, id } = type;
  const cy = height * (id === "Y" ? 0.08 : 0.35);

  // การคำนวณรูปทรงของโครโมโซม
  const isMeta = visualStyle === "metaphase";
  const vbWidth = isMeta ? width * 2.5 : width + 4;
  const center = vbWidth / 2;

  // ความหนาของแต่ละแขนโครมาทิด
  const thickness = isMeta ? width * 0.55 : width - 4;
  const capRadius = thickness / 2;

  // จุดเริ่มต้นและสิ้นสุดของแขนโครโมโซม
  const baseStartY = isShortened ? height * 0.2 : 2;
  const startY = baseStartY + capRadius;
  const endY = height - 2 - capRadius;

  const gap = isMeta ? width * 0.7 : 0;

  // เช็คว่าเซนโทรเมียร์อยู่สูงจนไม่มีแขนด้านบน (p arm) หรือไม่ (เช่น โครโมโซม Y)
  const hasTopArm = cy > startY;

  // การสร้าง Path สำหรับโครมาทิดซ้ายและขวาให้คอดเข้าหากันที่จุด Centromere
  const leftPath = isMeta
    ? hasTopArm
      ? `M ${center - gap},${startY} L ${center},${cy} L ${center - gap},${endY}`
      : `M ${center},${cy} L ${center - gap},${endY}`
    : `M ${center},${hasTopArm ? startY : cy} L ${center},${endY}`;

  const rightPath = isMeta
    ? hasTopArm
      ? `M ${center + gap},${startY} L ${center},${cy} L ${center + gap},${endY}`
      : `M ${center},${cy} L ${center + gap},${endY}`
    : ``;

  // ใช้ useMemo เพื่อป้องกันไม่ให้ maskId เปลี่ยนทุกครั้งที่ re-render
  const maskId = useMemo(
    () => `mask-${id}-${Math.random().toString(36).slice(2, 7)}`,
    [id],
  );

  return (
    <div
      onClick={() => !isMatched && onClick && onClick()}
      className={`relative cursor-pointer transition-all duration-300 transform flex flex-col items-center
        ${isSelected ? "scale-110 ring-4 ring-yellow-400 rounded-xl z-30" : "hover:scale-105 z-10"}
        ${isMatched ? "opacity-40 grayscale pointer-events-none" : "opacity-100"}
      `}
      style={{ width: vbWidth * scale, height: (height + 15) * scale }}
    >
      <svg
        viewBox={`0 0 ${vbWidth} ${height}`}
        className="w-full drop-shadow-md overflow-visible"
      >
        {/* Outline สีเข้มด้านหลังเพื่อความคมชัด */}
        <path
          d={leftPath}
          stroke="#333"
          strokeWidth={thickness + 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {isMeta && (
          <path
            d={rightPath}
            stroke="#333"
            strokeWidth={thickness + 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}

        {/* การกำหนด Mask รูปทรงโครโมโซม */}
        <defs>
          <mask id={maskId}>
            <path
              d={leftPath}
              stroke="white"
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {isMeta && (
              <path
                d={rightPath}
                stroke="white"
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </mask>
        </defs>

        {/* ตัวโครโมโซมและแถบสี (Bands) ที่ถูกตัดขอบด้วย Mask ให้พอดีกับรูปทรงแขน */}
        <g mask={`url(#${maskId})`}>
          <rect x="0" y="0" width={vbWidth} height={height} fill="white" />
          {bands.map((band, i) => {
            if (isShortened && band.pos < 0.3) return null;
            return (
              <rect
                key={i}
                x="0"
                y={band.pos * height}
                width={vbWidth}
                height={band.size * height}
                fill={band.color}
                opacity={0.85}
              />
            );
          })}
        </g>

        {/* จุด Centromere เพื่อเพิ่มความสมจริง */}
        {isMeta ? (
          <circle
            cx={center}
            cy={cy}
            r={thickness * 0.4}
            fill="#ddd"
            stroke="#333"
            strokeWidth="0.5"
          />
        ) : (
          <rect
            x={center - thickness / 2 + 0.5}
            y={cy - 1.5}
            width={thickness - 1}
            height="3"
            rx="1"
            fill="#ddd"
            stroke="#333"
            strokeWidth="0.5"
          />
        )}
      </svg>

      {isMatched && label && (
        <span className="text-[8px] font-bold text-slate-400 mt-1 truncate max-w-full">
          {label}
        </span>
      )}
    </div>
  );
};

// --- Main Game ---
export default function DnaGame({ onClose }: { onClose?: () => void }) {
  const [appState, setAppState] = useState<"menu" | "playing" | "finished">(
    "menu",
  );
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("schematic");
  const [spread, setSpread] = useState<SpreadItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [currentCase, setCurrentCase] = useState<Scenario | null>(null);

  const scenarios: Record<"normal" | "disease", Scenario[]> = {
    normal: [
      {
        id: "normal_male",
        name: "ปกติ (เพศชาย)",
        formula: "46, XY",
        diagnosis:
          "โครโมโซมครบ 23 คู่ (46 แท่ง) พบโครโมโซมเพศเป็น XY โดย Y มีขนาดสั้นกว่าและมีแถบสีเทาทึบ",
        isNormal: true,
      },
      {
        id: "normal_female",
        name: "ปกติ (เพศหญิง)",
        formula: "46, XX",
        diagnosis:
          "โครโมโซมครบ 23 คู่ (46 แท่ง) พบโครโมโซมเพศเป็น X 2 แท่งที่มีขนาดและลวดลายเหมือนกันทุกประการ",
        isNormal: true,
      },
    ],
    disease: [
      {
        id: "down_syndrome",
        name: "Down Syndrome",
        formula: "47, XX/XY, +21",
        diagnosis:
          "เกิดภาวะ Trisomy 21 (โครโมโซมคู่ที่ 21 เกินมา 1 แท่ง) มักพบความบกพร่องทางสติปัญญาและลักษณะใบหน้าจำเพาะ",
        isNormal: false,
      },
      {
        id: "edward_syndrome",
        name: "Edwards Syndrome",
        formula: "47, XX/XY, +18",
        diagnosis:
          "เกิดภาวะ Trisomy 18 มักมีความผิดปกติของอวัยวะภายในอย่างรุนแรงและกำมือแน่น",
        isNormal: false,
      },
      {
        id: "patau_syndrome",
        name: "Patau Syndrome",
        formula: "47, XX/XY, +13",
        diagnosis:
          "เกิดภาวะ Trisomy 13 พบความผิดปกติหลายระบบ เช่น ปากแหว่งเพดานโหว่ หรือนิ้วเกิน",
        isNormal: false,
      },
      {
        id: "turner_syndrome",
        name: "Turner Syndrome",
        formula: "45, X",
        diagnosis:
          "เพศหญิงที่ขาดโครโมโซม X ไป 1 แท่ง (Monosomy X) มักมีรูปร่างเตี้ยและไม่มีประจำเดือน",
        isNormal: false,
      },
      {
        id: "klinefelter",
        name: "Klinefelter Syndrome",
        formula: "47, XXY",
        diagnosis:
          "เพศชายที่มีโครโมโซม X เกินมา 1 แท่ง (XXY) มักมีรูปร่างสูงและเป็นหมัน",
        isNormal: false,
      },
      {
        id: "cri_du_chat",
        name: "Cri-du-chat Syndrome",
        formula: "46, XX/XY, 5p-",
        diagnosis:
          "ความผิดปกติที่โครงสร้าง โดยส่วนแขนข้างสั้น (p) ของโครโมโซมคู่ที่ 5 ขาดหายไป มักมีเสียงร้องแหลมคล้ายแมว",
        isNormal: false,
      },
    ],
  };

  const generateUniqueBands = (id: string) => {
    let seed = 0;
    const str = id.toString();
    for (let i = 0; i < str.length; i++)
      seed = ((seed << 5) - seed) + str.charCodeAt(i);
    seed |= 0;
    const seededRandom = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const count = Math.floor(seededRandom() * 3) + 2;
    const bands: Band[] = [];
    const colors = ["#1a1a1a", "#333333", "#4d4d4d", "#666666"];
    let lastY = 0.1;
    for (let i = 0; i < count; i++) {
      const spacing = seededRandom() * 0.15 + 0.05;
      const pos = Math.min(0.8, lastY + spacing);
      const size = seededRandom() * 0.1 + 0.05;
      const color = colors[Math.floor(seededRandom() * colors.length)];
      if (pos + size < 0.9) {
        bands.push({ pos, size, color });
        lastY = pos + size;
      }
    }
    return bands;
  };

  const chromosomeTypes = useMemo(() => {
    const types: Record<string, ChromosomeType> = {};
    for (let i = 1; i <= 22; i++) {
      types[i.toString()] = {
        id: i.toString(),
        height: Math.max(100 - i * 3, 40),
        width: Math.max(22 - i * 0.4, 14),
        bands: generateUniqueBands(i.toString()),
      };
    }

    // โครโมโซม X เป็นแท่งยาว มีแถบสีเข้มที่แขนบนและแขนล่าง
    types["X"] = {
      id: "X",
      height: 85,
      width: 18,
      bands: [
        { pos: 0.1, size: 0.15, color: "#222" },
        { pos: 0.5, size: 0.1, color: "#111" },
        { pos: 0.7, size: 0.2, color: "#111" },
      ],
    };

    // โครโมโซม Y สั้นประมาณ 1/2 ของ X, ไม่มีส่วนหัว (acrocentric), แถบสีปกติ
    types["Y"] = {
      id: "Y",
      height: 40,
      width: 14,
      bands: [
        { pos: 0.25, size: 0.15, color: "#444" },
        { pos: 0.6, size: 0.2, color: "#222" },
      ],
    };
    return types;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = (mode: GameMode) => {
    // กำหนดโอกาสเพศชายหรือหญิง 50:50
    const isMaleInScenario = Math.random() >= 0.5;
    let scenario: Scenario;
    let style: VisualStyle = "schematic";

    if (mode === "normal") {
      scenario = scenarios.normal.find(
        (s) => s.id === (isMaleInScenario ? "normal_male" : "normal_female"),
      )!;
    } else if (mode === "disease") {
      const validDiseases = scenarios.disease.filter((s) => {
        if (isMaleInScenario) return s.id !== "turner_syndrome";
        return s.id !== "klinefelter";
      });
      scenario = validDiseases[Math.floor(Math.random() * validDiseases.length)];
    } else {
      style = "metaphase";
      // โหมดจำลองกล้อง สุ่มปนทั้งเคสปกติและโรค
      const pool = [
        ...scenarios.normal,
        ...scenarios.disease.filter((s) => {
          if (isMaleInScenario) return s.id !== "turner_syndrome";
          return s.id !== "klinefelter";
        }),
      ];
      scenario = pool[Math.floor(Math.random() * pool.length)];
    }

    // ปรับสูตรให้ตรงกับเพศที่สุ่มได้จริง
    let dynamicFormula = scenario.formula;
    if (dynamicFormula.includes("XX/XY")) {
      dynamicFormula = dynamicFormula.replace(
        "XX/XY",
        isMaleInScenario ? "XY" : "XX",
      );
    }

    setSelectedMode(mode);
    setVisualStyle(style);
    setCurrentCase({ ...scenario, formula: dynamicFormula });
    setAppState("playing");
    setMatchedIds(new Set());
    setSelectedId(null);
    setScore(0);

    const pool: (ChromosomeType & { pairName: string; isShortened?: boolean })[] =
      [];
    for (let i = 1; i <= 22; i++) {
      const type = chromosomeTypes[i.toString()];
      const isCriDuChatTarget = scenario.id === "cri_du_chat" && i === 5;

      pool.push({ ...type, pairName: i.toString() });
      pool.push({
        ...type,
        pairName: i.toString(),
        isShortened: isCriDuChatTarget,
      });

      if (scenario.id === "down_syndrome" && i === 21)
        pool.push({ ...type, pairName: "21" });
      if (scenario.id === "edward_syndrome" && i === 18)
        pool.push({ ...type, pairName: "18" });
      if (scenario.id === "patau_syndrome" && i === 13)
        pool.push({ ...type, pairName: "13" });
    }

    if (scenario.id === "klinefelter") {
      pool.push({ ...chromosomeTypes["X"], pairName: "X" });
      pool.push({ ...chromosomeTypes["X"], pairName: "X" });
      pool.push({ ...chromosomeTypes["Y"], pairName: "Y" });
    } else if (scenario.id === "turner_syndrome") {
      pool.push({ ...chromosomeTypes["X"], pairName: "X" });
    } else {
      if (isMaleInScenario) {
        pool.push({ ...chromosomeTypes["X"], pairName: "X" });
        pool.push({ ...chromosomeTypes["Y"], pairName: "Y" });
      } else {
        pool.push({ ...chromosomeTypes["X"], pairName: "X" });
        pool.push({ ...chromosomeTypes["X"], pairName: "X" });
      }
    }

    const newSpread: SpreadItem[] = pool.map((config, index) => ({
      uid: `c-${index}-${Math.random()}`,
      typeId: config.id,
      config: config,
      isShortened: config.isShortened || false,
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 84,
      rotation: Math.random() * 360,
    }));

    setSpread(newSpread.sort(() => Math.random() - 0.5));
  };

  const handleSelect = (uid: string) => {
    if (selectedId === uid) {
      setSelectedId(null);
      return;
    }
    if (selectedId === null) {
      setSelectedId(uid);
    } else {
      const first = spread.find((s) => s.uid === selectedId);
      const second = spread.find((s) => s.uid === uid);
      if (!first || !second) return;

      const isSexPair =
        (first.typeId === "X" && second.typeId === "Y") ||
        (first.typeId === "Y" && second.typeId === "X");
      const isSameType = first.typeId === second.typeId;

      if (isSameType || isSexPair) {
        const nextMatched = new Set(matchedIds);
        nextMatched.add(first.uid);
        nextMatched.add(second.uid);

        // เช็คการจบเกม
        const isFinished = nextMatched.size >= spread.length - (spread.length % 2);

        if (isFinished) {
          // ดึงแท่งที่เหลือเข้าตารางอัตโนมัติ
          const allIds = new Set(spread.map((s) => s.uid));
          setMatchedIds(allIds);
          setScore((s) => s + 10);
          setSelectedId(null);
          setTimeout(() => setAppState("finished"), 600);
        } else {
          setMatchedIds(nextMatched);
          setScore((s) => s + 10);
          setSelectedId(null);
        }
      } else {
        setSelectedId(uid);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      {appState === "menu" ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 relative">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              aria-label="ปิด"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          )}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <i className="fas fa-dna text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
              ระบบวิเคราะห์โครโมโซม
            </h1>
            <p className="text-slate-500 font-medium italic">
              โดย Lab JJ &amp; Baby Genetics Specialist
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full px-4">
            <button
              onClick={() => startGame("normal")}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-indigo-500 transition-all text-left active:scale-[0.98]"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-user text-indigo-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  โหมดปกติ
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  ศึกษารูปแบบโครโมโซม 46, XX และ XY (แท่งเดี่ยว 2D)
                </p>
              </div>
            </button>

            <button
              onClick={() => startGame("disease")}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-rose-500 transition-all text-left active:scale-[0.98]"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-stethoscope text-rose-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  วิเคราะห์โรค
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  วินิจฉัยความผิดปกติ (Aneuploidy) และ โครงสร้าง (แท่งเดี่ยว 2D)
                </p>
              </div>
            </button>

            <button
              onClick={() => startGame("metaphase")}
              className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-transparent hover:border-emerald-500 transition-all text-left active:scale-[0.98]"
            >
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <i className="fas fa-microscope text-emerald-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Metaphase
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  จำลองการส่องกล้องจริง โครโมโซมเป็นรูปตัว X หรือ V (2 Chromatids)
                </p>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-6">
          <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAppState("menu")}
                className="p-2 w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                aria-label="กลับเมนู"
              >
                <i className="fas fa-chevron-left text-xl"></i>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-900"
                  aria-label="ปิด"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              )}
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight uppercase">
                  {selectedMode} ANALYSIS
                </h1>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold italic">
                  Lab JJ &amp; Baby Special
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400">
                  SCORE
                </span>
                <span className="text-2xl font-black text-indigo-600 leading-none">
                  {score}
                </span>
              </div>
              <button
                onClick={() => selectedMode && startGame(selectedMode)}
                className="bg-slate-900 text-white p-3 w-12 h-12 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                aria-label="เริ่มใหม่"
              >
                <i className="fas fa-sync-alt text-lg"></i>
              </button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* กระจกสไลด์ */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="bg-slate-800 text-white px-6 py-3 rounded-t-[2.5rem] flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold italic">
                    Microscope Live Feed
                  </span>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded text-[10px] font-mono font-bold">
                  SCANNING: {matchedIds.size} / {spread.length}
                </div>
              </div>
              <div className="relative aspect-square md:aspect-video bg-white rounded-b-[2.5rem] shadow-inner border-[10px] border-slate-200 overflow-hidden ring-1 ring-slate-300">
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <div className="absolute inset-0 p-6">
                  {spread.map((item) => {
                    if (matchedIds.has(item.uid)) return null;

                    return (
                      <div
                        key={item.uid}
                        className="absolute cursor-pointer transition-all duration-300 ease-in-out"
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
                        }}
                      >
                        <Chromosome
                          type={item.config}
                          onClick={() => handleSelect(item.uid)}
                          isSelected={selectedId === item.uid}
                          isMatched={false}
                          scale={visualStyle === "metaphase" ? 0.55 : 0.7}
                          isShortened={item.isShortened}
                          visualStyle={visualStyle}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4 mt-6">
                <div className="w-12 h-12 shrink-0 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  🧪
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 mb-1">
                    JJ's Analysis Note:
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    {visualStyle === "metaphase"
                      ? '"ในระยะ Metaphase โครโมโซมจะคอดเข้าหากันที่จุดเซนโทรเมียร์จนเป็นรูปตัว X 2D คมชัด คล้ายภาพอ้างอิงของคุณเลยครับ สังเกตตัว V สั้นๆ ให้ดี นั่นคือโครโมโซม Y ครับ!"'
                      : '"โครโมโซมคู่ที่จัดเรียงสำเร็จแล้วจะถูกเก็บเข้าตาราง Karyogram และหายไปจากกระจกสไลด์ ทำให้พื้นที่สแกนดูโล่งและหาง่ายขึ้นเยอะเลยครับ!"'}
                  </p>
                </div>
              </div>
            </div>

            {/* ตาราง Karyogram */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex-1 overflow-y-auto max-h-[700px]">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                  <i className="fas fa-th-large"></i> Karyogram Results
                </h3>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-8 gap-x-2">
                  {/* Autosomes 1-22 */}
                  {Array.from({ length: 22 }, (_, i) => (i + 1).toString()).map(
                    (typeId) => {
                      const matchedInType = spread.filter(
                        (s) => matchedIds.has(s.uid) && s.typeId === typeId,
                      );
                      return (
                        <div key={typeId} className="flex flex-col items-center group">
                          <div className="flex gap-0.5 items-end h-16 mb-1 p-1 rounded-lg group-hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                            {matchedInType.length > 0 ? (
                              matchedInType.map((item) => (
                                <Chromosome
                                  key={item.uid}
                                  type={item.config}
                                  scale={
                                    visualStyle === "metaphase" ? 0.35 : 0.4
                                  }
                                  isMatched={false}
                                  isShortened={item.isShortened}
                                  visualStyle={visualStyle}
                                />
                              ))
                            ) : (
                              <div className="w-8 h-12 border-2 border-dashed border-slate-100 rounded-md flex items-center justify-center text-[8px] text-slate-200 font-bold">
                                {typeId}
                              </div>
                            )}
                          </div>
                          <div className="text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            CH {typeId}
                          </div>
                        </div>
                      );
                    },
                  )}

                  {/* Combined Sex 23 */}
                  {(() => {
                    const sexMatched = spread.filter(
                      (s) =>
                        matchedIds.has(s.uid) &&
                        (s.typeId === "X" || s.typeId === "Y"),
                    );

                    // บังคับจัดเรียงให้ X มาก่อน Y เสมอ
                    const sortedSexMatched = [...sexMatched].sort((a, b) => {
                      if (a.typeId === "X" && b.typeId === "Y") return -1;
                      if (a.typeId === "Y" && b.typeId === "X") return 1;
                      return 0;
                    });

                    let sexLabel = "Sex 23";
                    if (sortedSexMatched.length > 0) {
                      const types = sortedSexMatched
                        .map((s) => s.typeId)
                        .join("");
                      if (types === "XX") sexLabel = "Sex 23: XX (เพศหญิง)";
                      else if (types === "XY") sexLabel = "Sex 23: XY (เพศชาย)";
                      else if (types === "X") sexLabel = "Sex 23: X (เพศหญิง)";
                      else if (types === "XXY")
                        sexLabel = "Sex 23: XXY (เพศชาย)";
                      else sexLabel = `Sex 23: ${types}`;
                    }

                    return (
                      <div className="flex flex-col items-center group col-span-2 sm:col-span-2">
                        <div className="flex gap-0.5 items-end h-16 mb-1 p-1 rounded-lg group-hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                          {sortedSexMatched.length > 0 ? (
                            sortedSexMatched.map((item) => (
                              <Chromosome
                                key={item.uid}
                                type={item.config}
                                scale={
                                  visualStyle === "metaphase" ? 0.35 : 0.4
                                }
                                isMatched={false}
                                visualStyle={visualStyle}
                              />
                            ))
                          ) : (
                            <div className="w-16 h-12 border-2 border-dashed border-slate-100 rounded-md flex items-center justify-center text-[8px] text-slate-200 font-bold tracking-widest uppercase">
                              Sex Pair
                            </div>
                          )}
                        </div>
                        <div className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded uppercase tracking-tighter border border-indigo-100">
                          {sexLabel}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* สรุปการวินิจฉัย */}
                {appState === "finished" && currentCase && (
                  <div
                    className="mt-8 p-6 bg-slate-900 rounded-3xl text-white shadow-xl border border-white/10"
                    style={{ animation: "slideIn 0.5s ease-out forwards" }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">
                          สรุปการวินิจฉัย
                        </h4>
                        <p className="text-xl font-black">{currentCase.name}</p>
                      </div>
                      <i className="fas fa-file-alt text-2xl text-white/20"></i>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 mb-4 font-mono text-xs border border-white/5 tracking-wider">
                      ชุดโครโมโซม: {currentCase.formula}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6 border-l-2 border-indigo-500 pl-3 italic">
                      "{currentCase.diagnosis}"
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => selectedMode && startGame(selectedMode)}
                        className="py-3 bg-indigo-500 hover:bg-indigo-400 rounded-xl font-black text-xs transition-all shadow-lg"
                      >
                        Case ถัดไป
                      </button>
                      <button
                        onClick={() => setAppState("menu")}
                        className="py-3 bg-white/10 hover:bg-white/20 rounded-xl font-black text-xs transition-all"
                      >
                        กลับหน้าหลัก
                      </button>
                    </div>
                  </div>
                )}
                <style>{`
                  @keyframes slideIn {
                      from { opacity: 0; transform: translateY(20px); }
                      to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
              </div>

              <div className="bg-pink-50 p-5 rounded-3xl border border-pink-100 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 bg-pink-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                  👶
                </div>
                <div>
                  <p className="text-xs font-bold text-pink-600 mb-1">
                    Baby's Observation:
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    {visualStyle === "metaphase"
                      ? '"โหมด Metaphase นี้หน้าตาเหมือนในรูปเป๊ะเลยค่ะ เป็นรูปตัว X แบนๆ คมชัด ส่วนตัว V คว่ำคือโครโมโซม Y นะคะ!"'
                      : '"ตอนนี้ช่องคู่ที่ 23 จะจัดเรียงให้โครโมโซม X (แท่งใหญ่) มาก่อนโครโมโซม Y (แท่งเล็ก) เสมอแล้วค่ะ ไม่ว่าจะกดจับคู่สลับกันยังไงก็ตาม!"'}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
