import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { triggerHaptic } from '../../utils/haptics';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
  haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'none';
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  haptic = 'light',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-emerge-dark focus:ring-emerge-green disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerge-green text-black hover:bg-emerge-green/90 shadow-[0_0_20px_rgba(74,222,128,0.3)]",
    secondary: "bg-emerge-surface text-white hover:bg-emerge-surface-light border border-white/10",
    outline: "border-2 border-emerge-green text-emerge-green hover:bg-emerge-green/10",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-8 py-5 text-lg"
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  const handleClick = (e: any) => {
    if (haptic !== 'none') {
      triggerHaptic(haptic);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
