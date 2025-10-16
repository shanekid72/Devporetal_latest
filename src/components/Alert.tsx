import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  variant?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  variant = 'info', 
  title, 
  children, 
  className 
}) => {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  const variantClasses = {
    info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200',
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200',
    error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 text-green-900 dark:text-green-200',
  };

  const iconClasses = {
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
    success: 'text-green-600 dark:text-green-400',
  };

  return (
    <div className={clsx(
      'rounded-lg border p-4 flex gap-3',
      variantClasses[variant],
      className
    )}>
      <div className="flex-shrink-0">
        <Icon className={clsx('h-5 w-5', iconClasses[variant])} />
      </div>
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1 text-sm">
            {title}
          </h4>
        )}
        <div className="text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Alert;
