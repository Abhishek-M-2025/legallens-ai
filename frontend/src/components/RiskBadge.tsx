import React from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

interface RiskBadgeProps {
  severity: "High" | "Medium" | "Low" | string;
  size?: "sm" | "md";
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = "md" }) => {
  const norm = severity.toLowerCase();
  
  if (norm === "high") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md border border-rose-200 bg-rose-50 text-rose-800 ${
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
        }`}
      >
        <AlertTriangle className={size === "sm" ? "w-3 h-3 text-rose-600" : "w-3.5 h-3.5 text-rose-600"} />
        High Risk
      </span>
    );
  }
  
  if (norm === "medium") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-semibold rounded-md border border-amber-200 bg-amber-50 text-amber-800 ${
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
        }`}
      >
        <AlertCircle className={size === "sm" ? "w-3 h-3 text-amber-600" : "w-3.5 h-3.5 text-amber-600"} />
        Medium Risk
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-md border border-slate-200 bg-slate-100 text-slate-700 ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <Info className={size === "sm" ? "w-3 h-3 text-slate-500" : "w-3.5 h-3.5 text-slate-500"} />
      Low Risk / Advisory
    </span>
  );
};
