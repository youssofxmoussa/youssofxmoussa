"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface CardData {
  lightBg: string;
  darkBg: string;
  content: React.ReactNode;
}

interface ParallaxCardsProps {
  cards: CardData[];
}

const ParallaxCards = ({ cards }: ParallaxCardsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const progress = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // Shorter scroll distance for more responsive feel
    const scrollDistance = window.innerHeight * (cards.length - 1) * 0.8;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: stickyRef.current,
      pinSpacing: true,
      scrub: 0.3, // Lower scrub = more responsive
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [cards.length, progress]);

  return (
    <div ref={containerRef} className="relative">
      <div 
        ref={stickyRef} 
        className="h-screen w-full overflow-hidden"
      >
        {cards.map((card, index) => (
          <StackingCard
            key={index}
            card={card}
            index={index}
            totalCards={cards.length}
            progress={progress}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
};

interface StackingCardProps {
  card: CardData;
  index: number;
  totalCards: number;
  progress: ReturnType<typeof useMotionValue<number>>;
  isMobile: boolean;
}

const StackingCard = ({ card, index, totalCards, progress, isMobile }: StackingCardProps) => {
  const segmentSize = 1 / (totalCards - 1 || 1);
  const isFirstCard = index === 0;
  
  const cardStart = isFirstCard ? 0 : (index - 1) * segmentSize;
  const cardEnd = isFirstCard ? 0 : index * segmentSize;

  // Simple Y transform - no spring for direct response
  const y = useTransform(
    progress,
    isFirstCard 
      ? [0, 1] 
      : [cardStart, cardEnd],
    isFirstCard 
      ? ["0%", "0%"] 
      : ["100%", "0%"]
  );

  // Simple opacity - faster fade in
  const opacity = useTransform(
    progress,
    isFirstCard 
      ? [0, 1]
      : [cardStart, cardStart + segmentSize * 0.1],
    isFirstCard 
      ? [1, 1]
      : [0.5, 1]
  );

  // Dim previous cards
  const nextCardProgress = index * segmentSize;
  const nextCardEnd = Math.min(1, (index + 1) * segmentSize);
  const hasNextCard = index < totalCards - 1;
  
  const dimming = useTransform(
    progress,
    [nextCardProgress, nextCardEnd],
    hasNextCard ? [1, 0.6] : [1, 1]
  );

  const shrink = useTransform(
    progress,
    [nextCardProgress, nextCardEnd],
    hasNextCard ? [1, 0.92] : [1, 1]
  );

  return (
    <motion.div
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden",
        "rounded-t-[2rem] sm:rounded-t-[3rem]",
        card.lightBg,
        card.darkBg
      )}
      style={{
        y,
        opacity,
        zIndex: index + 1,
        // GPU acceleration
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center p-6 sm:p-12"
        style={{
          scale: shrink,
          filter: useTransform(dimming, (d) => `brightness(${d})`),
        }}
      >
        {card.content}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxCards;
