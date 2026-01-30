"use client";

import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  const smoothProgress = useSpring(progress, {
    stiffness: 60,
    damping: 25,
    restDelta: 0.0001,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !stickyRef.current) return;

    const scrollDistance = window.innerHeight * (cards.length - 1);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: stickyRef.current,
      pinSpacing: true,
      scrub: 0.8,
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
            progress={smoothProgress}
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
  progress: ReturnType<typeof useSpring>;
  isMobile: boolean;
}

const StackingCard = ({ card, index, totalCards, progress, isMobile }: StackingCardProps) => {
  const segmentSize = 1 / (totalCards - 1 || 1);
  const isFirstCard = index === 0;
  
  // Calculate animation timing for each card
  // First card is always visible
  // Subsequent cards animate from (index-1)*segmentSize to index*segmentSize
  const cardStart = isFirstCard ? 0 : (index - 1) * segmentSize;
  const cardEnd = isFirstCard ? 0 : index * segmentSize;

  // Y position - first card stays, others slide up from bottom
  const y = useTransform(
    progress,
    isFirstCard 
      ? [0, 1] 
      : [cardStart, cardEnd],
    isFirstCard 
      ? ["0%", "0%"] 
      : ["100%", "0%"]
  );

  // Scale animation
  const scale = useTransform(
    progress,
    isFirstCard 
      ? [0, 1]
      : [cardStart, cardStart + segmentSize * 0.3, cardEnd],
    isFirstCard 
      ? [1, 1]
      : [0.85, 0.92, 1]
  );

  // Opacity
  const opacity = useTransform(
    progress,
    isFirstCard 
      ? [0, 1]
      : [cardStart, cardStart + segmentSize * 0.15],
    isFirstCard 
      ? [1, 1]
      : [0, 1]
  );

  // Dim previous cards when next card arrives
  const nextCardProgress = index * segmentSize;
  const nextCardEnd = Math.min(1, (index + 1) * segmentSize);
  const hasNextCard = index < totalCards - 1;
  
  const dimming = useTransform(
    progress,
    [nextCardProgress, nextCardEnd],
    hasNextCard ? [1, 0.55] : [1, 1]
  );

  const shrink = useTransform(
    progress,
    [nextCardProgress, nextCardEnd],
    hasNextCard ? [1, 0.9] : [1, 1]
  );

  const filterValue = useTransform(dimming, (d) => `brightness(${d})`);

  // Shadow
  const shadowOpacity = useTransform(
    progress,
    isFirstCard ? [0, 1] : [cardStart, cardEnd],
    isFirstCard ? [0, 0] : [0, 0.6]
  );

  return (
    <motion.div
      className={cn(
        "absolute inset-0 w-full h-full overflow-hidden will-change-transform",
        "rounded-t-[2rem] sm:rounded-t-[3rem]",
        "backface-hidden",
        card.lightBg,
        card.darkBg
      )}
      style={{
        y,
        scale,
        opacity,
        zIndex: index + 1,
        boxShadow: useTransform(
          shadowOpacity,
          (o) => `0 -40px 100px rgba(0, 0, 0, ${o})`
        ),
      }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center p-6 sm:p-12"
        style={{
          scale: shrink,
          filter: filterValue,
        }}
      >
        {card.content}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxCards;
