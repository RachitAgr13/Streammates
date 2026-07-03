import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-accent-violet to-accent-purple text-white hover:from-accent-purple hover:to-accent-violet',
  secondary:
    'glass-strong text-white hover:bg-white/15 border-white/20',
  ghost: 'text-white/70 hover:text-white hover:bg-white/5',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', glow = false, className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          inline-flex items-center justify-center gap-2 rounded-xl font-semibold
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${glow ? 'glow-violet' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
