import time
import uuid
from typing import Dict, Any, Optional

class SessionStore:
    """
    Ephemeral in-memory store for active legal documents and their extracted context.
    No permanent storage; automatic cleanup of entries older than 2 hours.
    """
    def __init__(self, ttl_seconds: int = 7200):
        self._store: Dict[str, Dict[str, Any]] = {}
        self._ttl_seconds = ttl_seconds

    def _cleanup_expired(self):
        current_time = time.time()
        expired_ids = [
            doc_id for doc_id, data in self._store.items()
            if current_time - data.get("timestamp", 0) > self._ttl_seconds
        ]
        for doc_id in expired_ids:
            self._store.pop(doc_id, None)

    def save_document(
        self,
        filename: str,
        text: str,
        page_count: int,
        analysis: Optional[Dict[str, Any]] = None,
        raw_bytes: Optional[bytes] = None
    ) -> str:
        # Each new upload replaces the previous active document.
        # Clear previous documents so old extracted text or analysis is never reused or mixed.
        self._store.clear()
        document_id = str(uuid.uuid4())
        self._store[document_id] = {
            "document_id": document_id,
            "filename": filename,
            "text": text,
            "page_count": page_count,
            "analysis": analysis,
            "raw_bytes": raw_bytes,
            "timestamp": time.time()
        }
        return document_id

    def get_document(self, document_id: str) -> Optional[Dict[str, Any]]:
        self._cleanup_expired()
        return self._store.get(document_id)

    def clear(self):
        self._store.clear()

    def update_analysis(self, document_id: str, analysis: Dict[str, Any]) -> bool:
        if document_id in self._store:
            self._store[document_id]["analysis"] = analysis
            self._store[document_id]["timestamp"] = time.time()
            return True
        return False

# Global singleton instance
session_store = SessionStore()
