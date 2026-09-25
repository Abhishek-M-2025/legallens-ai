
import logging
import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    LEGAL_DISCLAIMER,
)

from backend.models import (
    DocumentAnalysisResponse,
    ChatRequest,
    ChatResponse,
    ComparisonResponse,
)

from backend.services.pdf_service import (
    validate_pdf_file,
    extract_text_and_metadata_from_pdf,
    PDFValidationError,
)

from backend.services.session_service import session_store
from backend.services.gemini_service import gemini_service


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

logger = logging.getLogger("legallens")


app = FastAPI(
    title="LegalLens AI API",
    description="GenAI-powered legal document assistant for plain-English analysis, chat, and comparison.",
    version="1.0.0",
)


# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health_check():
    """Service health and GenAI configuration status."""
    return {
        "status": "healthy",
        "app": "LegalLens AI",
        "model": GEMINI_MODEL,
        "gemini_api_configured": bool(
            GEMINI_API_KEY and len(GEMINI_API_KEY) > 5
        ),
        "disclaimer": LEGAL_DISCLAIMER,
    }


@app.post("/api/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document_endpoint(file: UploadFile = File(...)):
    """
    Upload and analyze a single legal PDF.

    IMPORTANT:
    Only the PDF uploaded in the current request is analyzed.
    No sample/demo document is used.
    """
    try:
        # Read the actual PDF uploaded by the user
        content = await file.read()

        # Validate uploaded PDF
        validate_pdf_file(file, content)

        # Extract text ONLY from the uploaded PDF
        extracted_text, page_count = extract_text_and_metadata_from_pdf(content)

        filename = file.filename or "uploaded_document.pdf"

        logger.info(
            f"Analyzing uploaded PDF '{filename}' "
            f"({page_count} pages, {len(content)} bytes)..."
        )

        # Send ONLY the current uploaded document text to Gemini
        analysis = gemini_service.analyze_document(
            extracted_text,
            filename,
        )

        # Save ONLY the current uploaded document in ephemeral session store
        doc_id = session_store.save_document(
            filename=filename,
            text=extracted_text,
            page_count=page_count,
            analysis=analysis,
        )

        return DocumentAnalysisResponse(
            document_id=doc_id,
            filename=filename,
            page_count=page_count,
            document_type=analysis.get(
                "document_type",
                "Not specified in the document.",
            ),
            simple_summary=analysis.get(
                "simple_summary",
                "Not specified in the document.",
            ),
            key_terms=analysis.get("key_terms", {}),
            important_clauses=analysis.get("important_clauses", []),
            obligations=analysis.get("obligations", []),
            potential_concerns=analysis.get("potential_concerns", []),
            lawyer_prep=analysis.get(
                "lawyer_prep",
                {
                    "urgency_rating": "Standard Review",
                    "key_discussion_points": [],
                    "questions_to_ask_lawyer": [],
                    "documents_and_evidence_to_collect": [],
                },
            ),
            disclaimer=LEGAL_DISCLAIMER,
        )

    except PDFValidationError as pve:
        raise pve

    except Exception as e:
        logger.error(
            f"Error during document analysis: {e}",
            exc_info=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "An error occurred while processing the legal document. "
                "Please check the file and try again."
            ),
        )


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_document(req: ChatRequest):
    """
    Document-grounded Q&A chatbot.

    Answers questions strictly using the currently uploaded document.
    """
    doc_data = session_store.get_document(req.document_id)

    if not doc_data:
        raise HTTPException(
            status_code=404,
            detail=(
                "Document session expired or not found. "
                "Please upload a PDF document first."
            ),
        )

    document_text = doc_data.get("text", "")
    history_dicts = [m.model_dump() for m in req.history]

    try:
        response_data = gemini_service.answer_question(
            document_text=document_text,
            question=req.question,
            history=history_dicts,
        )

        return ChatResponse(
            answer=response_data.get(
                "answer",
                "Not specified in the document.",
            ),
            referenced_clauses=response_data.get(
                "referenced_clauses",
                [],
            ),
            confidence=response_data.get(
                "confidence",
                "High",
            ),
        )

    except Exception as e:
        logger.error(
            f"Chat processing failed: {e}",
            exc_info=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Unable to process your question at this time. "
                "Please try again."
            ),
        )


@app.post("/api/compare", response_model=ComparisonResponse)
async def compare_documents_endpoint(
    doc_a: UploadFile = File(
        ...,
        description="Original/baseline legal PDF",
    ),
    doc_b: UploadFile = File(
        ...,
        description="Updated/counteroffer legal PDF",
    ),
):
    """
    Compare two legal PDF documents.

    Uses ONLY the two PDFs uploaded in the current request.
    """
    try:
        # Read the two PDFs uploaded by the user
        content_a = await doc_a.read()
        content_b = await doc_b.read()

        # Validate both uploaded PDFs
        validate_pdf_file(doc_a, content_a)
        validate_pdf_file(doc_b, content_b)

        # Extract text ONLY from the uploaded documents
        text_a, _ = extract_text_and_metadata_from_pdf(content_a)
        text_b, _ = extract_text_and_metadata_from_pdf(content_b)

        name_a = doc_a.filename or "Document_A.pdf"
        name_b = doc_b.filename or "Document_B.pdf"

        logger.info(
            f"Comparing uploaded documents '{name_a}' vs '{name_b}'..."
        )

        diff_data = gemini_service.compare_documents(
            doc_a_text=text_a,
            doc_b_text=text_b,
            doc_a_name=name_a,
            doc_b_name=name_b,
        )

        return ComparisonResponse(
            comparison_summary=diff_data.get(
                "comparison_summary",
                "Document comparison completed.",
            ),
            doc_a_name=name_a,
            doc_b_name=name_b,
            doc_a_type=diff_data.get(
                "doc_a_type",
                "Baseline Document",
            ),
            doc_b_type=diff_data.get(
                "doc_b_type",
                "Revised Document",
            ),
            added_clauses=diff_data.get(
                "added_clauses",
                [],
            ),
            removed_clauses=diff_data.get(
                "removed_clauses",
                [],
            ),
            modified_clauses=diff_data.get(
                "modified_clauses",
                [],
            ),
            changed_obligations=diff_data.get(
                "changed_obligations",
                [],
            ),
            changed_key_terms=diff_data.get(
                "changed_key_terms",
                {},
            ),
            overall_risk_shift=diff_data.get(
                "overall_risk_shift",
                "Neutral shift in terms.",
            ),
            recommendations=diff_data.get(
                "recommendations",
                [],
            ),
            disclaimer=LEGAL_DISCLAIMER,
        )

    except PDFValidationError as pve:
        raise pve

    except Exception as e:
        logger.error(
            f"Error during document comparison: {e}",
            exc_info=True,
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to compare the documents. "
                "Please verify both files are readable PDFs."
            ),
        )