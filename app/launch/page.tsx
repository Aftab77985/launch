"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Rocket, CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function LaunchPage() {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLaunched, setIsLaunched] = useState(false);
    const router = useRouter();
    const controls = useAnimation();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Configuration
    const HOLD_DURATION = 5000; // ms
    const UPDATE_INTERVAL = 20; // ms
    const INCREMENT = 100 / (HOLD_DURATION / UPDATE_INTERVAL);

    const triggerLaunch = useCallback(() => {
        setIsLaunched(true);

        // 1. Initial Burst (Confetti)
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15"],
        });

        // 2. Balloons Effect (Large circles, low gravity)
        const balloonColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
        const end = Date.now() + 1000;

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: balloonColors,
                shapes: ['circle'],
                scalar: 2, // Make them big like balloons
                gravity: 0.5, // Float longer
                drift: 0,
                ticks: 300, // Stay on screen longer
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: balloonColors,
                shapes: ['circle'],
                scalar: 2,
                gravity: 0.5,
                drift: 0,
                ticks: 300,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // 3. Second Burst (Side Cannons)
        setTimeout(() => {
            confetti({
                particleCount: 100,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15"],
            });
            confetti({
                particleCount: 100,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15"],
            });
        }, 500);

        // Redirect - Increased delay to 4 seconds to allow "LAUNCHED" message to be seen
        setTimeout(() => {
            window.location.href = "https://bospnd.balochistan.gov.pk/";
        }, 4000);
    }, []);

    const startHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(true);
        controls.start({ scale: 0.95 });
    }, [isLaunched, controls]);

    const stopHolding = useCallback(() => {
        if (isLaunched) return;
        setIsHolding(false);
        controls.start({ scale: 1 });
        // Reset progress if not complete
        if (progress < 100) {
            setProgress(0);
        }
    }, [isLaunched, progress, controls]);

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
                startHolding();
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
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
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-between py-12 relative overflow-hidden font-sans selection:bg-green-500/30">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(22,163,74,0.15),transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none mix-blend-overlay" />

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Header Branding - Now part of flex flow */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-8"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                    <img
                        src="https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png"
                        alt="Government of Balochistan Logo"
                        className="relative w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
                    />
                </motion.div>

                <div className="flex flex-col items-center gap-3">
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 text-center">
                            Bureau of Statistics
                        </h1>
                        <div className="h-1 w-24 bg-green-500 rounded-full mt-4 mb-4 opacity-50" />
                    </div>

                    <h2 className="text-green-400 font-medium tracking-[0.2em] text-sm md:text-base uppercase text-center">
                        Planning & Development Department
                    </h2>
                    <h3 className="text-neutral-500 text-xs md:text-sm tracking-[0.3em] uppercase font-medium text-center">
                        Government of Balochistan
                    </h3>
                </div>
            </motion.div>

            {/* Main Interaction Area - Flex Grow to center vertically */}
            <div className="relative z-20 flex-grow flex flex-col items-center justify-center w-full">
                <div className="relative group">
                    {/* Glow Effect behind button */}
                    <motion.div
                        animate={{
                            opacity: isHolding ? 0.8 : 0.3,
                            scale: isHolding ? 1.2 : 1,
                        }}
                        className="absolute inset-0 bg-green-500/30 blur-[100px] rounded-full transition-all duration-500"
                    />

                    {/* Progress Ring */}
                    <svg
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 -rotate-90 pointer-events-none"
                        viewBox="0 0 100 100"
                    >
                        {/* Track */}
                        <circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="0.5"
                            strokeOpacity="0.1"
                        />
                        {/* Progress */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="46"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: progress / 100 }}
                            transition={{ duration: 0.1, ease: "linear" }}
                            style={{
                                filter: `drop-shadow(0 0 ${4 + (progress / 100) * 10}px rgba(34, 197, 94, ${0.5 + (progress / 100) * 0.5}))`,
                            }}
                        />
                    </svg>

                    {/* Launch Button */}
                    <motion.button
                        onMouseDown={startHolding}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        onTouchStart={startHolding}
                        onTouchEnd={stopHolding}
                        animate={isHolding && !isLaunched ? {
                            scale: [0.98, 0.99, 0.98],
                        } : controls}
                        transition={isHolding ? {
                            duration: 0.2,
                            repeat: Infinity,
                            repeatType: "reverse"
                        } : undefined}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            relative w-56 h-56 md:w-72 md:h-72 rounded-full flex flex-col items-center justify-center
                            backdrop-blur-xl border transition-all duration-500
                            ${isHolding
                                ? "bg-green-950/30 border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                                : "bg-neutral-900/50 border-white/10 hover:border-white/20 hover:bg-neutral-900/80"
                            }
                            ${isLaunched ? "bg-green-500 border-green-400 scale-110" : ""}
                        `}
                    >
                        <AnimatePresence mode="wait">
                            {!isLaunched ? (
                                <motion.div
                                    key="rocket"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, y: -50 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className={`
                                        p-6 rounded-full transition-all duration-500
                                        ${isHolding ? "bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.4)]" : "bg-white/5 text-white/80"}
                                    `}>
                                        <Rocket className={`w-10 h-10 md:w-14 md:h-14 ${isHolding ? "animate-pulse" : ""}`} fill={isHolding ? "currentColor" : "none"} />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <span className="block text-2xl font-bold text-white tracking-widest">
                                            LAUNCH
                                        </span>
                                        <div className="h-6 flex items-center justify-center overflow-hidden">
                                            <AnimatePresence mode="wait">
                                                {isHolding ? (
                                                    <motion.span
                                                        key="percent"
                                                        initial={{ y: 10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -10, opacity: 0 }}
                                                        className="text-sm text-green-400 font-mono"
                                                    >
                                                        {Math.round(progress)}%
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="text"
                                                        initial={{ y: 10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ y: -10, opacity: 0 }}
                                                        className="text-xs text-neutral-400 uppercase tracking-widest font-medium"
                                                    >
                                                        Hold to Initialize
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="p-6 rounded-full bg-white text-green-600 mb-4 shadow-lg">
                                        <CheckCircle2 className="w-12 h-12" strokeWidth={3} />
                                    </div>
                                    <span className="text-white font-bold text-2xl tracking-widest">
                                        LAUNCHED
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 text-center">
                <div className="flex items-center gap-2 text-neutral-600 mb-2 justify-center">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.3em]">System Ready</span>
                    <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
                    Dashboard Launch Event 2025
                </p>
            </div>
        </div>
    );
}