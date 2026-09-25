"use client";

import React from "react";
import { Scale, FileText, GitCompare, ShieldAlert } from "lucide-react";

interface HeaderProps {
  activeTab: "analyze" | "compare";
  setActiveTab: (tab: "analyze" | "compare") => void;
  hasDocument: boolean;
  documentName?: string;
  onReset?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasDocument,
  documentName,
  onReset
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      {/* Top Legal Disclaimer Notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-center gap-2 text-center font-medium">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>
          <strong>Legal Disclaimer:</strong> LegalLens AI provides general document analysis and legal information. It does not provide legal advice or replace a licensed attorney.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">LegalLens AI</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  GenAI Assistant
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">AI for Legal Assistance & Access</p>
            </div>
          </div>

          {/* Active Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("analyze")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "analyze"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Document Analysis & Chat</span>
            </button>
            <button
              onClick={() => setActiveTab("compare")}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "compare"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Documents</span>
            </button>
          </nav>

          {/* Right Status */}
          <div className="hidden md:flex items-center gap-3">
            {hasDocument && documentName && (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="truncate max-w-[160px] font-medium">{documentName}</span>
                {onReset && (
                  <button
                    onClick={onReset}
                    className="text-slate-400 hover:text-slate-700 ml-1 underline cursor-pointer"
                    title="Upload different document"
                  >
                    Change
                  </button>
                )}
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Gemini 3.5 Flash Lite
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
