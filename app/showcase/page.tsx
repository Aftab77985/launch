"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, LayoutDashboard, Download, ChevronLeft, ChevronRight, Sparkles, CheckCircle, Home, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Item {
    name: string;
    path: string;
    description: string;
    type: "publication" | "dashboard";
    link?: string;
}

const allItems: Item[] = [
    {
        name: "Balochistan Development Profile",
        path: "/publications/BalochistanDevelopmentProfile.jpeg",
        description: "Comprehensive overview of development initiatives and progress across all districts of Balochistan province",
        type: "publication"
    },
    {
        name: "Development Statistics 2024",
        path: "/publications/DevelopmentstatisticsofBalochistan2024.jpeg",
        description: "Latest statistical data, metrics, and key performance indicators for Balochistan's development sectors",
        type: "publication"
    },
    {
        name: "Trends Analysis Report",
        path: "/publications/TrendsAnalysisofDevelopmentStatisticsofBalochistan.jpeg",
        description: "In-depth analysis of development trends, patterns, and projections for strategic planning",
        type: "publication"
    },
    {
        name: "Bureau of Statistics Dashboard",
        path: "/Dashboards/bos-dashboard.PNG",
        description: "Interactive real-time dashboard for Bureau of Statistics data visualization and analytics",
        type: "dashboard",
        link: "https://bospnd.balochistan.gov.pk/"
    },
    {
        name: "PSDP Dashboard",
        path: "/Dashboards/psdp-dashboard.PNG",
        description: "Public Sector Development Programme monitoring, tracking, and performance analytics platform",
        type: "dashboard",
        link: "https://psdp.pnd.balochistan.gov.pk/"
    }
];

export default function ShowcasePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const currentItem = allItems[currentIndex];

    useEffect(() => {
        // Initial celebration confetti
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
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
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            navigateNext();
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, isAutoPlaying]);

    const navigatePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
        setIsAutoPlaying(false);
    };

    const navigateNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % allItems.length);
    };

    const handleDownload = (item: Item) => {
        const link = document.createElement('a');
        link.href = item.path;
        link.download = item.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            scale: 0.8,
        }),
    };

    return (
        <div className="h-screen bg-gradient-to-br from-[#030303] via-[#050505] to-[#0a0a0a] text-white relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 opacity-20"
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
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => {
                    const positions = [
                        [10 + i * 15, 25 + i * 12, 18 + i * 10],
                        [35 + i * 10, 55 + i * 8, 45 + i * 9],
                    ];
                    return (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-green-500/20 rounded-full blur-sm"
                            style={{
                                left: `${15 + i * 12}%`,
                                top: `${20 + i * 12}%`,
                            }}
                            animate={{
                                x: [`${positions[0][0]}vw`, `${positions[0][1]}vw`, `${positions[0][2]}vw`],
                                y: [`${positions[1][0]}vh`, `${positions[1][1]}vh`, `${positions[1][2]}vh`],
                                scale: [1, 1.8, 1],
                                opacity: [0.2, 0.5, 0.2],
                            }}
                            transition={{
                                duration: 18 + i * 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.7,
                            }}
                        />
                    );
                })}
            </div>

            {/* Success Badge - Top Center */}
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30"
            >
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                </motion.div>
                <span className="text-sm font-bold text-green-300">Launch Successful!</span>
                <Sparkles className="w-4 h-4 text-green-400" />
            </motion.div>

            {/* Main Content Area */}
            <div className="relative h-full flex items-center justify-center px-8 py-20">
                <div className="w-full max-w-7xl mx-auto h-full flex items-center justify-between gap-12">
                    {/* Left Side - Image Showcase */}
                    <div className="flex-1 h-full flex flex-col justify-center">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.3 },
                                    scale: { duration: 0.3 },
                                }}
                                className="relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10"
                            >
                                <Image
                                    src={currentItem.path}
                                    alt={currentItem.name}
                                    fill
                                    className="object-contain bg-neutral-900/50"
                                    priority
                                />

                                {/* Image Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Side - Info Panel */}
                    <div className="flex-1 h-full flex flex-col justify-center max-w-xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8"
                            >
                                {/* Type Badge */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30"
                                >
                                    {currentItem.type === "publication" ? (
                                        <>
                                            <FileText className="w-4 h-4 text-green-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-green-300">Publication</span>
                                        </>
                                    ) : (
                                        <>
                                            <LayoutDashboard className="w-4 h-4 text-green-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider text-green-300">Dashboard</span>
                                        </>
                                    )}
                                </motion.div>

                                {/* Title */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 leading-tight"
                                >
                                    {currentItem.name}
                                </motion.h2>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg text-neutral-300 leading-relaxed"
                                >
                                    {currentItem.description}
                                </motion.p>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    {currentItem.type === "publication" ? (
                                        <button
                                            disabled
                                            className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 opacity-50 cursor-not-allowed transition-all duration-300 w-full"
                                        >
                                            <Download className="w-5 h-5" />
                                            <span className="font-semibold">Download</span>
                                        </button>
                                    ) : (
                                        <a
                                            href={currentItem.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            <span className="font-semibold">Visit Dashboard</span>
                                        </a>
                                    )}
                                </motion.div>

                                {/* Progress Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                                        <span>{currentIndex + 1}</span>
                                        <span>/</span>
                                        <span>{allItems.length}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        {allItems.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setDirection(index > currentIndex ? 1 : -1);
                                                    setCurrentIndex(index);
                                                    setIsAutoPlaying(false);
                                                }}
                                                className="group relative h-1 flex-1 bg-white/10 rounded-full overflow-hidden"
                                            >
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                                                    initial={false}
                                                    animate={{
                                                        scaleX: index === currentIndex ? 1 : 0,
                                                    }}
                                                    transition={{
                                                        duration: index === currentIndex && isAutoPlaying ? 5 : 0.3,
                                                        ease: index === currentIndex && isAutoPlaying ? "linear" : "easeOut"
                                                    }}
                                                    style={{ transformOrigin: "left" }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <button
                onClick={navigatePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 hover:border-green-500/50 hover:bg-neutral-900 transition-all duration-300 shadow-lg hover:scale-110 group"
            >
                <ChevronLeft className="w-6 h-6 text-neutral-400 group-hover:text-green-400 transition-colors" />
            </button>

            <button
                onClick={navigateNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 hover:border-green-500/50 hover:bg-neutral-900 transition-all duration-300 shadow-lg hover:scale-110 group"
            >
                <ChevronRight className="w-6 h-6 text-neutral-400 group-hover:text-green-400 transition-colors" />
            </button>

            {/* Bottom Info Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900/80 backdrop-blur-xl border border-white/10"
            >
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Dashboard and Publications Launch Event
                </span>
                <Sparkles className="w-4 h-4 text-green-400" />
            </motion.div>
        </div>
    );
}
