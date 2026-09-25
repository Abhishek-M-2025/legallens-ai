import io
from typing import Tuple
from fastapi import UploadFile, HTTPException
from pypdf import PdfReader
from backend.config import MAX_FILE_SIZE_BYTES, ALLOWED_EXTENSIONS

class PDFValidationError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=400, detail=detail)

def validate_pdf_file(file: UploadFile, content: bytes) -> None:
    """Validate file extension, size, and PDF magic bytes."""
    filename = file.filename or ""
    lower_name = filename.lower()
    
    if not any(lower_name.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        raise PDFValidationError("Invalid file extension. Only .pdf files are accepted.")
        
    if len(content) == 0:
        raise PDFValidationError("The uploaded PDF file is empty.")
        
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise PDFValidationError(f"File size exceeds the limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.")
        
    # Check PDF magic bytes (%PDF-)
    if not content.startswith(b"%PDF-"):
        raise PDFValidationError("File does not appear to be a valid PDF document (missing %PDF header).")

def extract_text_and_metadata_from_pdf(content: bytes) -> Tuple[str, int]:
    """
    Extracts text content and page count from raw PDF bytes.
    Raises PDFValidationError on encrypted, corrupted, or unreadable PDFs.
    """
    try:
        stream = io.BytesIO(content)
        reader = PdfReader(stream)
        
        if reader.is_encrypted:
            try:
                reader.decrypt("")
            except Exception:
                raise PDFValidationError("Password-protected or encrypted PDFs are not supported. Please upload an unlocked PDF.")
                
        page_count = len(reader.pages)
        if page_count == 0:
            raise PDFValidationError("The PDF has zero readable pages.")
            
        extracted_pages = []
        for idx, page in enumerate(reader.pages):
            try:
                page_text = page.extract_text() or ""
                extracted_pages.append(f"--- Page {idx + 1} ---\n{page_text.strip()}")
            except Exception:
                extracted_pages.append(f"--- Page {idx + 1} ---\n[Could not extract text from this page]")
                
        full_text = "\n\n".join(extracted_pages).strip()
        
        if len(full_text.strip()) < 20:
            # Document might be scanned images only
            full_text = (
                "[Notice: This document may be a scanned image or contains minimal extractable text. "
                "Analysis will proceed on available document metadata and contents.]\n\n" + full_text
            )
            
        return full_text, page_count
        
    except PDFValidationError:
        raise
    except Exception as e:
        raise PDFValidationError("Failed to read or parse the PDF document. Please ensure it is a valid PDF.")
