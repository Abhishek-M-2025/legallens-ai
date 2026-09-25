import json
import logging
import re
from typing import Dict, Any, List, Optional
from backend.config import GEMINI_API_KEY, GEMINI_MODEL, LEGAL_DISCLAIMER

logger = logging.getLogger(__name__)

def clean_json_text(text: str) -> str:
    """Removes markdown code fences and extracts raw JSON text."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

class GeminiService:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model_name = GEMINI_MODEL
        self._client = None
        self._genai_lib = None
        self._init_client()

    def _init_client(self):
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. GeminiService will run in fallback mock mode.")
            return

        # Attempt to use google-genai or google.generativeai
        try:
            from google import genai
            self._client = genai.Client(api_key=self.api_key)
            self._genai_lib = "google-genai"
            logger.info("Initialized google-genai client.")
            return
        except Exception as e:
            logger.info(f"Could not load google-genai client ({e}), trying google.generativeai...")

        try:
            import google.generativeai as gai
            gai.configure(api_key=self.api_key)
            self._client = gai
            self._genai_lib = "google.generativeai"
            logger.info("Initialized google.generativeai client.")
        except Exception as e:
            logger.error(f"Failed to initialize any Gemini client: {e}")
            self._client = None

    def _call_gemini(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """Helper to invoke Gemini API with either library."""
        if not self._client:
            raise RuntimeError("Gemini client is not initialized. Please verify your GEMINI_API_KEY.")

        # Try active models supported by the API
        models_to_try = [
            self.model_name,
            "gemini-3.5-flash",
            "gemini-3.5-flash-lite",
            "gemini-flash-latest",
            "gemini-3.8-flash"
        ]
        # Deduplicate while preserving order
        seen = set()
        models_to_try = [m for m in models_to_try if m and not (m in seen or seen.add(m))]

        last_error = None
        for m_name in models_to_try:
            try:
                if self._genai_lib == "google-genai":
                    config = {}
                    if system_instruction:
                        config["system_instruction"] = system_instruction
                    
                    response = self._client.models.generate_content(
                        model=m_name,
                        contents=prompt,
                        config=config if config else None
                    )
                    return response.text
                elif self._genai_lib == "google.generativeai":
                    model_kwargs = {}
                    if system_instruction:
                        model_kwargs["system_instruction"] = system_instruction
                    model = self._client.GenerativeModel(model_name=m_name, **model_kwargs)
                    response = model.generate_content(prompt)
                    return response.text
            except Exception as ex:
                last_error = ex
                logger.warning(f"Error calling model {m_name}: {ex}. Trying next model...")

        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")

    def analyze_document(self, document_text: str, filename: str) -> Dict[str, Any]:
        """
        Analyzes legal document text to produce:
        - Simple Summary
        - Key Terms
        - Important Clauses
        - Obligations
        - Potential Concerns / Risks
        - Lawyer Preparation details
        """
        if not self._client:
            return self._generate_fallback_analysis(filename, document_text)

        system_instruction = (
            "You are LegalLens AI, an objective, strictly grounded legal document analyst.\n"
            "CRITICAL GROUNDING RULES:\n"
            "- Analyze ONLY the document provided in the current request.\n"
            "- The uploaded document is the ONLY source of truth.\n"
            "- Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.\n"
            "- If information is not explicitly present in the document, return: 'Not specified in the document.'\n"
            "- Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.\n"
            "- Every citation must refer to an actual section/clause in the uploaded document.\n"
            "- Risks must only be based on clauses that actually exist in the uploaded document.\n"
            "- Your output must be strictly valid JSON matching the requested schema.\n"
            "- Avoid legalese. Use plain, high-clarity language while maintaining complete accuracy."
        )

        prompt = f"""Analyze ONLY the document provided in the current request.
The uploaded document is the ONLY source of truth.
Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.
If information is not explicitly present in the document, return: "Not specified in the document."
Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.
Every citation must refer to an actual section/clause in the uploaded document.
Risks must only be based on clauses that actually exist in the uploaded document.

DOCUMENT FILENAME: '{filename}'
DOCUMENT CONTENT:
\"\"\"
{document_text}
\"\"\"

