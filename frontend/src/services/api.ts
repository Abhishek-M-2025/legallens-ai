
import {
  DocumentAnalysisResponse,
  ChatResponse,
  ComparisonResponse
} from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function checkHealth(): Promise<{
  status: string;
  gemini_api_configured: boolean;
  model: string;
}> {
  const res = await fetch(`${API_BASE_URL}/api/health`);

  if (!res.ok) {
    throw new Error("Backend service unreachable");
  }

  return res.json();
}

export async function analyzeDocument(
  file: File
): Promise<DocumentAnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = "Failed to analyze document.";

    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // fallback
    }

    throw new Error(errorDetail);
  }

  return res.json();
}

export async function askDocumentQuestion(
  documentId: string,
  question: string,
  history: { role: string; content: string }[] = []
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      question,
      history,
    }),
  });

  if (!res.ok) {
    let errorDetail = "Failed to get an answer.";

    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // fallback
    }

    throw new Error(errorDetail);
  }

  return res.json();
}

export async function compareDocuments(
  docA: File,
  docB: File
): Promise<ComparisonResponse> {
  const formData = new FormData();

  formData.append("doc_a", docA);
  formData.append("doc_b", docB);

  const res = await fetch(`${API_BASE_URL}/api/compare`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = "Failed to compare documents.";

    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errorDetail;
    } catch {
      // fallback
    }

    throw new Error(errorDetail);
  }

  return res.json();
}
