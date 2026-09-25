from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class KeyTerms(BaseModel):
    parties_involved: List[str] = Field(
        default_factory=list,
        description="Names and roles of the parties entering the agreement"
    )
    effective_date: Optional[str] = Field(
        None,
        description="Start date or signing date of the document"
    )
    duration_or_term: Optional[str] = Field(
        None,
        description="Duration or validity period of the contract"
    )
    payment_terms: Optional[str] = Field(
        None,
        description="Financial commitments, rates, deadlines, penalties"
    )
    termination_terms: Optional[str] = Field(
        None,
        description="How either party can end or exit the agreement"
    )
    notice_period: Optional[str] = Field(
        None,
        description="Required advance notice period for termination or renewal"
    )
    governing_law_jurisdiction: Optional[str] = Field(
        None,
        description="Governing law, jurisdiction, and dispute forum"
    )
    confidentiality_duration: Optional[str] = Field(
        None,
        description="How long confidentiality or non-disclosure obligations last"
    )


class ImportantClause(BaseModel):
    clause_title: str = Field(
        ...,
        description="Short name or heading of the clause"
    )
    category: str = Field(
        ...,
        description="Category, e.g. Termination, Liability, IP, Payment, Confidentiality"
    )
    plain_english_summary: str = Field(
        ...,
        description="Simple, jargon-free explanation of what this clause means"
    )
    practical_implication: str = Field(
        default="",
        description="What this means for the user in real life"
    )
    original_reference: Optional[str] = Field(
        None,
        description="Section number or excerpt from document"
    )


class Obligation(BaseModel):
    party: str = Field(
        ...,
        description="The party that holds the obligation (e.g. You / Contractor / Client)"
    )
    obligation_summary: str = Field(
        ...,
        description="Plain-English explanation of what must be done or avoided"
    )
    deadline_or_frequency: Optional[str] = Field(
        None,
        description="When this must be completed (e.g. within 30 days, monthly)"
    )
    consequence_of_breach: Optional[str] = Field(
        None,
        description="What happens if this obligation is failed"
    )


class PotentialConcern(BaseModel):
    issue_title: str = Field(
        ...,
        description="Concise title of the risk or red flag"
    )
    severity: str = Field(
        ...,
        description="'High', 'Medium', or 'Low'"
    )
    risk_description: str = Field(
        ...,
        description="Clear explanation of why this term is risky or one-sided"
    )
    clause_reference: Optional[str] = Field(
        None,
        description="Relevant clause or section reference"
    )
    recommended_action: str = Field(
        ...,
        description="Practical recommendation or question to raise"
    )


class LawyerPrep(BaseModel):
    urgency_rating: str = Field(
        default="Standard Review",
        description="'Immediate Review Recommended', 'Standard Review', or 'Low Complexity'"
    )
    key_discussion_points: List[str] = Field(
        default_factory=list,
        description="Top strategic points to review with legal counsel"
    )
    questions_to_ask_lawyer: List[str] = Field(
        default_factory=list,
        description="Specific questions the user should ask their attorney"
    )
    documents_and_evidence_to_collect: List[str] = Field(
        default_factory=list,
        description="Records, receipts, or drafts to bring to consultation"
    )


class DocumentAnalysisResponse(BaseModel):
    document_id: str
    filename: str
    page_count: int
    document_type: str
    simple_summary: str
    key_terms: KeyTerms
    important_clauses: List[ImportantClause]
    obligations: List[Obligation]
    potential_concerns: List[PotentialConcern]
    lawyer_prep: LawyerPrep
    disclaimer: str


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    document_id: str
    question: str
    history: List[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    answer: str
    referenced_clauses: List[str] = Field(default_factory=list)
    confidence: str = "High"


class ClauseDiff(BaseModel):
    clause_title: str
    status: str  # "Added", "Removed", "Modified"
    doc_a_excerpt: Optional[str] = None
    doc_b_excerpt: Optional[str] = None
    plain_english_explanation: str
    risk_impact: str  # "Favorable", "Unfavorable", "Neutral"


class ComparisonResponse(BaseModel):
    comparison_summary: str
    doc_a_name: str
    doc_b_name: str
    doc_a_type: str
    doc_b_type: str
    added_clauses: List[ClauseDiff] = Field(default_factory=list)
    removed_clauses: List[ClauseDiff] = Field(default_factory=list)
    modified_clauses: List[ClauseDiff] = Field(default_factory=list)
    changed_obligations: List[str] = Field(default_factory=list)
    changed_key_terms: Dict[str, str] = Field(default_factory=dict)
    overall_risk_shift: str
    recommendations: List[str] = Field(default_factory=list)
    disclaimer: str