Return ONLY a valid JSON object with the following exact structure:
{{
  "document_type": "string (e.g. Non-Disclosure Agreement, Employment Contract, Lease Agreement, Consulting Agreement, or 'Not specified in the document.')",
  "simple_summary": "string (A plain-English summary based strictly and solely on the uploaded document. If details are missing, state 'Not specified in the document.')",
  "key_terms": {{
    "parties_involved": ["string (Party name and role explicitly named in the document, or 'Not specified in the document.')"],
    "effective_date": "string or 'Not specified in the document.'",
    "duration_or_term": "string or 'Not specified in the document.'",
    "payment_terms": "string or 'Not specified in the document.'",
    "termination_terms": "string or 'Not specified in the document.'",
    "notice_period": "string or 'Not specified in the document.'",
    "governing_law_jurisdiction": "string or 'Not specified in the document.'",
    "confidentiality_duration": "string or 'Not specified in the document.'"
  }},
  "important_clauses": [
    {{
      "clause_title": "string",
      "category": "string (e.g. Termination, Liability, Payment, Confidentiality, Intellectual Property)",
      "plain_english_summary": "string (plain-English explanation based strictly on the clause in the document)",
      "practical_implication": "string (practical implication for the user in real life)",
      "original_reference": "string or null (must refer to an actual section/clause in the uploaded document)"
    }}
  ],
  "obligations": [
    {{
      "party": "string (specific party named in the document)",
      "obligation_summary": "string (clear duty or restriction explicitly stated in the document)",
      "deadline_or_frequency": "string or null",
      "consequence_of_breach": "string or null"
    }}
  ],
  "potential_concerns": [
    {{
      "issue_title": "string",
      "severity": "High | Medium | Low",
      "risk_description": "string (why this could be harmful or one-sided; must only be based on clauses that actually exist in the uploaded document)",
      "clause_reference": "string or null (actual section/clause in the uploaded document)",
      "recommended_action": "string (practical question to ask or revision to request)"
    }}
  ],
  "lawyer_prep": {{
    "urgency_rating": "Immediate Review Recommended | Standard Review | Low Complexity",
    "key_discussion_points": ["string"],
    "questions_to_ask_lawyer": ["string"],
    "documents_and_evidence_to_collect": ["string"]
  }}
}}
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            cleaned = clean_json_text(raw_response)
            data = json.loads(cleaned)
            return data
        except Exception as e:
            logger.error(f"Gemini document analysis failed ({e}). Reverting to fallback.")
            return self._generate_fallback_analysis(filename, document_text)

    def answer_question(self, document_text: str, question: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """
        Answers a document-specific user query using the uploaded document context.
        """
        if not self._client:
            return self._generate_fallback_chat_answer(question, document_text)

        system_instruction = (
            "You are the 'Ask Your Document' chatbot on LegalLens AI.\n"
            "CRITICAL GROUNDING RULES:\n"
            "- Analyze ONLY the document provided in the current request.\n"
            "- The uploaded document is the ONLY source of truth.\n"
            "- Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.\n"
            "- If information is not explicitly present in the document, return: 'Not specified in the document.'\n"
            "- Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.\n"
            "- Every citation must refer to an actual section/clause in the uploaded document.\n"
            "- Explain concepts simply, clearly, and concisely in plain English without jargon.\n"
            "- Provide the answer and any referenced clause or section numbers in JSON format."
        )

        chat_history_formatted = ""
        if history:
            for msg in history[-4:]:
                role = "User" if msg.get("role") == "user" else "Assistant"
                chat_history_formatted += f"{role}: {msg.get('content', '')}\n"

        prompt = f"""Analyze ONLY the document provided in the current request.
The uploaded document is the ONLY source of truth.
Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.
If information is not explicitly present in the document, return: "Not specified in the document."
Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.
Every citation must refer to an actual section/clause in the uploaded document.

DOCUMENT CONTENT:
\"\"\"
{document_text}
\"\"\"

PREVIOUS CONVERSATION:
{chat_history_formatted}

USER QUESTION:
{question}

Return ONLY a valid JSON object with the following keys:
{{
  "answer": "string (Plain-English answer based strictly and exclusively on the uploaded document. If not explicitly found in the document, state: 'Not specified in the document.')",
  "referenced_clauses": ["string (actual clause/section reference from the uploaded document, or empty if none)"],
  "confidence": "High | Medium | Low"
}}
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            cleaned = clean_json_text(raw_response)
            data = json.loads(cleaned)
            return data
        except Exception as e:
            logger.error(f"Gemini chat failed ({e}). Returning fallback response.")
            return self._generate_fallback_chat_answer(question, document_text)

    def compare_documents(self, doc_a_text: str, doc_b_text: str, doc_a_name: str, doc_b_name: str) -> Dict[str, Any]:
        """
        Compares Document A (original/baseline) and Document B (revised/counteroffer).
        """
        if not self._client:
            return self._generate_fallback_comparison(doc_a_name, doc_b_name, doc_a_text, doc_b_text)

        system_instruction = (
            "You are an expert contract difference analyzer for LegalLens AI.\n"
            "CRITICAL GROUNDING RULES:\n"
            "- Analyze ONLY Document A and Document B provided in the current request.\n"
            "- The uploaded documents are the ONLY source of truth.\n"
            "- Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.\n"
            "- If information is not explicitly present in the documents, return: 'Not specified in the document.'\n"
            "- Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.\n"
            "- Every citation or excerpt must refer to an actual section/clause in the uploaded documents.\n"
            "- Highlight added, removed, and modified clauses, changed obligations, and changed key terms based strictly on the text provided."
        )

        prompt = f"""Analyze ONLY Document A and Document B provided in the current request.
The uploaded documents are the ONLY source of truth.
Never use sample data, previous documents, cached content, generic contract templates, assumptions, or outside knowledge.
If information is not explicitly present in the documents, return: "Not specified in the document."
Never fabricate clauses, dates, names, amounts, payment terms, risks, or section numbers.
Every citation or excerpt must refer to an actual section/clause in the uploaded documents.

DOCUMENT A (Baseline: '{doc_a_name}'):
\"\"\"
{doc_a_text}
\"\"\"

DOCUMENT B (Comparison: '{doc_b_name}'):
\"\"\"
{doc_b_text}
\"\"\"

Return ONLY a valid JSON object matching this schema:
{{
  "comparison_summary": "string (Plain-English summary of what has changed between Document A and Document B based only on the provided texts)",
  "doc_a_name": "{doc_a_name}",
  "doc_b_name": "{doc_b_name}",
  "doc_a_type": "string (or 'Not specified in the document.')",
  "doc_b_type": "string (or 'Not specified in the document.')",
  "added_clauses": [
    {{
      "clause_title": "string",
      "status": "Added",
      "doc_a_excerpt": null,
      "doc_b_excerpt": "string (actual excerpt from Document B)",
      "plain_english_explanation": "string",
      "risk_impact": "Favorable | Unfavorable | Neutral"
    }}
  ],
  "removed_clauses": [
    {{
      "clause_title": "string",
      "status": "Removed",
      "doc_a_excerpt": "string (actual excerpt from Document A)",
      "doc_b_excerpt": null,
      "plain_english_explanation": "string",
      "risk_impact": "Favorable | Unfavorable | Neutral"
    }}
  ],
  "modified_clauses": [
    {{
      "clause_title": "string",
      "status": "Modified",
      "doc_a_excerpt": "string (actual excerpt from Document A)",
      "doc_b_excerpt": "string (actual excerpt from Document B)",
      "plain_english_explanation": "string",
      "risk_impact": "Favorable | Unfavorable | Neutral"
    }}
  ],
  "changed_obligations": ["string"],
  "changed_key_terms": {{
    "Payment": "string",
    "Termination": "string",
    "Notice Period": "string",
    "Liability": "string"
  }},
  "overall_risk_shift": "string (Assessment based strictly on compared terms)",
  "recommendations": ["string (Actionable points to negotiate)"]
}}
"""

        try:
            raw_response = self._call_gemini(prompt, system_instruction=system_instruction)
            cleaned = clean_json_text(raw_response)
            data = json.loads(cleaned)
            return data
        except Exception as e:
            logger.error(f"Gemini comparison failed ({e}). Returning fallback comparison.")
            return self._generate_fallback_comparison(doc_a_name, doc_b_name, doc_a_text, doc_b_text)

    # ------------------ Fallback Methods for Offline/Missing Key Mode ------------------
    def _generate_fallback_analysis(self, filename: str, text: str) -> Dict[str, Any]:
        """
        Generic API-key / empty-state message when Gemini API is unavailable or missing.
        Does NOT return any sample or hardcoded contract information.
        """
        message = (
            "Gemini API analysis is unavailable. Please ensure a valid GEMINI_API_KEY is configured in your backend/.env "
            "to analyze this uploaded document."
        )
        return {
            "document_type": "Not specified in the document.",
            "simple_summary": message,
            "key_terms": {
                "parties_involved": ["Not specified in the document."],
                "effective_date": "Not specified in the document.",
                "duration_or_term": "Not specified in the document.",
                "payment_terms": "Not specified in the document.",
                "termination_terms": "Not specified in the document.",
                "notice_period": "Not specified in the document.",
                "governing_law_jurisdiction": "Not specified in the document.",
                "confidentiality_duration": "Not specified in the document."
            },
            "important_clauses": [],
            "obligations": [],
            "potential_concerns": [],
            "lawyer_prep": {
                "urgency_rating": "Standard Review",
                "key_discussion_points": [message],
                "questions_to_ask_lawyer": [],
                "documents_and_evidence_to_collect": []
            }
        }

    def _generate_fallback_chat_answer(self, question: str, text: str) -> Dict[str, Any]:
        """Generic fallback chat response when Gemini API is unavailable or missing."""
        return {
            "answer": "Not specified in the document. (Gemini API analysis is currently unavailable. Please verify your GEMINI_API_KEY.)",
            "referenced_clauses": [],
            "confidence": "Low"
        }

    def _generate_fallback_comparison(self, name_a: str, name_b: str, text_a: str, text_b: str) -> Dict[str, Any]:
        """Generic fallback comparison response when Gemini API is unavailable or missing."""
        return {
            "comparison_summary": "Gemini API comparison is unavailable. Please verify your GEMINI_API_KEY.",
            "doc_a_name": name_a,
            "doc_b_name": name_b,
            "doc_a_type": "Not specified in the document.",
            "doc_b_type": "Not specified in the document.",
            "added_clauses": [],
            "removed_clauses": [],
            "modified_clauses": [],
            "changed_obligations": [],
            "changed_key_terms": {},
            "overall_risk_shift": "Not specified in the document.",
            "recommendations": []
        }

# Global singleton
gemini_service = GeminiService()
