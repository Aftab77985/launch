"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    LayoutDashboard,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ExternalLink,
    X,
    Download,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Item {
    name: string;
    previewPath: string;
    pdfPath: string | null;
    description: string;
    type: "publication" | "dashboard";
    link?: string;
}

const allItems: Item[] = [
    {
        name: "Balochistan Development Profile",
        previewPath: "/publications/BalochistanDevelopmentProfile.jpeg",
        pdfPath: "/published/BalochistanDevelopmentProfile.pdf",
        description:
            "Comprehensive overview of development initiatives and progress across all districts of Balochistan province.",
        type: "publication",
    },
    {
        name: "Development Statistics 2024",
        previewPath: "/publications/DevelopmentstatisticsofBalochistan2024.jpeg",
        pdfPath: "/published/DevelopmentstatisticsofBalochistan2024.pdf",
        description:
            "Latest statistical data, metrics, and key performance indicators for Balochistan's development sectors.",
        type: "publication",
    },
    {
        name: "Trends Analysis Report",
        previewPath: "/publications/TrendsAnalysisofDevelopmentStatisticsofBalochistan.jpeg",
        pdfPath: "/published/TrendsAnalysisofDevelopmentStatisticsofBalochistan.pdf",
        description:
            "In-depth analysis of development trends, patterns, and projections for strategic planning.",
        type: "publication",
    },
    {
        name: "Bureau of Statistics Dashboard",
        previewPath: "/dashboards/bos-dashboard.PNG",
        pdfPath: null,
        description:
            "Interactive real-time dashboard for Bureau of Statistics data visualization and analytics.",
        type: "dashboard",
        link: "https://bospnd.balochistan.gov.pk/",
    },
    {
        name: "PSDP Dashboard",
        previewPath: "/dashboards/psdp-dashboard.PNG",
        pdfPath: null,
        description:
            "Public Sector Development Programme monitoring, tracking, and performance analytics platform.",
        type: "dashboard",
        link: "https://psdp.pnd.balochistan.gov.pk/",
    },
];

// ── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PdfModal({ item, onClose }: { item: Item; onClose: () => void }) {
    const [scale, setScale] = useState(100);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    function download() {
        if (!item.pdfPath) return;
        const a = document.createElement("a");
        a.href = item.pdfPath;
        a.download = item.name + ".pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "rgba(1,6,4,0.96)", backdropFilter: "blur(20px)" }}
        >
            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

            {/* Top bar */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/6 shrink-0"
                style={{ background: "rgba(2,10,6,0.8)", backdropFilter: "blur(12px)" }}
            >
                {/* Title */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/15 border border-green-500/25">
                        <FileText className="text-green-400" style={{ width: "clamp(0.85rem, 1.1vw, 1rem)", height: "clamp(0.85rem, 1.1vw, 1rem)" }} />
                    </div>
                    <div>
                        <p className="font-semibold text-white" style={{ fontSize: "clamp(0.8rem, 1.3vw, 1.1rem)" }}>
                            {item.name}
                        </p>
                        <p className="text-neutral-500 uppercase tracking-wider" style={{ fontSize: "clamp(0.45rem, 0.7vw, 0.62rem)" }}>
                            Publication · Bureau of Statistics
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    {/* Zoom controls */}
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
                        <button
                            onClick={() => setScale((s) => Math.max(50, s - 10))}
                            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                        >
                            <ZoomOut style={{ width: "clamp(0.8rem, 1vw, 0.9rem)", height: "clamp(0.8rem, 1vw, 0.9rem)" }} />
                        </button>
                        <span className="text-neutral-400 tabular-nums font-mono px-1" style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.78rem)" }}>
                            {scale}%
                        </span>
                        <button
                            onClick={() => setScale((s) => Math.min(200, s + 10))}
                            className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                        >
                            <ZoomIn style={{ width: "clamp(0.8rem, 1vw, 0.9rem)", height: "clamp(0.8rem, 1vw, 0.9rem)" }} />
                        </button>
                    </div>

                    {/* Download */}
                    <button
                        onClick={download}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/15 border border-green-500/25 hover:bg-green-500/25 transition-all duration-200 text-green-300"
                        style={{ fontSize: "clamp(0.6rem, 0.9vw, 0.8rem)" }}
                    >
                        <Download style={{ width: "clamp(0.75rem, 1vw, 0.9rem)", height: "clamp(0.75rem, 1vw, 0.9rem)" }} />
                        <span className="font-medium">Download</span>
                    </button>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/8 hover:bg-red-500/15 hover:border-red-500/30 transition-all duration-200 text-neutral-400 hover:text-red-400"
                    >
                        <X style={{ width: "clamp(0.85rem, 1.1vw, 1rem)", height: "clamp(0.85rem, 1.1vw, 1rem)" }} />
                    </button>
                </div>
            </motion.div>

            {/* PDF iframe */}
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex-1 overflow-hidden"
                style={{ padding: "clamp(0.5rem, 1vmin, 1rem)" }}
            >
                <div className="w-full h-full rounded-2xl overflow-hidden border border-white/6" style={{ boxShadow: "0 0 0 1px rgba(34,197,94,0.06), inset 0 0 60px rgba(0,0,0,0.4)" }}>
                    <iframe
                        src={`${item.pdfPath}#zoom=${scale}`}
                        className="w-full h-full"
                        title={item.name}
                        style={{ border: "none", background: "#1a1a1a" }}
                    />
                </div>
            </motion.div>

            {/* Bottom hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 flex items-center justify-center gap-2 py-2 shrink-0"
            >
                <span className="text-neutral-700 uppercase tracking-widest" style={{ fontSize: "clamp(0.42rem, 0.65vw, 0.6rem)" }}>
                    Press Esc or click × to close
                </span>
            </motion.div>
        </motion.div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ShowcasePage() {
    const [idx, setIdx] = useState(0);
    const [dir, setDir] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const [pdfItem, setPdfItem] = useState<Item | null>(null);
    const item = allItems[idx];

    const closePdf = useCallback(() => setPdfItem(null), []);

    // Celebration confetti on mount
    useEffect(() => {
        const duration = 4500;
        const end = Date.now() + duration;
        const rand = (a: number, b: number) => Math.random() * (b - a) + a;
        const t = setInterval(() => {
            const left = end - Date.now();
            if (left <= 0) { clearInterval(t); return; }
            const n = 55 * (left / duration);
            const opts = { startVelocity: 32, spread: 360, ticks: 70, zIndex: 0 };
            confetti({ ...opts, particleCount: n, origin: { x: rand(0.08, 0.28), y: Math.random() - 0.2 }, colors: ["#22c55e", "#10b981", "#84cc16", "#fff"] });
            confetti({ ...opts, particleCount: n, origin: { x: rand(0.72, 0.92), y: Math.random() - 0.2 }, colors: ["#22c55e", "#10b981", "#84cc16", "#fff"] });
        }, 230);
        return () => clearInterval(t);
    }, []);

    // Auto-advance (pause when pdf open)
    useEffect(() => {
        if (!autoPlay || pdfItem) return;
        const t = setInterval(next, 6000);
        return () => clearInterval(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idx, autoPlay, pdfItem]);

    function prev() { setDir(-1); setIdx((p) => (p - 1 + allItems.length) % allItems.length); setAutoPlay(false); }
    function next() { setDir(1); setIdx((p) => (p + 1) % allItems.length); }

    const slideVars = {
        enter: (d: number) => ({ x: d > 0 ? "105%" : "-105%", opacity: 0, scale: 0.9 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-105%" : "105%", opacity: 0, scale: 0.9 }),
    };

    return (
        <>
            {/* PDF Viewer Modal */}
            <AnimatePresence>
                {pdfItem && <PdfModal item={pdfItem} onClose={closePdf} />}
            </AnimatePresence>

            <div className="h-screen bg-[#020906] text-white relative overflow-hidden">

                {/* ── BACKGROUND ────────────────────────────────── */}
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: [
                                "radial-gradient(ellipse 60% 80% at 15% 50%, rgba(34,197,94,0.1) 0%, transparent 55%)",
                                "radial-gradient(ellipse 60% 80% at 85% 50%, rgba(16,185,129,0.1) 0%, transparent 55%)",
                                "radial-gradient(ellipse 60% 80% at 50% 85%, rgba(132,204,22,0.08) 0%, transparent 55%)",
                                "radial-gradient(ellipse 60% 80% at 15% 50%, rgba(34,197,94,0.1) 0%, transparent 55%)",
                            ],
                        }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
                    <div className="absolute inset-0 opacity-[0.07]" style={{
                        backgroundImage: "linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                </div>

                {/* ── TOP BAR ───────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-4 border-b border-white/4"
                    style={{ backdropFilter: "blur(12px)", background: "rgba(2,9,6,0.6)" }}
                >
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full" />
                            <img
                                src="https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png"
                                alt="GoB"
                                className="relative object-contain drop-shadow-[0_0_16px_rgba(34,197,94,0.5)]"
                                style={{ width: "clamp(2.2rem, 4vmin, 3.5rem)", height: "clamp(2.2rem, 4vmin, 3.5rem)" }}
                            />
                        </div>
                        <div>
                            <p className="font-bold text-white uppercase tracking-[0.08em]" style={{ fontSize: "clamp(0.75rem, 1.3vw, 1.15rem)" }}>
                                Bureau of Statistics
                            </p>
                            <p className="text-green-400/70 uppercase tracking-[0.15em]" style={{ fontSize: "clamp(0.45rem, 0.75vw, 0.65rem)" }}>
                                Planning &amp; Development Dept · Govt of Balochistan
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20">
                        <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="w-2 h-2 rounded-full bg-green-400"
                            style={{ boxShadow: "0 0 8px rgba(34,197,94,0.8)" }}
                        />
                        <span className="font-semibold text-green-300 uppercase tracking-[0.18em]" style={{ fontSize: "clamp(0.5rem, 0.85vw, 0.75rem)" }}>
                            Launch Successful
                        </span>
                        <Sparkles className="text-green-500/60" style={{ width: "clamp(0.7rem, 1vw, 0.9rem)", height: "clamp(0.7rem, 1vw, 0.9rem)" }} />
                    </div>
                </motion.div>

                {/* ── MAIN CONTENT ──────────────────────────────── */}
                <div className="relative h-full flex items-center justify-center pt-20 pb-16 px-8">
                    <div className="w-full max-w-[1700px] h-full flex items-center gap-10 lg:gap-16">

                        {/* LEFT — image */}
                        <div className="flex-1 h-full flex flex-col justify-center min-w-0 relative">
                            <AnimatePresence initial={false} custom={dir} mode="wait">
                                <motion.div
                                    key={idx}
                                    custom={dir}
                                    variants={slideVars}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.25 }, scale: { duration: 0.25 } }}
                                    className="relative w-full overflow-hidden"
                                    style={{
                                        height: "clamp(320px, 60vh, 820px)",
                                        borderRadius: "clamp(1rem, 2vmin, 2rem)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                        background: "rgba(5,20,12,0.6)",
                                        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.06)",
                                    }}
                                >
                                    <img
                                        src={item.previewPath}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(2,9,6,0.7) 0%, transparent 35%)" }} />

                                    {/* Type badge on image */}
                                    <div className="absolute top-4 left-4">
                                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl border border-white/10 bg-black/40">
                                            {item.type === "publication"
                                                ? <FileText className="text-green-400" style={{ width: "clamp(0.75rem, 1.1vw, 1rem)", height: "clamp(0.75rem, 1.1vw, 1rem)" }} />
                                                : <LayoutDashboard className="text-green-400" style={{ width: "clamp(0.75rem, 1.1vw, 1rem)", height: "clamp(0.75rem, 1.1vw, 1rem)" }} />
                                            }
                                            <span className="text-white/70 uppercase tracking-wider font-semibold" style={{ fontSize: "clamp(0.5rem, 0.8vw, 0.72rem)" }}>
                                                {item.type}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* RIGHT — info */}
                        <div className="shrink-0 flex flex-col justify-center" style={{ width: "clamp(260px, 36%, 580px)" }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
                                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex flex-col gap-6"
                                >
                                    {/* Index */}
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-green-400 tabular-nums font-mono" style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.4rem)" }}>
                                            {String(idx + 1).padStart(2, "0")}
                                        </span>
                                        <div className="h-px flex-1 bg-green-500/20" />
                                        <span className="text-neutral-600 tabular-nums font-mono" style={{ fontSize: "clamp(0.7rem, 1vw, 0.9rem)" }}>
                                            {String(allItems.length).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="font-bold leading-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60"
                                        style={{ fontSize: "clamp(1.4rem, 2.9vw, 3.4rem)" }}
                                    >
                                        {item.name}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-neutral-400 leading-relaxed" style={{ fontSize: "clamp(0.78rem, 1.25vw, 1.2rem)" }}>
                                        {item.description}
                                    </p>

                                    {/* Action */}
                                    {item.type === "publication" ? (
                                        <button
                                            onClick={() => setPdfItem(item)}
                                            className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                                            style={{
                                                padding: "clamp(0.8rem, 1.3vw, 1.1rem) clamp(1.5rem, 2.5vw, 2rem)",
                                                fontSize: "clamp(0.78rem, 1.2vw, 1.1rem)",
                                                background: "linear-gradient(135deg, #22c55e, #10b981)",
                                                boxShadow: "0 8px 40px rgba(34,197,94,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }} />
                                            <BookOpen className="relative z-10" style={{ width: "clamp(0.9rem, 1.3vw, 1.2rem)", height: "clamp(0.9rem, 1.3vw, 1.2rem)" }} />
                                            <span className="relative z-10">View Publication</span>
                                        </button>
                                    ) : (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                                            style={{
                                                padding: "clamp(0.8rem, 1.3vw, 1.1rem) clamp(1.5rem, 2.5vw, 2rem)",
                                                fontSize: "clamp(0.78rem, 1.2vw, 1.1rem)",
                                                background: "linear-gradient(135deg, #22c55e, #10b981)",
                                                boxShadow: "0 8px 40px rgba(34,197,94,0.35), 0 2px 8px rgba(0,0,0,0.3)",
                                            }}
                                        >
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }} />
                                            <ExternalLink className="relative z-10" style={{ width: "clamp(0.9rem, 1.3vw, 1.2rem)", height: "clamp(0.9rem, 1.3vw, 1.2rem)" }} />
                                            <span className="relative z-10">Open Dashboard</span>
                                        </a>
                                    )}

                                    {/* Progress dots */}
                                    <div className="flex gap-2 items-center">
                                        {allItems.map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); setAutoPlay(false); }}
                                                className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/8 transition-all duration-200 hover:bg-white/15"
                                            >
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-linear-to-r from-green-400 to-emerald-500 origin-left"
                                                    initial={false}
                                                    animate={{ scaleX: i === idx ? 1 : 0 }}
                                                    transition={{ duration: i === idx && autoPlay ? 6 : 0.25, ease: i === idx && autoPlay ? "linear" : "easeOut" }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ── NAV ARROWS ────────────────────────────────── */}
                {[
                    { side: "left", icon: ChevronLeft, fn: prev, pos: "left-4" },
                    { side: "right", icon: ChevronRight, fn: next, pos: "right-4" },
                ].map(({ side, icon: Icon, fn, pos }) => (
                    <button
                        key={side}
                        onClick={fn}
                        className={`absolute ${pos} top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full border border-white/8 bg-black/50 backdrop-blur-xl transition-all duration-300 hover:border-green-500/40 hover:bg-black/70 hover:scale-110 group`}
                        style={{ padding: "clamp(0.7rem, 1.3vw, 1.2rem)" }}
                    >
                        <Icon
                            className="text-neutral-500 group-hover:text-green-400 transition-colors"
                            style={{ width: "clamp(1.2rem, 1.8vw, 1.8rem)", height: "clamp(1.2rem, 1.8vw, 1.8rem)" }}
                        />
                    </button>
                ))}

                {/* ── BOTTOM BAR ────────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-3 py-3.5 border-t border-white/4"
                    style={{ backdropFilter: "blur(12px)", background: "rgba(2,9,6,0.6)" }}
                >
                    <Sparkles className="text-green-600/50" style={{ width: "clamp(0.7rem, 0.9vw, 0.85rem)", height: "clamp(0.7rem, 0.9vw, 0.85rem)" }} />
                    <span className="text-neutral-500 uppercase tracking-[0.2em] font-medium" style={{ fontSize: "clamp(0.48rem, 0.75vw, 0.7rem)" }}>
                        Dashboard and Publications Launch Event · Bureau of Statistics · Govt of Balochistan
                    </span>
                    <Sparkles className="text-green-600/50" style={{ width: "clamp(0.7rem, 0.9vw, 0.85rem)", height: "clamp(0.7rem, 0.9vw, 0.85rem)" }} />
                </motion.div>
            </div>
        </>
    );
}
