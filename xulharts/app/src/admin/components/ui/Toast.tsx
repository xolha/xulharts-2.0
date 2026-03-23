"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: "bg-roxo text-white",
    error: "bg-red-500 text-white",
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in">
      <div className={`${colors[type]} font-inria px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3`}>
        <span>{type === "success" ? "✓" : "✕"}</span>
        <span>{message}</span>
      </div>
    </div>
  );
}
