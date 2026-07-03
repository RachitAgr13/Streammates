import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-2xl glass p-6 transition-colors hover:border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/5 to-accent-cyan/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 p-3 text-accent-cyan">
          {icon}
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-white/60">{description}</p>
      </div>
    </motion.div>
  );
}

interface LinkButtonProps {
  to: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  glow?: boolean;
}

export function LinkButton({ to, variant = 'primary', children, glow = false }: LinkButtonProps) {
  const baseStyles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-accent-violet to-accent-purple text-white hover:from-accent-purple hover:to-accent-violet'
      : 'glass-strong text-white hover:bg-white/15 border border-white/20';

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        to={to}
        className={`
          inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4
          text-base font-semibold transition-all duration-200
          ${baseStyles}
          ${glow ? 'glow-violet' : ''}
        `}
      >
        {children}
      </Link>
    </motion.div>
  );
}
