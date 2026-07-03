import { motion } from 'framer-motion';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-stream-950">
      {/* Base gradient mesh */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.35), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(34, 211, 238, 0.15), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(244, 114, 182, 0.12), transparent)',
        }}
      />

      {/* Animated orbs */}
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-accent-violet/20 blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-accent-cyan/15 blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, 60, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent-pink/10 blur-3xl"
        animate={{
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stream-950/80" />
    </div>
  );
}
