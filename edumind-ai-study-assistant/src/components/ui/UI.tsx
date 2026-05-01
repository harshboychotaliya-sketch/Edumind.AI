import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50 disabled:pointer-events-none shadow-sm",
        "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95",
        className
      )}
      {...props}
    />
  );
};

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return (
    <div
      className={cn("bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden", className)}
      {...props}
    />
  );
};
