
import pytest
import io

from fastapi.testclient import TestClient
from pathlib import Path
from fastapi import UploadFile

from backend.main import app
from backend.services.pdf_service import validate_pdf_file, PDFValidationError


client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"
    assert data["app"] == "LegalLens AI"
    assert "disclaimer" in data


def test_pdf_validation_invalid_extension():
    fake_file = UploadFile(
        filename="contract.docx",
        file=io.BytesIO(b"dummy data")
    )

    with pytest.raises(PDFValidationError) as exc_info:
        validate_pdf_file(fake_file, b"dummy data")

    assert "Only .pdf files are accepted" in str(exc_info.value.detail)


def test_pdf_validation_missing_magic_bytes():
    fake_file = UploadFile(
        filename="fake.pdf",
        file=io.BytesIO(b"not a real pdf content")
    )

    with pytest.raises(PDFValidationError) as exc_info:
        validate_pdf_file(
            fake_file,
            b"not a real pdf content"
        )

    assert "missing %PDF header" in str(exc_info.value.detail)


def test_pdf_validation_empty_file():
    fake_file = UploadFile(
        filename="empty.pdf",
        file=io.BytesIO(b"")
    )

    with pytest.raises(PDFValidationError) as exc_info:
        validate_pdf_file(fake_file, b"")

    assert "empty" in str(exc_info.value.detail).lower()


def test_chat_nonexistent_document():
    chat_response = client.post(
        "/api/chat",
        json={
            "document_id": "non-existent-uuid-1234",
            "question": "What are my obligations?",
            "history": []
        }
    )

    assert chat_response.status_code == 404
    assert "expired or not found" in chat_response.json()["detail"]


def test_compare_documents_flow():
    sample_a = (
        Path(__file__).resolve().parent.parent
        / "sample_docs"
        / "sample_consulting_agreement.pdf"
    )

    sample_b = (
        Path(__file__).resolve().parent.parent
        / "sample_docs"
        / "sample_consulting_agreement_v2.pdf"
    )

    with open(sample_a, "rb") as fa, open(sample_b, "rb") as fb:
        response = client.post(
            "/api/compare",
            files={
                "doc_a": (
                    "sample_consulting_agreement.pdf",
                    fa,
                    "application/pdf"
                ),
                "doc_b": (
                    "sample_consulting_agreement_v2.pdf",
                    fb,
                    "application/pdf"
                )
            }
        )

    assert response.status_code == 200

    comp_data = response.json()

    assert "comparison_summary" in comp_data
    assert "added_clauses" in comp_data
    assert "modified_clauses" in comp_data
    assert "overall_risk_shift" in comp_data
    assert "recommendations" in comp_data
