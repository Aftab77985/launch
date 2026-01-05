"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Rocket } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

// Custom Hand Palm Icon - open raised hand
const HandPalmIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
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

    // Configuration
    const HOLD_DURATION = 5000; // ms
    const UPDATE_INTERVAL = 50; // ms - optimized for smooth performance
    const INCREMENT = 100 / (HOLD_DURATION / UPDATE_INTERVAL);

    // Calculate remaining time in seconds
    const remainingTime = Math.ceil((HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000);

    const triggerLaunch = useCallback(() => {
        setIsLaunched(true);

        // 1. Initial Burst (Confetti) - optimized particle count
        confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#22c55e", "#16a34a", "#ffffff", "#10b981"],
            startVelocity: 40,
            ticks: 200,
        });

        // 2. Side Cannon Bursts - simplified
        setTimeout(() => {
            confetti({
                particleCount: 60,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#10b981"],
                startVelocity: 45,
                ticks: 150,
            });
            confetti({
                particleCount: 60,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#10b981"],
                startVelocity: 45,
                ticks: 150,
            });
        }, 300);

        // Navigate to showcase page after 3 seconds
        setTimeout(() => {
            router.push("/showcase");
        }, 3000);
    }, [router]);

    const startHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(true);
    }, [isLaunched]);

    const stopHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(false);
        // Reset progress if not complete
        if (progress < 100) {
            setProgress(0);
        }
    }, [isLaunched, progress]);

    // Timer logic
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

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHolding, isLaunched, INCREMENT, triggerLaunch]);

    // Keyboard support (Spacebar)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space" && !e.repeat) {
                e.preventDefault();
                startHolding();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                stopHolding();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [startHolding, stopHolding]);

    return (
        <div className="h-screen bg-linear-to-br from-[#030303] via-[#050505] to-[#0a0a0a] text-white flex flex-col items-center justify-between py-6 md:py-8 relative overflow-hidden font-sans selection:bg-green-500/30">
            {/* Static Gradient Background - optimized for performance */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)"
                }}
            />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none mix-blend-overlay" />

            {/* Grid Pattern - static for performance */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none opacity-40" />

            {/* Floating Orbs - reduced count for performance */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-500/20 rounded-full blur-sm"
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${25 + i * 20}%`,
                    }}
                />
            ))}

            {/* Header Branding - Compact */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-4 flex-shrink-0"
            >
                <div className="relative group">
                    {/* Static glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/15 blur-2xl rounded-full" />

                    <img
                        src="https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png"
                        alt="Government of Balochistan Logo"
                        className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-105"
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center">
                        <motion.h1
                            className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 text-center px-4 uppercase"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            Bureau of Statistics
                        </motion.h1>

                        <motion.div
                            className="h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full mt-3 mb-2"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 80, opacity: 0.6 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                        />
                    </div>

                    <motion.h2
                        className="text-green-400 font-semibold tracking-[0.2em] text-xs md:text-sm uppercase text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        Planning & Development Department
                    </motion.h2>

                    <motion.h3
                        className="text-neutral-400 text-[10px] md:text-xs tracking-[0.3em] uppercase font-medium text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        Government of Balochistan
                    </motion.h3>
                </div>
            </motion.div>

            {/* Main Interaction Area - Flex Grow to center vertically */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center w-full min-h-0">
                <div className="flex flex-col items-center gap-4 md:gap-6">
                    {/* Countdown Timer */}
                    <AnimatePresence>
                        {isHolding && progress > 0 && progress < 100 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl shadow-lg shadow-green-500/20">
                                    <Rocket className="w-4 h-4 text-green-400" />
                                    <motion.span
                                        key={remainingTime}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xl font-bold text-green-400 font-mono min-w-[2ch] text-center"
                                    >
                                        {remainingTime}
                                    </motion.span>
                                    <span className="text-xs text-green-300/70 font-medium">sec</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        {/* Enhanced Glow Effect behind button */}
                        <motion.div
                            animate={{
                                opacity: isHolding ? 1 : 0.4,
                                scale: isHolding ? 1.2 : 1,
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-gradient-to-br from-green-500/40 via-emerald-500/30 to-lime-500/40 blur-[80px] rounded-full"
                        />

                        {/* Multi-layer Progress Rings */}
                        <svg
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 -rotate-90 pointer-events-none"
                            viewBox="0 0 100 100"
                        >
                        <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="50%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#84cc16" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Outer Track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="47"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="0.3"
                            strokeOpacity="0.1"
                        />

                        {/* Main Track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="0.8"
                            strokeOpacity="0.08"
                        />

                        {/* Progress Circle with Gradient */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            filter="url(#glow)"
                            initial={{ pathLength: 0 }}
                            animate={{
                                pathLength: progress / 100,
                                opacity: progress > 0 ? 1 : 0.5
                            }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            style={{
                                filter: `drop-shadow(0 0 ${6 + (progress / 100) * 16}px rgba(34, 197, 94, ${0.6 + (progress / 100) * 0.4}))`,
                            }}
                        />

                        {/* Inner decorative ring */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="44"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="0.5"
                            strokeOpacity="0.2"
                            animate={{
                                strokeOpacity: isHolding ? 0.4 : 0.2,
                            }}
                        />
                    </svg>

                        {/* Launch Button */}
                        <button
                            onMouseDown={startHolding}
                            onMouseUp={stopHolding}
                            onMouseLeave={stopHolding}
                            onTouchStart={startHolding}
                            onTouchEnd={stopHolding}
                            className={`
                                relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center
                                backdrop-blur-2xl border-2 transition-all duration-300 ease-out overflow-hidden
                                ${isHolding
                                    ? "bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-green-950/40 border-green-400/60 shadow-[0_0_60px_rgba(34,197,94,0.4),inset_0_0_60px_rgba(34,197,94,0.1)]"
                                    : "bg-gradient-to-br from-neutral-900/60 via-neutral-800/50 to-neutral-900/60 border-white/10 hover:border-green-500/30 hover:bg-gradient-to-br hover:from-neutral-900/80 hover:via-neutral-800/70 hover:to-neutral-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                                }
                                ${isLaunched ? "bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 border-green-300 scale-110 shadow-[0_0_100px_rgba(34,197,94,0.8)]" : ""}
                            `}
                        >
                        {/* Inner glow ring */}
                        <div className={`absolute inset-4 rounded-full border transition-all duration-300 ease-out ${
                            isHolding
                                ? "border-green-400/30 shadow-[inset_0_0_40px_rgba(34,197,94,0.2)]"
                                : "border-white/5"
                        }`} />

                        {/* Static shimmer effect */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08) 0%, transparent 50%)"
                            }}
                        />
                            <AnimatePresence mode="wait">
                                {!isLaunched ? (
                                    <motion.div
                                        key="rocket"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, rotateZ: 180, y: -100 }}
                                        transition={{ duration: 0.5 }}
                                        className="flex flex-col items-center gap-6 z-10"
                                    >
                                        <div
                                            className={`
                                                relative p-6 md:p-8 rounded-full transition-all duration-300 ease-out
                                                ${isHolding
                                                    ? "bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.6)]"
                                                    : "bg-gradient-to-br from-white/10 to-white/5 text-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                                                }
                                            `}
                                        >
                                            <HandPalmIcon
                                                className={`w-20 h-20 md:w-24 md:h-24 relative z-10 transition-all duration-300 ${
                                                    isHolding ? "drop-shadow-lg" : ""
                                                }`}
                                                strokeWidth={isHolding ? 2 : 1.5}
                                            />
                                        </div>

                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.3 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="flex flex-col items-center gap-4 z-10"
                                    >
                                        <div className="relative p-5 md:p-6 rounded-full bg-gradient-to-br from-white via-green-50 to-white text-green-600 shadow-[0_0_50px_rgba(34,197,94,0.7)]">
                                            <CheckCircle2 className="w-11 h-11 md:w-12 md:h-12 relative z-10" strokeWidth={3} />
                                        </div>

                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className="text-white font-bold text-2xl md:text-3xl tracking-[0.2em] drop-shadow-lg">
                                                LAUNCHED
                                            </span>
                                            <div className="flex items-center gap-2 text-green-400">
                                                <Sparkles className="w-3 h-3" />
                                                <span className="text-xs font-medium tracking-wider">Redirecting...</span>
                                                <Sparkles className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer - simplified for performance */}
            <motion.div
                className="relative z-10 text-center flex-shrink-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <div className="flex items-center gap-2 text-neutral-500 mb-2 justify-center">
                    <Sparkles className="w-3 h-3 text-green-500/70" />
                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold bg-gradient-to-r from-neutral-400 via-green-400 to-neutral-400 bg-clip-text text-transparent">
                        System Ready
                    </span>
                    <Sparkles className="w-3 h-3 text-green-500/70" />
                </div>

                <div className="space-y-1">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-medium">
                        Dashboard and Publications Launch Event
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-6 bg-gradient-to-r from-transparent to-green-500/30" />
                        <div className="w-1 h-1 rounded-full bg-green-500/50" />
                        <div className="h-px w-6 bg-gradient-to-l from-transparent to-green-500/30" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}