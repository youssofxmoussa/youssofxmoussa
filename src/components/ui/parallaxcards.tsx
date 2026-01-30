"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring for buttery animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${(cards.length + 1) * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {cards.map((card, index) => (
          <Card
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

interface CardProps {
  card: CardData;
  index: number;
  totalCards: number;
  progress: ReturnType<typeof useSpring>;
  isMobile: boolean;
}

const Card = ({ card, index, totalCards, progress, isMobile }: CardProps) => {
  // Each card takes up 1/(totalCards) of the scroll
  const cardProgress = 1 / totalCards;
  const start = index * cardProgress;
  const end = start + cardProgress;

  // Card starts from bottom and moves up
  const y = useTransform(
    progress,
    [start, end],
    ["100%", "0%"]
  );

  // Slight scale effect as card settles
  const scale = useTransform(
    progress,
    [start, start + cardProgress * 0.5, end],
    [0.95, 0.98, 1]
  );

  // Opacity fade in
  const opacity = useTransform(
    progress,
    [start, start + cardProgress * 0.3],
    [0, 1]
  );

  // Previous cards get pushed down and dimmed slightly
  const stackOffset = useTransform(
    progress,
    [end, Math.min(1, end + cardProgress)],
    [0, isMobile ? 30 : 50]
  );

  const brightness = useTransform(
    progress,
    [end, Math.min(1, end + cardProgress)],
    [1, 0.7]
  );

  const stackScale = useTransform(
    progress,
    [end, Math.min(1, end + cardProgress)],
    [1, 0.95]
  );

  return (
    <motion.div
      className={cn(
        "absolute inset-0 w-full h-full rounded-t-[2rem] sm:rounded-t-[3rem] overflow-hidden",
        card.lightBg,
        card.darkBg
      )}
      style={{
        y,
        scale,
        opacity,
        zIndex: index + 1,
      }}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center p-6 sm:p-12"
        style={{
          y: stackOffset,
          scale: stackScale,
          filter: useTransform(brightness, (b) => `brightness(${b})`),
        }}
      >
        {card.content}
      </motion.div>
    </motion.div>
  );
};

export default ParallaxCards;
