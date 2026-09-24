
import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <motion.circle
          cx="20%"
          cy="30%"
          r="400"
          fill="url(#grad1)"
          initial={{ x: -100, y: -100 }}
          animate={{
            x: [0, 50, -20, 0],
            y: [0, -40, 60, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "blur(80px)" }}
        />

        <motion.circle
          cx="80%"
          cy="70%"
          r="500"
          fill="url(#grad2)"
          initial={{ x: 100, y: 100 }}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 70, -40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ filter: "blur(100px)" }}
        />
      </svg>
    </div>
  );
}
