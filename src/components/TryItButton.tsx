import { Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TryItButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  showDescription?: boolean;
  descriptionText?: string;
}

const TryItButton: React.FC<TryItButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className,
  showDescription = true,
  descriptionText = "Test this endpoint with your current parameters",
}) => {
  return (
    <div className={clsx("flex flex-col items-center gap-2", className)}>
      <motion.button
        onClick={onClick}
        disabled={disabled || isLoading}
        className={clsx(
          "group relative inline-flex items-center justify-center gap-2",
          "px-5 py-2 rounded-lg",
          "text-sm font-medium text-white",
          "bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600",
          "hover:from-indigo-500 hover:via-purple-500 hover:to-blue-500",
          "shadow-md shadow-indigo-500/40",
          "transition-all duration-300",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
          "overflow-hidden"
        )}
        whileHover={!disabled && !isLoading ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      >
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-white" />
          )}
          <span>{isLoading ? 'Testing...' : 'Try It Now'}</span>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.button>

      {showDescription && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-md">
          {descriptionText}
        </p>
      )}
    </div>
  );
};

export default TryItButton;
