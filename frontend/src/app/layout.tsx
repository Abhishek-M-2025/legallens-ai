import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LegalLens AI — GenAI Legal Document Assistant",
  description: "AI-powered legal document assistant for plain-English summaries, clause extraction, risk detection, grounded Q&A, and redline comparison.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
