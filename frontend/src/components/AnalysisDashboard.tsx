"use client";

import React, { useState } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Scale,
  Calendar,
  DollarSign,
  Clock,
  Shield,
  Layers,
  MessageSquare,
  UserCheck,
  Building
} from "lucide-react";
import { DocumentAnalysisResponse } from "../types";
import { RiskBadge } from "./RiskBadge";
import { DocumentChat } from "./DocumentChat";
import { LawyerPrep } from "./LawyerPrep";

interface AnalysisDashboardProps {
  data: DocumentAnalysisResponse;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "clauses" | "obligations" | "concerns" | "chat" | "lawyer_prep"
  >("overview");

  const {
    document_id,
    filename,
    page_count,
    document_type,
    simple_summary,
    key_terms,
    important_clauses,
    obligations,
    potential_concerns,
    lawyer_prep
  } = data;

  const highRiskCount = potential_concerns.filter(
    (c) => c.severity.toLowerCase() === "high"
  ).length;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Document Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {document_type}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              &bull; {page_count} {page_count === 1 ? "page" : "pages"}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{filename}</h2>
          <p className="text-xs text-slate-500 mt-1">
            Processed via Gemini Document Understanding &bull; Ephemeral Session ID:{" "}
            <span className="font-mono text-slate-600">{document_id.slice(0, 8)}...</span>
          </p>
        </div>

        {/* Quick Highlights / Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Clauses</span>
            <span className="text-lg font-bold text-slate-800">{important_clauses.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Obligations</span>
            <span className="text-lg font-bold text-slate-800">{obligations.length}</span>
          </div>
          <div
            className={`px-3.5 py-2 rounded-lg border text-center ${
              highRiskCount > 0
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            <span className="text-[11px] font-semibold block uppercase">
              {highRiskCount > 0 ? "Risks Flagged" : "Status"}
            </span>
            <span className="text-lg font-bold">
              {highRiskCount > 0 ? `${highRiskCount} High Risk` : "Clear"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "overview"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Summary & Key Terms</span>
        </button>

        <button
          onClick={() => setActiveSubTab("clauses")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "clauses"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Important Clauses ({important_clauses.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("obligations")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "obligations"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Obligations ({obligations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab("concerns")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "concerns"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>
            Risks & Concerns
            {potential_concerns.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-xs bg-rose-100 text-rose-800">
                {potential_concerns.length}
              </span>
            )}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "chat"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask Your Document</span>
        </button>

        <button
          onClick={() => setActiveSubTab("lawyer_prep")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
            activeSubTab === "lawyer_prep"
              ? "border-indigo-600 text-indigo-700 bg-white shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Prepare for a Lawyer</span>
        </button>
      </div>

      {/* Sub-Tab 1: Overview (Summary & Key Terms) */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Simple Summary Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base mb-3">
              <FileText className="w-5 h-5" />
              <h3>Simple, Plain-English Summary</h3>
            </div>
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-lg border border-slate-200/80">
              {simple_summary}
            </div>
          </div>

          {/* Key Terms Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Key Terms at a Glance</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Parties */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>Parties Involved</span>
                </div>
                <ul className="text-xs text-slate-800 space-y-1">
                  {key_terms.parties_involved && key_terms.parties_involved.length > 0 ? (
                    key_terms.parties_involved.map((party, i) => (
                      <li key={i} className="font-medium">• {party}</li>
                    ))
                  ) : (
                    <li className="text-slate-400 italic">Not explicitly specified</li>
                  )}
                </ul>
              </div>

              {/* Notice Period */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Notice Period</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {key_terms.notice_period || "Standard contractual notice or not specified."}
                </p>
              </div>

              {/* Payment Terms */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Payment Terms</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {key_terms.payment_terms || "Not applicable or not specified."}
                </p>
              </div>

              {/* Termination */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Termination Rules</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {key_terms.termination_terms || "Subject to general contract law."}
                </p>
              </div>

              {/* Term / Duration */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Duration & Effective Date</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {key_terms.effective_date ? `Effective: ${key_terms.effective_date}` : "Effective upon signing."}
                  {key_terms.duration_or_term && ` (${key_terms.duration_or_term})`}
                </p>
              </div>

              {/* Governing Law */}
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase mb-2">
                  <Scale className="w-4 h-4 text-purple-600" />
                  <span>Governing Law & Jurisdiction</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {key_terms.governing_law_jurisdiction || "Standard state/federal jurisdiction."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Important Clauses */}
      {activeSubTab === "clauses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Key Legal Clauses Simplified ({important_clauses.length})
            </h3>
            <span className="text-xs text-slate-500">
              Complex legal language translated into everyday English
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {important_clauses.map((clause, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-900">
                      {clause.clause_title}
                    </h4>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {clause.category}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        What it means in plain English:
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                        {clause.plain_english_summary}
                      </p>
                    </div>

                    <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/70">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-800 block">
                        Practical Implication:
                      </span>
                      <p className="text-xs text-indigo-950 mt-0.5 leading-relaxed font-medium">
                        {clause.practical_implication}
                      </p>
                    </div>
                  </div>
                </div>

                {clause.original_reference && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
                    Ref: {clause.original_reference}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Obligations */}
      {activeSubTab === "obligations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Contractual Obligations & Duties ({obligations.length})
            </h3>
            <span className="text-xs text-slate-500">
              Understand exactly what is required from each party
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {obligations.map((ob, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span className="text-xs font-bold uppercase text-indigo-700">
                    {ob.party}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-900 leading-snug">
                  {ob.obligation_summary}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ob.deadline_or_frequency && (
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Timeline / Deadline</span>
                      <span className="text-slate-700 font-medium">{ob.deadline_or_frequency}</span>
                    </div>
                  )}
                  {ob.consequence_of_breach && (
                    <div>
                      <span className="text-rose-500 block text-[10px] uppercase font-bold">Consequence of Breach</span>
                      <span className="text-slate-700 font-medium">{ob.consequence_of_breach}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Concerns & Risks */}
      {activeSubTab === "concerns" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Potential Concerns & Red Flags ({potential_concerns.length})
            </h3>
            <span className="text-xs text-slate-500">
              Carefully review clauses that may be one-sided or unusually restrictive
            </span>
          </div>

          {potential_concerns.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center text-emerald-800 text-sm">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold">No major red flags or high-risk clauses detected.</p>
              <p className="text-xs mt-1 text-emerald-700">
                This document conforms to standard balanced commercial norms.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {potential_concerns.map((concern, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <RiskBadge severity={concern.severity} />
                      <h4 className="text-sm font-bold text-slate-900">
                        {concern.issue_title}
                      </h4>
                      {concern.clause_reference && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          ({concern.clause_reference})
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {concern.risk_description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Recommended Action / Revision:
                      </span>
                      {concern.recommended_action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 5: Document Chat */}
      {activeSubTab === "chat" && (
        <div>
          <DocumentChat
            documentId={document_id}
            documentTitle={filename}
          />
        </div>
      )}

      {/* Sub-Tab 6: Prepare for a Lawyer */}
      {activeSubTab === "lawyer_prep" && (
        <div>
          <LawyerPrep
            prep={lawyer_prep}
            documentTitle={filename}
            documentType={document_type}
          />
        </div>
      )}
    </div>
  );
};
