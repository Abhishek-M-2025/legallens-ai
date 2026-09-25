export interface KeyTerms {
  parties_involved: string[];
  effective_date: string | null;
  duration_or_term: string | null;
  payment_terms: string | null;
  termination_terms: string | null;
  notice_period: string | null;
  governing_law_jurisdiction: string | null;
  confidentiality_duration: string | null;
}

export interface ImportantClause {
  clause_title: string;
  category: string;
  plain_english_summary: string;
  practical_implication: string;
  original_reference: string | null;
}

export interface Obligation {
  party: string;
  obligation_summary: string;
  deadline_or_frequency: string | null;
  consequence_of_breach: string | null;
}

export interface PotentialConcern {
  issue_title: string;
  severity: "High" | "Medium" | "Low";
  risk_description: string;
  clause_reference: string | null;
  recommended_action: string;
}

export interface LawyerPrep {
  urgency_rating: "Immediate Review Recommended" | "Standard Review" | "Low Complexity";
  key_discussion_points: string[];
  questions_to_ask_lawyer: string[];
  documents_and_evidence_to_collect: string[];
}

export interface DocumentAnalysisResponse {
  document_id: string;
  filename: string;
  page_count: int;
  document_type: string;
  simple_summary: string;
  key_terms: KeyTerms;
  important_clauses: ImportantClause[];
  obligations: Obligation[];
  potential_concerns: PotentialConcern[];
  lawyer_prep: LawyerPrep;
  disclaimer: string;
}

export type int = number;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  referenced_clauses?: string[];
  confidence?: string;
  timestamp?: string;
}

export interface ChatResponse {
  answer: string;
  referenced_clauses: string[];
  confidence: string;
}

export interface ClauseDiff {
  clause_title: string;
  status: "Added" | "Removed" | "Modified" | "Unchanged";
  doc_a_excerpt?: string | null;
  doc_b_excerpt?: string | null;
  doc_a_version?: string | null;
  doc_b_version?: string | null;
  plain_english_explanation: string;
  risk_impact: "Favorable" | "Unfavorable" | "Neutral";
}

export interface ComparisonResponse {
  comparison_summary: string;
  doc_a_name: string;
  doc_b_name: string;
  doc_a_type: string;
  doc_b_type: string;
  added_clauses: ClauseDiff[];
  removed_clauses: ClauseDiff[];
  modified_clauses: ClauseDiff[];
  changed_obligations: string[];
  changed_key_terms: Record<string, string>;
  overall_risk_shift: string;
  recommendations: string[];
  disclaimer: string;
}

export interface SampleDoc {
  id: string;
  title: string;
  type: string;
  description: string;
}
