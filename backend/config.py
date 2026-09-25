import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend directory or root directory
env_path = Path(__file__).resolve().parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# Prefer gemini-3.5-flash or gemini-3.5-flash-lite or gemini-flash-latest
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
ALLOWED_MIME_TYPES = {"application/pdf"}
ALLOWED_EXTENSIONS = {".pdf"}

LEGAL_DISCLAIMER = (
    "LegalLens AI provides automated document analysis and general legal information. "
    "It is not a law firm, does not provide legal advice, and does not create an attorney-client relationship. "
    "Always consult a qualified legal professional for specific legal guidance."
)
