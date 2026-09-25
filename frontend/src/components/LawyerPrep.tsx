"use client";

import React, { useState } from "react";
import { Briefcase, HelpCircle, FolderArchive, Copy, Check, Printer, ShieldCheck } from "lucide-react";
import { LawyerPrep as LawyerPrepType } from "../types";

interface LawyerPrepProps {
  prep: LawyerPrepType;
  documentTitle: string;
  documentType: string;
}

export const LawyerPrep: React.FC<LawyerPrepProps> = ({
  prep,
  documentTitle,
  documentType
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyChecklist = () => {
    const text = `
LEGAL CONSULTATION PREPARATION BRIEF
Document: ${documentTitle} (${documentType})
Urgency Rating: ${prep.urgency_rating}

1. KEY DISCUSSION POINTS:
${prep.key_discussion_points.map((p, i) => `   ${i + 1}. ${p}`).join("\n")}

2. SPECIFIC QUESTIONS TO ASK YOUR LAWYER:
${prep.questions_to_ask_lawyer.map((q, i) => `   ${i + 1}. ${q}`).join("\n")}

3. DOCUMENTS & EVIDENCE TO COLLECT:
${prep.documents_and_evidence_to_collect.map((d, i) => `   ${i + 1}. ${d}`).join("\n")}

Disclaimer: LegalLens AI provides general document analysis and legal information. It does not provide formal legal advice.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900">Prepare for a Lawyer</h3>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                prep.urgency_rating.includes("Immediate")
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              {prep.urgency_rating}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured consultation brief generated from {documentTitle} to maximize attorney meeting efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={handleCopyChecklist}
            className="px-3 py-1.5 rounded-md border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied Brief</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Checklist</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Brief</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 key consultation sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Discussion Points */}
        <div className="bg-slate-50/70 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm mb-3">
            <Briefcase className="w-4 h-4 shrink-0" />
            <h4>Important Points to Discuss</h4>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {prep.key_discussion_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-indigo-600 shrink-0">{i + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Questions to Ask */}
        <div className="bg-slate-50/70 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <h4>Questions to Ask Counsel</h4>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {prep.questions_to_ask_lawyer.map((question, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-emerald-600 shrink-0">Q{i + 1}:</span>
                <span className="font-medium text-slate-800">{question}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Documents to Gather */}
        <div className="bg-slate-50/70 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-3">
            <FolderArchive className="w-4 h-4 shrink-0" />
            <h4>Documents to Collect</h4>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {prep.documents_and_evidence_to_collect.map((doc, i) => (
              <li key={i} className="flex items-start gap-2 leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Disclaimer Callout */}
      <div className="bg-slate-100 rounded-lg p-3.5 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <p>
          <strong>Notice:</strong> This preparation list is formulated automatically to help you save billable time with your attorney. Antigravity LegalLens AI is not an attorney.
        </p>
      </div>
    </div>
  );
};
