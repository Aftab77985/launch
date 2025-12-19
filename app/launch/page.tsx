"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Fingerprint, CheckCircle2, Sparkles, Rocket } from "lucide-react";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

export default function LaunchPage() {
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLaunched, setIsLaunched] = useState(false);
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const router = useRouter();
    const controls = useAnimation();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Configuration
    const HOLD_DURATION = 5000; // ms
    const UPDATE_INTERVAL = 20; // ms
    const INCREMENT = 100 / (HOLD_DURATION / UPDATE_INTERVAL);

    // Calculate remaining time in seconds
    const remainingTime = Math.ceil((HOLD_DURATION - (progress / 100) * HOLD_DURATION) / 1000);

    const triggerLaunch = useCallback(() => {
        setIsLaunched(true);

        // 1. Initial Burst (Confetti) - Enhanced
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15", "#10b981", "#84cc16"],
            startVelocity: 45,
            ticks: 400,
        });

        // 2. Balloons Effect (Large circles, low gravity) - Enhanced
        const balloonColors = ["#22c55e", "#10b981", "#84cc16", "#facc15", "#fbbf24", "#4ade80"];
        const end = Date.now() + 1500;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 60,
                origin: { x: 0 },
                colors: balloonColors,
                shapes: ['circle'],
                scalar: 2.5,
                gravity: 0.4,
                drift: 0.5,
                ticks: 350,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 60,
                origin: { x: 1 },
                colors: balloonColors,
                shapes: ['circle'],
                scalar: 2.5,
                gravity: 0.4,
                drift: -0.5,
                ticks: 350,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // 3. Rocket Trail Effect
        setTimeout(() => {
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min: number, max: number) {
                return Math.random() * (max - min) + min;
            }

            (function frame() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return;
                }

                const particleCount = 50 * (timeLeft / duration);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ["#22c55e", "#10b981", "#84cc16"],
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ["#22c55e", "#10b981", "#84cc16"],
                });

                requestAnimationFrame(frame);
            }());
        }, 200);

        // 4. Final Cannon Bursts - Enhanced
        setTimeout(() => {
            confetti({
                particleCount: 120,
                angle: 60,
                spread: 70,
                origin: { x: 0 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15", "#10b981"],
                startVelocity: 55,
            });
            confetti({
                particleCount: 120,
                angle: 120,
                spread: 70,
                origin: { x: 1 },
                colors: ["#22c55e", "#16a34a", "#ffffff", "#facc15", "#10b981"],
                startVelocity: 55,
            });
        }, 500);

        // Navigate to showcase page after 3 seconds
        setTimeout(() => {
            router.push("/showcase");
        }, 3000);
    }, [router]);

    const startHolding = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
        if (isLaunched) return;
        setIsHolding(true);
        controls.start({ scale: 0.95 });

        // Add ripple effect
        if (e && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = 'clientX' in e ? e.clientX - rect.left : rect.width / 2;
            const y = 'clientY' in e ? e.clientY - rect.top : rect.height / 2;

            setRipples(prev => [...prev, { id: Date.now(), x, y }]);
            setTimeout(() => {
                setRipples(prev => prev.slice(1));
            }, 600);
        }
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
        <div className="h-screen bg-gradient-to-br from-[#030303] via-[#050505] to-[#0a0a0a] text-white flex flex-col items-center justify-between py-6 md:py-8 relative overflow-hidden font-sans selection:bg-green-500/30">
            {/* Animated Gradient Background */}
            <motion.div
                className="absolute inset-0 opacity-30 pointer-events-none"
                animate={{
                    background: [
                        "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 80% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 50% 80%, rgba(132, 204, 22, 0.15) 0%, transparent 50%)",
                        "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
                    ]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            {/* Noise Texture */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none mix-blend-overlay" />

            {/* Enhanced Grid Pattern */}
            <motion.div
                className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none"
                animate={{
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating Orbs */}
            {[...Array(8)].map((_, i) => {
                const positions = [
                    [10 + i * 12, 20 + i * 10, 15 + i * 8],
                    [30 + i * 8, 50 + i * 6, 40 + i * 7],
                ];
                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-green-500/30 rounded-full blur-sm"
                        style={{
                            left: `${10 + i * 10}%`,
                            top: `${15 + i * 10}%`,
                        }}
                        animate={{
                            x: [`${positions[0][0]}vw`, `${positions[0][1]}vw`, `${positions[0][2]}vw`],
                            y: [`${positions[1][0]}vh`, `${positions[1][1]}vh`, `${positions[1][2]}vh`],
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 15 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                );
            })}

            {/* Header Branding - Compact */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-4 flex-shrink-0"
            >
                <motion.div
                    animate={{
                        y: [0, -8, 0],
                        rotateZ: [0, 2, 0, -2, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative group"
                >
                    {/* Enhanced glow effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/20 blur-2xl rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Ring decoration */}
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-500/20"
                        animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    />

                    <img
                        src="https://cdn.bospnd.balochistan.gov.pk/assets/gob-logo.png"
                        alt="Government of Balochistan Logo"
                        className="relative w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-105"
                    />
                </motion.div>

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

                        {/* Launch Button with 3D Effect */}
                        <motion.button
                            ref={buttonRef}
                            onMouseDown={startHolding}
                            onMouseUp={stopHolding}
                            onMouseLeave={stopHolding}
                            onTouchStart={startHolding}
                            onTouchEnd={stopHolding}
                            animate={isHolding && !isLaunched ? {
                                scale: [0.96, 0.98, 0.96],
                            } : controls}
                            transition={isHolding ? {
                                duration: 0.3,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            } : { duration: 0.3 }}
                            whileHover={{ scale: 1.03, rotateZ: [0, 1, -1, 0] }}
                            whileTap={{ scale: 0.96 }}
                            className={`
                                relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center
                                backdrop-blur-2xl border-2 transition-all duration-700 overflow-hidden
                                ${isHolding
                                    ? "bg-gradient-to-br from-green-950/40 via-emerald-950/30 to-green-950/40 border-green-400/60 shadow-[0_0_60px_rgba(34,197,94,0.4),inset_0_0_60px_rgba(34,197,94,0.1)]"
                                    : "bg-gradient-to-br from-neutral-900/60 via-neutral-800/50 to-neutral-900/60 border-white/10 hover:border-green-500/30 hover:bg-gradient-to-br hover:from-neutral-900/80 hover:via-neutral-800/70 hover:to-neutral-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
                                }
                                ${isLaunched ? "bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 border-green-300 scale-110 shadow-[0_0_100px_rgba(34,197,94,0.8)]" : ""}
                            `}
                        >
                        {/* Ripple Effects */}
                        {ripples.map((ripple) => (
                            <motion.span
                                key={ripple.id}
                                className="absolute rounded-full border-2 border-green-400/50 bg-green-500/10"
                                style={{
                                    left: ripple.x,
                                    top: ripple.y,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                initial={{ width: 0, height: 0, opacity: 0.8 }}
                                animate={{
                                    width: 400,
                                    height: 400,
                                    opacity: 0
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        ))}

                        {/* Inner glow ring */}
                        <div className={`absolute inset-4 rounded-full border transition-all duration-500 ${
                            isHolding
                                ? "border-green-400/30 shadow-[inset_0_0_40px_rgba(34,197,94,0.2)]"
                                : "border-white/5"
                        }`} />

                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full"
                            animate={{
                                background: [
                                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                    "radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
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
                                        <motion.div
                                            className={`
                                                relative p-5 md:p-6 rounded-full transition-all duration-700
                                                ${isHolding
                                                    ? "bg-gradient-to-br from-green-400 via-green-500 to-emerald-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.6),inset_0_-10px_20px_rgba(0,0,0,0.2)]"
                                                    : "bg-gradient-to-br from-white/10 to-white/5 text-white/80 shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
                                                }
                                            `}
                                            animate={isHolding ? {
                                                rotate: [0, -5, 5, -5, 5, 0],
                                                scale: [1, 1.05, 1],
                                            } : {}}
                                            transition={isHolding ? {
                                                duration: 0.5,
                                                repeat: Infinity,
                                            } : {}}
                                        >
                                            {/* Icon glow */}
                                            {isHolding && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full bg-green-400/50 blur-xl"
                                                    animate={{
                                                        scale: [1, 1.3, 1],
                                                        opacity: [0.5, 0.8, 0.5],
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                    }}
                                                />
                                            )}

                                            <Fingerprint
                                                className={`w-10 h-10 md:w-12 md:h-12 relative z-10 transition-all duration-300 ${
                                                    isHolding ? "drop-shadow-lg" : ""
                                                }`}
                                                strokeWidth={isHolding ? 2.5 : 2}
                                            />
                                        </motion.div>

                                        <div className="text-center space-y-1.5">
                                            <motion.span
                                                className="block text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 tracking-[0.2em]"
                                                animate={isHolding ? {
                                                    scale: [1, 1.05, 1],
                                                } : {}}
                                                transition={{
                                                    duration: 0.5,
                                                    repeat: Infinity,
                                                }}
                                            >
                                                LAUNCH
                                            </motion.span>

                                            <div className="h-5 flex items-center justify-center overflow-hidden">
                                                <AnimatePresence mode="wait">
                                                    {isHolding ? (
                                                        <motion.div
                                                            key="percent"
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -20, opacity: 0 }}
                                                            className="flex items-center gap-1.5"
                                                        >
                                                            <span className="text-sm md:text-base text-green-400 font-mono font-bold">
                                                                {Math.round(progress)}%
                                                            </span>
                                                            <motion.div
                                                                className="flex gap-0.5"
                                                                animate={{
                                                                    opacity: [1, 0.5, 1]
                                                                }}
                                                                transition={{
                                                                    duration: 1,
                                                                    repeat: Infinity
                                                                }}
                                                            >
                                                                {[...Array(3)].map((_, i) => (
                                                                    <motion.div
                                                                        key={i}
                                                                        className="w-0.5 h-0.5 bg-green-400 rounded-full"
                                                                        animate={{
                                                                            scale: [1, 1.5, 1],
                                                                            opacity: [0.5, 1, 0.5]
                                                                        }}
                                                                        transition={{
                                                                            duration: 1,
                                                                            repeat: Infinity,
                                                                            delay: i * 0.15
                                                                        }}
                                                                    />
                                                                ))}
                                                            </motion.div>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.span
                                                            key="text"
                                                            initial={{ y: 20, opacity: 0 }}
                                                            animate={{ y: 0, opacity: 1 }}
                                                            exit={{ y: -20, opacity: 0 }}
                                                            className="text-[10px] md:text-xs text-neutral-400 uppercase tracking-[0.25em] font-medium"
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
                                        initial={{ opacity: 0, scale: 0.3, rotateZ: -180 }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            rotateZ: 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="flex flex-col items-center gap-4 z-10"
                                    >
                                        <motion.div
                                            className="relative p-5 md:p-6 rounded-full bg-gradient-to-br from-white via-green-50 to-white text-green-600 shadow-2xl"
                                            animate={{
                                                boxShadow: [
                                                    "0 0 40px rgba(34, 197, 94, 0.6)",
                                                    "0 0 60px rgba(34, 197, 94, 0.8)",
                                                    "0 0 40px rgba(34, 197, 94, 0.6)",
                                                ],
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                            }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-green-400/30 blur-2xl"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.5, 0.8, 0.5],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />

                                            <CheckCircle2 className="w-11 h-11 md:w-12 md:h-12 relative z-10" strokeWidth={3} />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex flex-col items-center gap-1.5"
                                        >
                                            <span className="text-white font-bold text-2xl md:text-3xl tracking-[0.2em] drop-shadow-lg">
                                                LAUNCHED
                                            </span>
                                            <motion.div
                                                className="flex items-center gap-2 text-green-400"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <Sparkles className="w-3 h-3" />
                                                <span className="text-xs font-medium tracking-wider">Redirecting...</span>
                                                <Sparkles className="w-3 h-3" />
                                            </motion.div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <motion.div
                className="relative z-10 text-center flex-shrink-0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <motion.div
                    className="flex items-center gap-2 text-neutral-500 mb-2 justify-center"
                    animate={{
                        opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: [0, 180, 360],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Sparkles className="w-3 h-3 text-green-500/70" />
                    </motion.div>

                    <span className="text-[10px] uppercase tracking-[0.25em] font-semibold bg-gradient-to-r from-neutral-400 via-green-400 to-neutral-400 bg-clip-text text-transparent">
                        System Ready
                    </span>

                    <motion.div
                        animate={{
                            rotate: [360, 180, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    >
                        <Sparkles className="w-3 h-3 text-green-500/70" />
                    </motion.div>
                </motion.div>

                <div className="space-y-1">
                    <p className="text-[10px] text-neutral-400 uppercase tracking-[0.2em] font-medium">
                        Dashboard and Publications Launch Event
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-6 bg-gradient-to-r from-transparent to-green-500/30" />
                        <motion.div
                            className="w-1 h-1 rounded-full bg-green-500/50"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity
                            }}
                        />
                        <div className="h-px w-6 bg-gradient-to-l from-transparent to-green-500/30" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}