# LegalLens AI

**GenAI-Powered Legal Document Assistant for Everyday Understanding & Access**

LegalLens AI is a simple AI-powered legal document assistant built with **Next.js, FastAPI, and Gemini API**. It helps users understand uploaded legal documents in simple language and compare two documents to identify important changes.

> **Disclaimer:** LegalLens AI provides informational assistance only and does not replace professional legal advice.

## ✨ Features

- 📄 Upload and analyze legal PDF documents
- 🧠 GenAI-powered document understanding
- 📝 Simple-language summaries
- 🔍 Extract important clauses, obligations, dates, fees, and terms
- 💬 Ask questions based on the uploaded document
- ⚖️ Compare two legal documents
- 🔄 Identify changed, added, and removed clauses
- ⚠️ Highlight important practical differences
- 🚨 Identify potential **risk factors** and classify them as **Low, Medium, or High**
- 📊 Simple visual comparison / flow representation
- 🔒 Analysis is based only on the documents provided by the user

## 🔄 How It Works

### 📄 Single Document Analysis

```text
┌──────────────────────┐
│     📄 Upload PDF    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  ⚙️ FastAPI Backend  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 📑 Extract PDF Text  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   ✨ Gemini AI       │
│  Document Analysis   │
└──────────┬───────────┘
           │
           ▼
      ┌────┴─────┐
      │           │
      ▼           ▼
┌────────────┐ ┌──────────────┐
│ 📝 Summary │ │ 🔍 Key Terms │
└────────────┘ └──────────────┘
      │           │
      └─────┬─────┘
            ▼
┌────────────────────────┐
│ 🚨 Risk Factors        │
│ Low • Medium • High    │
└────────────┬───────────┘
             │
             ▼
┌────────────────────────┐
│ 💡 Simple AI Results   │
└────────────────────────┘
```

### ⚖️ Document Comparison

```text
┌─────────────────┐       ┌─────────────────┐
│ 📄 Document A   │       │ 📄 Document B   │
│    Original     │       │     Revised     │
└────────┬────────┘       └────────┬────────┘
         │                         │
         └───────────┬─────────────┘
                     ▼
          ┌─────────────────────┐
          │     ✨ Gemini AI    │
          │   Compare Documents │
          └──────────┬──────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ 🔄 Changed Clauses      │
        │ ➕ Added Clauses        │
        │ ➖ Removed Clauses      │
        │ 💰 Amounts & Dates      │
        │ 📋 Obligation Changes   │
        │ 🚨 Risk & Impact        │
        └─────────────────────────┘
```

## 🛠️ Tech Stack

- **Frontend:** Next.js + React + TypeScript
- **Backend:** FastAPI + Python
- **GenAI:** Google Gemini API — **Gemini 3.5 Flash Lite**
- **PDF Processing:** Python PDF processing
- **Styling:** Tailwind CSS

## 🚀 Getting Started

### 1. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
pip install -r requirements.txt
```

### 2. Configure Gemini API

Create a `.env` file for the backend:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

**Never commit your real API key to GitHub.**

### 3. Start the Backend

From the project root:

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Start the Frontend

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

If your frontend uses another port, open that configured localhost URL instead.

## 📌 Important

LegalLens AI analyzes the documents provided by the user. If required information is not present in the uploaded document, the application should indicate that the information was **not found** instead of inventing an answer.

If the Gemini API is unavailable, the API key is invalid, the quota is exhausted, or the request fails, the application may display an appropriate **Not Found / API Error** message. Check the backend `.env` file and Gemini API configuration in that case.

## 💡 Purpose & Use Cases

LegalLens AI is designed to make legal documents easier to understand for everyday users by converting complex legal language into clear, structured information and making document-to-document differences easier to identify.

The project is developed for the **Prompt Wars Virtual Exclusive Edition!**. Fictional legal documents may be used for demonstration and testing, while the underlying concept is intended for real-world document-understanding and comparison use cases.

### Real-World Use Cases

- Employment contracts
- Rental and lease agreements
- NDAs
- Service agreements
- Terms & Conditions
- Business contracts
- Document revision and negotiation review

---

**Built with ❤️ by Abhishek for Prompt Wars Virtual Exclusive Edition!**
