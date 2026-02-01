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
  const progress = useMotionValue(0);

  useLayoutEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    // Even shorter scroll for snappy feel
    const scrollDistance = window.innerHeight * (cards.length - 1) * 0.6;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: stickyRef.current,
      pinSpacing: true,
      scrub: 0.1, // Ultra responsive
      onUpdate: (self) => {
        progress.set(self.progress);
      },
    });

    return () => trigger.kill();
  }, [cards.length, progress]);

  return (
    <div ref={containerRef} className="relative">
      <div ref={stickyRef} className="h-screen w-full overflow-hidden">
        {cards.map((card, index) => (
          <StackingCard
            key={index}
            card={card}
            index={index}
            totalCards={cards.length}
            progress={progress}
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
}

const StackingCard = ({ card, index, totalCards, progress }: StackingCardProps) => {
  const segmentSize = 1 / (totalCards - 1 || 1);
  const isFirstCard = index === 0;
  
  const cardStart = isFirstCard ? 0 : (index - 1) * segmentSize;
  const cardEnd = isFirstCard ? 0 : index * segmentSize;

  // Only Y transform - cheapest animation
  const y = useTransform(
    progress,
    isFirstCard ? [0, 1] : [cardStart, cardEnd],
    isFirstCard ? [0, 0] : [100, 0] // Use numbers, not percentages
  );

  // Simple opacity for previous cards (NO filter/brightness - expensive!)
  const nextCardProgress = index * segmentSize;
  const hasNextCard = index < totalCards - 1;
  
  const overlayOpacity = useTransform(
    progress,
    [nextCardProgress, Math.min(1, (index + 1) * segmentSize)],
    hasNextCard ? [0, 0.5] : [0, 0]
  );

  return (
    <motion.div
      className={cn(
        "absolute inset-0 w-full h-full",
        "rounded-t-[2rem] sm:rounded-t-[3rem]",
        card.lightBg,
        card.darkBg
      )}
      style={{
        y: useTransform(y, (v) => `${v}%`),
        zIndex: index + 1,
        willChange: "transform",
      }}
    >
      {/* Content */}
      <div className="w-full h-full flex items-center justify-center p-6 sm:p-12">
        {card.content}
      </div>
      
      {/* Dimming overlay - uses opacity instead of filter (much faster) */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none rounded-t-[2rem] sm:rounded-t-[3rem]"
        style={{ opacity: overlayOpacity }}
      />
    </motion.div>
  );
};

export default ParallaxCards;
