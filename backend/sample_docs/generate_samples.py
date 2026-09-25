import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_all_samples():
    output_dir = Path(__file__).resolve().parent
    output_dir.mkdir(parents=True, exist_ok=True)
    
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#1e293b'),
        spaceAfter=12
    )
    heading_style = ParagraphStyle(
        'DocHeading',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=10,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    # 1. MUTUAL NON-DISCLOSURE AGREEMENT
    nda_file = output_dir / "sample_nda.pdf"
    doc_nda = SimpleDocTemplate(str(nda_file), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story_nda = [
        Paragraph("MUTUAL NON-DISCLOSURE AGREEMENT", title_style),
        Paragraph("This Non-Disclosure Agreement ('Agreement') is entered into as of January 15, 2026, by and between <b>AlphaTech Innovations Inc.</b> ('Disclosing Party') and <b>Johnathan Doe</b> ('Receiving Party').", body_style),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10),
        Paragraph("1. Purpose & Scope", heading_style),
        Paragraph("The parties wish to explore a business relationship concerning software engineering and architectural consulting. In the course of discussions, proprietary data will be disclosed.", body_style),
        Paragraph("2. Confidential Information Defined", heading_style),
        Paragraph("'Confidential Information' includes all non-public technical, financial, commercial, customer, software code, trade secrets, and business information disclosed directly or indirectly in writing or orally.", body_style),
        Paragraph("3. Non-Disclosure Obligations", heading_style),
        Paragraph("The Receiving Party agrees to exercise reasonable care (at least standard of care for own secrets), not disclose Confidential Information to any third party without prior written consent, and restrict access exclusively to employees with a direct need to know.", body_style),
        Paragraph("4. Exclusions from Confidentiality", heading_style),
        Paragraph("Confidential Information does not include information that: (a) is or becomes publicly known through no breach; (b) was already known prior to disclosure; (c) is independently developed without reference to disclosed information; or (d) is required to be disclosed by judicial order.", body_style),
        Paragraph("5. Term & Survival", heading_style),
        Paragraph("This Agreement remains in effect for twelve (12) months from the Effective Date. The non-disclosure obligations shall survive expiration or termination for a period of two (2) years thereafter.", body_style),
        Paragraph("6. Return or Destruction of Materials", heading_style),
        Paragraph("Within fourteen (14) days upon written request or termination of talks, Receiving Party shall return or securely destroy all copies of Confidential Information.", body_style),
        Paragraph("7. Governing Law and Jurisdiction", heading_style),
        Paragraph("This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of laws principles.", body_style)
    ]
    doc_nda.build(story_nda)

    # 2. EMPLOYMENT AGREEMENT
    emp_file = output_dir / "sample_employment_contract.pdf"
    doc_emp = SimpleDocTemplate(str(emp_file), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story_emp = [
        Paragraph("EMPLOYMENT AGREEMENT", title_style),
        Paragraph("This Employment Agreement ('Agreement') is made effective February 1, 2026, between <b>Apex Cloud Systems LLC</b> ('Employer') and <b>Sarah Jenkins</b> ('Employee').", body_style),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10),
        Paragraph("1. Position & Duties", heading_style),
        Paragraph("Employee shall serve in the full-time role of Senior Cloud Solutions Architect. Employee agrees to devote full professional time, skill, and attention exclusively to the business of the Employer.", body_style),
        Paragraph("2. Compensation & Benefits", heading_style),
        Paragraph("Employer shall pay Employee a base annual salary of $135,000 USD, payable semi-monthly in accordance with standard payroll practices. Employee is eligible for standard health, dental, and 401(k) benefits.", body_style),
        Paragraph("3. Term & Termination", heading_style),
        Paragraph("Employment is at-will. Either party may terminate employment at any time with thirty (30) days prior written notice. Employer may terminate immediately without notice for Cause (theft, fraud, insubordination, or material policy violation).", body_style),
        Paragraph("4. Intellectual Property Assignment", heading_style),
        Paragraph("Employee agrees that all inventions, discoveries, software, algorithms, and works of authorship created during employment or utilizing Employer resources constitute 'Works Made for Hire' and belong exclusively to Employer.", body_style),
        Paragraph("5. Non-Competition & Non-Solicitation", heading_style),
        Paragraph("For a period of twelve (12) months following termination of employment for any reason, Employee shall not directly or indirectly engage in, manage, or work for any business entity competing directly in cloud architecture within a 50-mile radius, nor solicit Employer's clients or staff.", body_style),
        Paragraph("6. Notice Period Obligations", heading_style),
        Paragraph("During the 30-day notice period, Employee agrees to assist in training replacement personnel and documenting existing architecture diagrams.", body_style)
    ]
    doc_emp.build(story_emp)

    # 3. CONSULTING SERVICES AGREEMENT (BASELINE - Doc A)
    consult_a_file = output_dir / "sample_consulting_agreement.pdf"
    doc_ca = SimpleDocTemplate(str(consult_a_file), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story_ca = [
        Paragraph("INDEPENDENT CONSULTING SERVICES AGREEMENT (Original Draft)", title_style),
        Paragraph("This Agreement is entered into on March 1, 2026, by and between <b>Global Media Group</b> ('Client') and <b>Pinnacle Engineering Studio</b> ('Consultant').", body_style),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10),
        Paragraph("1. Scope of Services", heading_style),
        Paragraph("Consultant shall provide web application development, deployment optimization, and API integration as described in Statement of Work #1.", body_style),
        Paragraph("2. Payment Terms", heading_style),
        Paragraph("Client shall pay Consultant a fixed fee of $15,000 upon delivery of milestone 1 and $15,000 upon final delivery. Payment terms are Net 30 days from receipt of undisputed invoice.", body_style),
        Paragraph("3. Termination & Notice Period", heading_style),
        Paragraph("Either party may terminate this Agreement for convenience upon fourteen (14) days advance written notice. In the event of termination, Client shall pay for all work completed up to the date of termination.", body_style),
        Paragraph("4. Right to Cure", heading_style),
        Paragraph("In the event of an alleged breach, the non-breaching party must provide written notice detailing the defect and allow thirty (30) days to cure before cancelling.", body_style),
        Paragraph("5. Limitation of Liability", heading_style),
        Paragraph("Neither party shall be liable for indirect, incidental, or consequential damages. Total liability under this agreement is capped at the total amount paid by Client to Consultant in the prior 6 months.", body_style),
        Paragraph("6. Governing Law & Dispute Resolution", heading_style),
        Paragraph("This Agreement shall be governed by California law. Any disputes shall be brought in the state or federal courts located in San Francisco County.", body_style)
    ]
    doc_ca.build(story_ca)

    # 4. CONSULTING SERVICES AGREEMENT (REVISED COUNTEROFFER - Doc B for comparison)
    consult_b_file = output_dir / "sample_consulting_agreement_v2.pdf"
    doc_cb = SimpleDocTemplate(str(consult_b_file), pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story_cb = [
        Paragraph("INDEPENDENT CONSULTING SERVICES AGREEMENT (Client Counteroffer)", title_style),
        Paragraph("This Agreement is entered into on March 5, 2026, by and between <b>Global Media Group</b> ('Client') and <b>Pinnacle Engineering Studio</b> ('Consultant').", body_style),
        Spacer(1, 10),
        HRFlowable(width="100%", thickness=1, color=colors.HexColor("#cbd5e1"), spaceAfter=10),
        Paragraph("1. Scope of Services & SOW", heading_style),
        Paragraph("Consultant shall provide web application development, deployment optimization, and API integration as described in Statement of Work #1, plus ongoing 24/7 emergency bug fixes.", body_style),
        Paragraph("2. Payment Terms & Penalties", heading_style),
        Paragraph("Client shall pay Consultant milestone fees. Payment terms are Net 45 days from receipt of invoice. Late milestone delivery incurs a 2% per week penalty deducted from final invoice.", body_style),
        Paragraph("3. Termination & Notice Period", heading_style),
        Paragraph("Client may terminate immediately at any time. Consultant may terminate only upon forty-five (45) days prior written notice to Client.", body_style),
        Paragraph("4. Immediate Termination for Default", heading_style),
        Paragraph("Client may terminate immediately for breach with zero cure period. All rights to work product transfer immediately to Client without liability.", body_style),
        Paragraph("5. Indemnification & Unlimited Liability", heading_style),
        Paragraph("Consultant agrees to fully defend, indemnify, and hold harmless Client against any and all claims, damages, liabilities, and attorney fees arising from services.", body_style),
        Paragraph("6. Mandatory Binding Arbitration", heading_style),
        Paragraph("All disputes arising under this agreement shall be submitted to confidential, binding single-arbitrator proceedings in New York under AAA rules.", body_style)
    ]
    doc_cb.build(story_cb)

    print("All sample PDF documents generated successfully.")

if __name__ == "__main__":
    generate_all_samples()
