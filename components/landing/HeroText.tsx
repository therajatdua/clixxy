"use client";

import React, { useRef, useState, useEffect } from "react";
import { Roboto_Flex } from "next/font/google";

const robotoFlex = Roboto_Flex({ subsets: ["latin"], display: "swap" });

interface HeroTextProps {
    firstLine: string;
    secondLine: string;
}

export default function HeroText({ firstLine, secondLine }: HeroTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    let characterCount = 0;

    const renderLine = (text: string) => {
        return (
            <div
                className="flex justify-center items-center leading-none uppercase tracking-tighter"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={(e) => {
                    setIsHovering(true);
                    if (e.touches.length > 0) {
                        setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
                    }
                }}
                onTouchEnd={() => setIsHovering(false)}
            >
                {text.split("").map((char, i) => {
                    if (char === " ") return <span key={i} className="w-3 md:w-6 lg:w-10" />;

                    const idx = characterCount;
                    characterCount++;

                    return (
                        <InteractiveLetter
                            key={i}
                            char={char}
                            mousePos={mousePos}
                            isContainerHovered={isHovering}
                            colorIndex={idx}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className={`${robotoFlex.className} relative flex flex-col items-center justify-center py-10 select-none cursor-default w-full text-text-primary transition-colors duration-500`}
        >
            {/* Mobile Interaction Badge */}
            <div className="absolute -top-6 right-2 md:hidden animate-bounce flex items-center gap-1.5 bg-surface-hover/80 backdrop-blur-sm border border-border text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-full text-text-primary shadow-lg z-20 pointer-events-none">
                <span className="text-accent text-sm leading-none">✨</span> TOUCH ME
            </div>

            {renderLine(firstLine)}
            {renderLine(secondLine)}
        </div>
    );
}

const PALETTE = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#0ea5e9", // light blue
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
];

function InteractiveLetter({
    char,
    mousePos,
    isContainerHovered,
    colorIndex
}: {
    char: string;
    mousePos: { x: number; y: number };
    isContainerHovered: boolean;
    colorIndex: number;
}) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [distance, setDistance] = useState(1000);

    useEffect(() => {
        if (!spanRef.current) return;
        const rect = spanRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = mousePos.x - centerX;
        const dy = mousePos.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        setDistance(dist);
    }, [mousePos]);

    // Max distance a letter reacts to the cursor
    const maxDist = 300;
    // Weight interpolation: normally 900 (thick), drops to 100 (thin) based on proximity
    const baseWeight = 1000;
    const targetWeight = 100;

    // Width interpolation: normally 150 (wide), drops to 25 (narrow)
    const baseWidth = 150;
    const targetWidth = 25;

    let effectRatio = 0;
    if (isContainerHovered && distance < maxDist) {
        // Smoother falloff
        const normalizedDist = distance / maxDist;
        effectRatio = 1 - Math.pow(normalizedDist, 1.5);
    }

    const weight = baseWeight - effectRatio * (baseWeight - targetWeight);
    const width = baseWidth - effectRatio * (baseWidth - targetWidth);

    return (
        <span
            ref={spanRef}
            className={`relative inline-block transition-all duration-100 ease-out text-5xl sm:text-7xl md:text-[5.5rem] lg:text-[7.5rem] xl:text-[9.5rem]`}
            style={{
                fontVariationSettings: `"wdth" ${width}, "wght" ${weight}`,
                color: isContainerHovered ? PALETTE[colorIndex % PALETTE.length] : undefined,
            }}
        >
            {char}
        </span>
    );
}
