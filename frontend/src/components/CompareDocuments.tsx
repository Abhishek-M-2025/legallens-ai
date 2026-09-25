"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  GitCompare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
  MinusCircle,
  Edit3,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { ComparisonResponse } from "../types";
import { compareDocuments } from "../services/api";

export const CompareDocuments: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResponse | null>(null);

  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Both files must be valid PDF documents (.pdf).");
      return false;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg("File size exceeds 15MB limit.");
      return false;
    }
    return true;
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) {
      setErrorMsg("Please upload both Document A and Document B to compare.");
      return;
    }

    setErrorMsg(null);
    setIsComparing(true);

    try {
      const result = await compareDocuments(fileA, fileB);
      setComparisonResult(result);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to compare documents. Please verify both files are valid PDFs.");
    } finally {
      setIsComparing(false);
    }
  };

  const handleReset = () => {
    setFileA(null);
    setFileB(null);
    setComparisonResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Intelligent Contract Redline & Diff</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Compare Two Legal Documents
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
          Upload an original draft (Doc A) and an updated version or counteroffer (Doc B) to instantly spot added, removed, and modified clauses, changed obligations, and liability shifts.
        </p>
      </div>

      {/* Upload Dual Box (only if no result yet) */}
      {!comparisonResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Document A (Original) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                  A
                </span>
                Document A (Original / Baseline Draft)
              </span>

              <div
                onClick={() => fileInputARef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  fileA ? "border-indigo-400 bg-indigo-50/30" : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputARef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      if (validateFile(e.target.files[0])) {
                        setFileA(e.target.files[0]);
                      }
                    }
                  }}
                />

                <div className="flex flex-col items-center">
                  {fileA ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-indigo-600 mb-2" />
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{fileA.name}</p>
                      <p className="text-[11px] text-slate-500">{(fileA.size / 1024).toFixed(1)} KB</p>
                      <span className="text-[11px] text-indigo-600 underline mt-1">Change file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Select Document A (.pdf)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Original contract or baseline draft</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Document B (Updated / Counteroffer) */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-bold">
                  B
                </span>
                Document B (Revised / Counterproposal Draft)
              </span>

              <div
                onClick={() => fileInputBRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  fileB ? "border-emerald-400 bg-emerald-50/30" : "border-slate-300 hover:border-slate-400 bg-slate-50/50"
                }`}
              >
                <input
                  ref={fileInputBRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      if (validateFile(e.target.files[0])) {
                        setFileB(e.target.files[0]);
                      }
                    }
                  }}
                />

                <div className="flex flex-col items-center">
                  {fileB ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{fileB.name}</p>
                      <p className="text-[11px] text-slate-500">{(fileB.size / 1024).toFixed(1)} KB</p>
                      <span className="text-[11px] text-emerald-600 underline mt-1">Change file</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Select Document B (.pdf)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Revised contract or new offer</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              onClick={handleCompare}
              disabled={!fileA || !fileB || isComparing}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                !fileA || !fileB || isComparing
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer"
              }`}
            >
              {isComparing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gemini Analyzing Differences...</span>
                </>
              ) : (
                <>
                  <GitCompare className="w-4 h-4" />
                  <span>Compare Documents</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Comparison Results Dashboard */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Comparison Report
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {comparisonResult.doc_a_name} <span className="text-slate-400 font-normal">vs</span> {comparisonResult.doc_b_name}
              </h3>
            </div>

            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Compare Different Documents</span>
            </button>
          </div>

          {/* High Level Executive Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Executive Comparison Summary</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {comparisonResult.comparison_summary}
            </p>

            {/* Risk Shift Callout */}
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Overall Risk Shift:</strong>
                <span>{comparisonResult.overall_risk_shift}</span>
              </div>
            </div>
          </div>

          {/* Key Term Differences Table */}
          {comparisonResult.changed_key_terms && Object.keys(comparisonResult.changed_key_terms).length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-3">
                Key Terms Alterations
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(comparisonResult.changed_key_terms).map(([term, change], idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">{term}</span>
                    <span className="text-slate-600 leading-relaxed">{change}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Added Clauses Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Added Clauses ({comparisonResult.added_clauses.length})
              </h4>
            </div>

            {comparisonResult.added_clauses.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No entirely new clauses were added in Document B.</p>
            ) : (
              <div className="space-y-3">
                {comparisonResult.added_clauses.map((clause, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{clause.clause_title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Added
                      </span>
                    </div>
                    {clause.doc_b_excerpt && (
                      <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-emerald-200/60">
                        "{clause.doc_b_excerpt}"
                      </p>
                    )}
                    <p className="text-xs text-slate-700">{clause.plain_english_explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modified Clauses Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Modified Clauses ({comparisonResult.modified_clauses.length})
              </h4>
            </div>

            {comparisonResult.modified_clauses.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No existing clauses were modified.</p>
            ) : (
              <div className="space-y-3">
                {comparisonResult.modified_clauses.map((clause, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{clause.clause_title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        Modified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {(clause.doc_a_version || clause.doc_a_excerpt) && (
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Doc A (Original)</span>
                          <p className="font-mono text-slate-700">{clause.doc_a_version || clause.doc_a_excerpt}</p>
                        </div>
                      )}
                      {(clause.doc_b_version || clause.doc_b_excerpt) && (
                        <div className="bg-white p-2.5 rounded border border-slate-200">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 block mb-1">Doc B (Revised)</span>
                          <p className="font-mono text-slate-700">{clause.doc_b_version || clause.doc_b_excerpt}</p>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 pt-1">{clause.plain_english_explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Removed Clauses Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <MinusCircle className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">
                Removed Clauses ({comparisonResult.removed_clauses.length})
              </h4>
            </div>

            {comparisonResult.removed_clauses.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No clauses from Document A were removed.</p>
            ) : (
              <div className="space-y-3">
                {comparisonResult.removed_clauses.map((clause, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{clause.clause_title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Removed in Doc B
                      </span>
                    </div>
                    {clause.doc_a_excerpt && (
                      <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-rose-200/60 line-through">
                        "{clause.doc_a_excerpt}"
                      </p>
                    )}
                    <p className="text-xs text-slate-700">{clause.plain_english_explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommendations for Negotiation */}
          {comparisonResult.recommendations && comparisonResult.recommendations.length > 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
              <h4 className="text-sm font-bold text-indigo-900 mb-2">
                Strategic Recommendations Before Signing Document B:
              </h4>
              <ul className="space-y-1.5 text-xs text-indigo-800">
                {comparisonResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
