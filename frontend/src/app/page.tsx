
"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { DocumentUpload } from "../components/DocumentUpload";
import { AnalysisDashboard } from "../components/AnalysisDashboard";
import { CompareDocuments } from "../components/CompareDocuments";
import { DocumentAnalysisResponse } from "../types";
import { analyzeDocument } from "../services/api";
import {
  Scale,
  ShieldCheck,
  HeartHandshake,
  AlertCircle
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"analyze" | "compare">("analyze");
  const [analysisData, setAnalysisData] =
    useState<DocumentAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyzeFile = async (file: File) => {
    setErrorMsg(null);
    setIsLoading(true);
    setLoadingStep("Uploading document...");

    try {
      setLoadingStep("Extracting text with PDF engine...");

      // Small simulated step transition for smooth UX
      setTimeout(() => {
        setLoadingStep(
          "Gemini analyzing clauses, obligations & risks..."
        );
      }, 700);

      const result = await analyzeDocument(file);
      setAnalysisData(result);
    } catch (err: any) {
      setErrorMsg(
        err.message ||
          "Failed to analyze document. Please check the file and try again."
      );
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleResetDocument = () => {
    setAnalysisData(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasDocument={!!analysisData}
        documentName={analysisData?.filename}
        onReset={handleResetDocument}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {errorMsg && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>

              <button
                onClick={() => setErrorMsg(null)}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {activeTab === "analyze" ? (
          analysisData ? (
            <AnalysisDashboard data={analysisData} />
          ) : (
            <DocumentUpload
              onAnalyzeFile={handleAnalyzeFile}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />
          )
        ) : (
          <CompareDocuments />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white">
              <Scale className="w-3.5 h-3.5" />
            </div>

            <span className="font-bold text-slate-800">
              LegalLens AI
            </span>

            <span>&bull; AI for Legal Assistance & Access</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Ephemeral Processing &bull; No Persistent Storage
            </span>

            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-indigo-600" />
              Not Legal Advice
            </span>
          </div>

          <div>
            Built with Next.js, FastAPI & Google Gemini API
          </div>
        </div>
      </footer>
    </div>
  );
}
