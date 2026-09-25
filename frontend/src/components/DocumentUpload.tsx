"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface DocumentUploadProps {
  onAnalyzeFile: (file: File) => Promise<void>;
  isLoading: boolean;
  loadingStep: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onAnalyzeFile,
  isLoading,
  loadingStep,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please upload a valid PDF document (.pdf).");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size exceeds 15MB limit.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) return;
    onAnalyzeFile(selectedFile);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Powered by Google Gemini 3.5 Flash Lite
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Demystify Legal Documents in Seconds
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Upload any legal contract, NDA, lease, or employment agreement to
          receive clear plain-English summaries, obligation tracking, risk
          warnings, and actionable lawyer preparation.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() =>
            !isLoading && fileInputRef.current?.click()
          }
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50/50"
              : selectedFile
              ? "border-emerald-400 bg-emerald-50/30"
              : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleBrowseChange}
            className="hidden"
            disabled={isLoading}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            {selectedFile ? (
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>
            )}

            {selectedFile ? (
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  {(selectedFile.size / 1024).toFixed(1)} KB &bull; Ready for
                  analysis
                </p>

                <span className="inline-block mt-2 text-xs text-indigo-600 underline font-medium">
                  Click to choose a different PDF
                </span>
              </div>
            ) : (
              <div>
                <p className="text-base font-semibold text-slate-800">
                  Drag & drop your legal PDF here, or{" "}
                  <span className="text-indigo-600 underline">browse</span>
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Supports standard legal agreements up to 15MB (.pdf)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Analyze CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ephemeral session &bull; No documents permanently saved
          </div>

          <button
            onClick={handleAnalyzeClick}
            disabled={!selectedFile || isLoading}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              !selectedFile || isLoading
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm cursor-pointer"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{loadingStep || "Analyzing Document..."}</span>
              </>
            ) : (
              <>
                <span>Analyze Document</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};