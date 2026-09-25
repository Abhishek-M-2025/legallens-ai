"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Copy, Check, MessageSquare } from "lucide-react";
import { ChatMessage } from "../types";
import { askDocumentQuestion } from "../services/api";

interface DocumentChatProps {
  documentId: string;
  documentTitle: string;
}

const SUGGESTED_PROMPTS = [
  "What is the notice period?",
  "What happens if I terminate this agreement early?",
  "What are my payment obligations?",
  "Are there non-compete or non-solicitation restrictions?",
  "What is the governing law and jurisdiction?"
];

export const DocumentChat: React.FC<DocumentChatProps> = ({
  documentId,
  documentTitle
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I have reviewed **${documentTitle}**. Ask me any specific question about notice periods, payments, termination rules, obligations, or liabilities in this document.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isSending) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      // Build history for context
      const historyPayload = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await askDocumentQuestion(documentId, query, historyPayload);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.answer,
        referenced_clauses: res.referenced_clauses,
        confidence: res.confidence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: `Error: ${err.message || "Failed to get an answer from the document assistant."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Ask Your Document</span>
              <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-indigo-100 text-indigo-700">
                Document-Focused
              </span>
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-[280px]">
              Grounded exclusively in {documentTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          Active Session
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Quick questions:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            disabled={isSending}
            className="text-xs shrink-0 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-slate-800 text-white"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[82%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 border border-slate-200/80 text-slate-800"
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

              {/* Referenced Clauses / Citations */}
              {msg.referenced_clauses && msg.referenced_clauses.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Citations / Referenced Clauses:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.referenced_clauses.map((clause, cIdx) => (
                      <span
                        key={cIdx}
                        className="inline-block px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[11px] text-slate-800"
                      >
                        {clause}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom metadata & copy */}
              <div
                className={`mt-1.5 flex items-center justify-between text-[11px] ${
                  msg.role === "user" ? "text-indigo-200" : "text-slate-400"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="hover:text-slate-700 flex items-center gap-1 cursor-pointer ml-2"
                    title="Copy answer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Analyzing document context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Ask anything about ${documentTitle}...`}
          disabled={isSending}
          className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isSending}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm flex items-center gap-1.5 hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
