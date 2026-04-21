"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

const HandPalmIcon = ({
    style,
    strokeWidth = 1.5,
}: {
    style?: React.CSSProperties;
    strokeWidth?: number;
}) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
    >
        <path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" />
        <path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v6" />
        <path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" />
        <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
);

export default function LaunchPage() {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLaunched, setIsLaunched] = useState(false);
    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const HOLD_DURATION = 5000;
    const UPDATE_INTERVAL = 50;
    const INCREMENT = 100 / (HOLD_DURATION / UPDATE_INTERVAL);
    const remainingTime = Math.ceil(
        (HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000
    );

    const triggerLaunch = useCallback(() => {
        setIsLaunched(true);

        // Central burst
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 },
            colors: ["#22c55e", "#16a34a", "#ffffff", "#10b981", "#84cc16"],
            startVelocity: 55,
            ticks: 280,
        });

        // Side cannons
        setTimeout(() => {
            confetti({ particleCount: 100, angle: 60, spread: 60, origin: { x: 0, y: 0.5 }, colors: ["#22c55e", "#ffffff", "#10b981"], startVelocity: 55, ticks: 250 });
            confetti({ particleCount: 100, angle: 120, spread: 60, origin: { x: 1, y: 0.5 }, colors: ["#22c55e", "#ffffff", "#10b981"], startVelocity: 55, ticks: 250 });
        }, 300);

        // Second wave
        setTimeout(() => {
            confetti({ particleCount: 80, spread: 120, origin: { y: 0.3 }, colors: ["#22c55e", "#ffffff", "#84cc16"], startVelocity: 40, ticks: 200 });
        }, 900);

        setTimeout(() => router.push("/showcase"), 9000);
    }, [router]);

    const startHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(true);
    }, [isLaunched]);

    const stopHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(false);
        if (progress < 100) setProgress(0);
    }, [isLaunched, progress]);

    useEffect(() => {
        if (isHolding && !isLaunched) {
            intervalRef.current = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + INCREMENT;
                    if (next >= 100) {
                        clearInterval(intervalRef.current!);
                        triggerLaunch();
                        return 100;
                    }
                    return next;
                });
            }, UPDATE_INTERVAL);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (!isLaunched) setProgress(0);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isHolding, isLaunched, INCREMENT, triggerLaunch]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => { if (e.code === "Space" && !e.repeat) { e.preventDefault(); startHolding(); } };
        const up = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); stopHolding(); } };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
    }, [startHolding, stopHolding]);

    return (
        <div className="h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden select-none">

            {/* ── BACKGROUND ──────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Base radial */}
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 70%)" }} />

                {/* Noise */}
                <div className="absolute inset-0 opacity-25 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                {/* Grid */}
                <div className="absolute inset-0 opacity-[0.18]" style={{
                    backgroundImage: "linear-gradient(rgba(34,197,94,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.15) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage: "radial-gradient(ellipse 75% 65% at 50% 50%, #000 30%, transparent 100%)",
                }} />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-64 h-64 opacity-20" style={{ background: "radial-gradient(circle at 0% 0%, rgba(34,197,94,0.4) 0%, transparent 60%)" }} />
                <div className="absolute top-0 right-0 w-64 h-64 opacity-20" style={{ background: "radial-gradient(circle at 100% 0%, rgba(34,197,94,0.4) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 opacity-15" style={{ background: "radial-gradient(circle at 0% 100%, rgba(16,185,129,0.4) 0%, transparent 60%)" }} />
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-15" style={{ background: "radial-gradient(circle at 100% 100%, rgba(16,185,129,0.4) 0%, transparent 60%)" }} />
            </div>

            {/* ── HEADER ──────────────────────────────────────── */}
            <motion.header
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center pt-8 pb-2 px-6 shrink-0"
            >
                {/* Logo */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-green-400/20 blur-3xl rounded-full scale-150" />
                    <img
                        src="https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png"
                        alt="Government of Balochistan"
                        className="relative object-contain drop-shadow-[0_0_32px_rgba(34,197,94,0.5)]"
                        style={{ width: "clamp(3.5rem, 7vmin, 6rem)", height: "clamp(3.5rem, 7vmin, 6rem)" }}
                    />
                </div>

                {/* Name stack */}
                <div className="flex flex-col items-center gap-1 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.7 }}
                        className="font-bold text-white uppercase"
                        style={{ fontSize: "clamp(1.4rem, 3.5vw, 3.8rem)", letterSpacing: "0.06em", textShadow: "0 0 40px rgba(34,197,94,0.25)" }}
                    >
                        Bureau of Statistics
                    </motion.h1>

                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 0.6 }}
                        transition={{ delay: 0.45, duration: 0.7 }}
                        className="h-px w-20 rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.7 }}
                        className="text-green-400 font-semibold uppercase tracking-[0.22em]"
                        style={{ fontSize: "clamp(0.55rem, 1.1vw, 0.95rem)" }}
                    >
                        Planning &amp; Development Department
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.75, duration: 0.7 }}
                        className="text-neutral-500 uppercase tracking-[0.28em] font-medium"
                        style={{ fontSize: "clamp(0.5rem, 0.8vw, 0.75rem)" }}
                    >
                        Government of Balochistan
                    </motion.p>
                </div>
            </motion.header>

            {/* ── MAIN INTERACTION ────────────────────────────── */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center gap-6 min-h-0">

                {/* Countdown chip */}
                <div style={{ height: "clamp(2.2rem, 4vw, 3.5rem)" }} className="flex items-center justify-center">
                    <AnimatePresence>
                        {isHolding && progress > 0 && progress < 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85 }}
                                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                                className="flex items-center gap-3 px-7 py-2 rounded-full border border-green-400/25 bg-green-500/10 backdrop-blur-xl"
                                style={{ boxShadow: "0 0 30px rgba(34,197,94,0.15), inset 0 0 20px rgba(34,197,94,0.05)" }}
                            >
                                <motion.span
                                    key={remainingTime}
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="font-bold text-green-300 font-mono tabular-nums"
                                    style={{ fontSize: "clamp(1.1rem, 2.2vw, 2rem)" }}
                                >
                                    {remainingTime}
                                </motion.span>
                                <span className="text-green-400/60 font-medium" style={{ fontSize: "clamp(0.6rem, 1vw, 0.9rem)" }}>
                                    sec
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Ring + Button */}
                <div className="relative flex items-center justify-center">

                    {/* Deep ambient glow */}
                    <motion.div
                        animate={{ opacity: isHolding ? 0.8 : 0.2, scale: isHolding ? 1.4 : 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: "clamp(300px, 48vmin, 650px)",
                            height: "clamp(300px, 48vmin, 650px)",
                            background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)",
                            filter: "blur(40px)",
                        }}
                    />

                    {/* Outer pulse ring (idle only) */}
                    <AnimatePresence>
                        {!isHolding && !isLaunched && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.3, 0], scale: [0.95, 1.08, 0.95] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute rounded-full border border-green-500/30 pointer-events-none"
                                style={{ width: "clamp(320px, 51vmin, 680px)", height: "clamp(320px, 51vmin, 680px)" }}
                            />
                        )}
                    </AnimatePresence>

                    {/* SVG ring */}
                    <svg
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none"
                        style={{ width: "clamp(300px, 48vmin, 640px)", height: "clamp(300px, 48vmin, 640px)" }}
                        viewBox="0 0 100 100"
                    >
                        <defs>
                            <linearGradient id="pGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="45%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#84cc16" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                        </defs>
                        {/* Track */}
                        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        {/* Outer faint ring */}
                        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
                        {/* Progress arc */}
                        <motion.circle
                            cx="50" cy="50" r="46"
                            fill="none"
                            stroke="url(#pGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100, opacity: progress > 0 ? 1 : 0.35 }}
                            transition={{ duration: 0.08, ease: "linear" }}
                            style={{ filter: `drop-shadow(0 0 ${5 + (progress / 100) * 24}px rgba(34,197,94,${0.5 + (progress / 100) * 0.5}))` }}
                        />
                        {/* Inner ring */}
                        <motion.circle
                            cx="50" cy="50" r="43"
                            fill="none"
                            stroke="rgba(34,197,94,1)"
                            strokeWidth="0.3"
                            animate={{ strokeOpacity: isHolding ? 0.4 : 0.1 }}
                            transition={{ duration: 0.4 }}
                        />
                    </svg>

                    {/* BUTTON */}
                    <button
                        onMouseDown={startHolding}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
                        onTouchEnd={stopHolding}
                        className={[
                            "relative rounded-full flex items-center justify-center",
                            "border-2 overflow-hidden cursor-pointer transition-all duration-500 ease-out",
                            isHolding
                                ? "border-green-400/50 shadow-[0_0_80px_rgba(34,197,94,0.45),inset_0_0_80px_rgba(34,197,94,0.1)]"
                                : "border-white/8 shadow-[0_16px_60px_rgba(0,0,0,0.6)]",
                        ].join(" ")}
                        style={{
                            width: "clamp(210px, 34vmin, 460px)",
                            height: "clamp(210px, 34vmin, 460px)",
                            background: isHolding
                                ? "radial-gradient(circle at 50% 40%, rgba(34,197,94,0.18) 0%, rgba(16,185,129,0.08) 50%, rgba(4,15,10,0.9) 100%)"
                                : "radial-gradient(circle at 50% 40%, rgba(40,40,40,0.8) 0%, rgba(10,10,10,0.95) 100%)",
                            backdropFilter: "blur(24px)",
                        }}
                    >
                        {/* Shimmer */}
                        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle at 35% 25%, rgba(255,255,255,0.05) 0%, transparent 55%)" }} />
                        {/* Inner border */}
                        <motion.div
                            animate={{ opacity: isHolding ? 1 : 0.3 }}
                            className="absolute rounded-full border pointer-events-none"
                            style={{ inset: "14px", borderColor: "rgba(34,197,94,0.2)" }}
                        />

                        {/* Hand icon */}
                        <motion.div
                            animate={{
                                scale: isHolding ? 1.08 : 1,
                                opacity: isHolding ? 1 : 0.7,
                            }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 flex items-center justify-center rounded-full"
                            style={{
                                padding: "clamp(1.2rem, 2.5vmin, 2.5rem)",
                                background: isHolding
                                    ? "linear-gradient(135deg, #22c55e, #10b981, #16a34a)"
                                    : "rgba(255,255,255,0.06)",
                                boxShadow: isHolding ? "0 0 60px rgba(34,197,94,0.65)" : "none",
                                color: isHolding ? "#000" : "rgba(255,255,255,0.65)",
                                transition: "all 0.35s ease",
                            }}
                        >
                            <HandPalmIcon
                                strokeWidth={isHolding ? 2.2 : 1.4}
                                style={{ width: "clamp(3rem, 6vmin, 6.5rem)", height: "clamp(3rem, 6vmin, 6.5rem)" }}
                            />
                        </motion.div>
                    </button>
                </div>

                {/* Instruction label — always "HOLD TO LAUNCH" */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-center gap-2 text-center"
                >
                    <p
                        className="font-bold uppercase text-white/45 tracking-[0.2em]"
                        style={{ fontSize: "clamp(0.85rem, 1.9vw, 1.75rem)" }}
                    >
                        Hold to Launch
                    </p>
                    <p
                        className="text-neutral-600 uppercase tracking-[0.18em]"
                        style={{ fontSize: "clamp(0.48rem, 0.8vw, 0.72rem)" }}
                    >
                        Place hand on circle · Hold for 5 seconds
                    </p>
                </motion.div>
            </div>

            {/* ── FOOTER ──────────────────────────────────────── */}
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="relative z-10 flex flex-col items-center gap-1.5 pb-7 shrink-0"
            >
                <div className="flex items-center gap-3">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent to-green-500/25" />
                    <Sparkles className="w-3 h-3 text-green-600/60" />
                    <span
                        className="uppercase tracking-[0.22em] font-semibold text-green-500/50"
                        style={{ fontSize: "clamp(0.5rem, 0.8vw, 0.75rem)" }}
                    >
                        System Ready
                    </span>
                    <Sparkles className="w-3 h-3 text-green-600/60" />
                    <div className="h-px w-10 bg-gradient-to-l from-transparent to-green-500/25" />
                </div>
                <p
                    className="text-neutral-600 uppercase tracking-[0.2em] font-medium"
                    style={{ fontSize: "clamp(0.5rem, 0.8vw, 0.75rem)" }}
                >
                    Dashboard and Publications Launch Event
                </p>
            </motion.footer>

            {/* ── LAUNCHED FULL-SCREEN OVERLAY ────────────────── */}
            <AnimatePresence>
                {isLaunched && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
                        style={{ background: "radial-gradient(ellipse 120% 120% at 50% 50%, #031a0c 0%, #020d06 40%, #010804 100%)" }}
                    >
                        {/* Background grid */}
                        <div className="absolute inset-0 opacity-[0.12]" style={{
                            backgroundImage: "linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }} />

                        {/* Central glow */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                width: "clamp(400px, 70vmin, 900px)",
                                height: "clamp(400px, 70vmin, 900px)",
                                background: "radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(16,185,129,0.06) 50%, transparent 75%)",
                                filter: "blur(60px)",
                            }}
                        />

                        {/* Noise */}
                        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />

                        {/* Expanding ring burst */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.2, opacity: 0.8 }}
                                animate={{ scale: 3.5, opacity: 0 }}
                                transition={{ duration: 2, delay: i * 0.35, ease: "easeOut" }}
                                className="absolute rounded-full border border-green-400/40 pointer-events-none"
                                style={{ width: "clamp(200px, 32vmin, 400px)", height: "clamp(200px, 32vmin, 400px)" }}
                            />
                        ))}

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">

                            {/* Check icon */}
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
                                className="flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 via-green-500 to-emerald-600"
                                style={{
                                    width: "clamp(5rem, 10vmin, 10rem)",
                                    height: "clamp(5rem, 10vmin, 10rem)",
                                    boxShadow: "0 0 80px rgba(34,197,94,0.7), 0 0 160px rgba(34,197,94,0.25)",
                                }}
                            >
                                <CheckCircle2
                                    className="text-white"
                                    strokeWidth={2.5}
                                    style={{ width: "55%", height: "55%" }}
                                />
                            </motion.div>

                            {/* LAUNCHED */}
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ type: "spring", stiffness: 180, damping: 20, delay: 0.3 }}
                                className="flex flex-col items-center gap-3"
                            >
                                <h2
                                    className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-green-300 via-green-400 to-emerald-500 uppercase"
                                    style={{
                                        fontSize: "clamp(4rem, 14vw, 16rem)",
                                        letterSpacing: "0.12em",
                                        lineHeight: 1,
                                        filter: "drop-shadow(0 0 40px rgba(34,197,94,0.5))",
                                    }}
                                >
                                    LAUNCHED
                                </h2>

                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="h-0.5 w-full rounded-full bg-gradient-to-r from-transparent via-green-500 to-transparent"
                                />

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.7 }}
                                    className="text-white/70 uppercase tracking-[0.25em] font-semibold"
                                    style={{ fontSize: "clamp(0.75rem, 1.8vw, 1.8rem)" }}
                                >
                                    Dashboard &amp; Publications Successfully Unveiled
                                </motion.p>
                            </motion.div>

                            {/* Department name */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.7 }}
                                className="text-green-400/60 uppercase tracking-[0.3em]"
                                style={{ fontSize: "clamp(0.6rem, 1.1vw, 1rem)" }}
                            >
                                Bureau of Statistics · Planning &amp; Development Department · Government of Balochistan
                            </motion.p>

                            {/* Redirecting */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.7 }}
                                className="flex items-center gap-3 px-8 py-3 rounded-full border border-green-500/20 bg-green-500/8"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="text-green-400/70" style={{ width: "clamp(0.8rem, 1.2vw, 1.1rem)", height: "clamp(0.8rem, 1.2vw, 1.1rem)" }} />
                                </motion.div>
                                <span className="text-green-300/60 uppercase tracking-[0.2em]" style={{ fontSize: "clamp(0.55rem, 1vw, 0.9rem)" }}>
                                    Loading Showcase…
                                </span>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                >
                                    <Sparkles className="text-green-400/70" style={{ width: "clamp(0.8rem, 1.2vw, 1.1rem)", height: "clamp(0.8rem, 1.2vw, 1.1rem)" }} />
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
