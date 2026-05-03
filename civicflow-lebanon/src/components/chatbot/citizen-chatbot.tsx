"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getNewsItems } from "@/lib/news-store";
import { getAllRequests, getRequestsUpdatedEventName } from "@/lib/request-api";
import { services } from "@/lib/mock-data";
import type { NewsItem, Service, ServiceRequest } from "@/types";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function formatList(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

function findService(question: string): Service | null {
  const normalizedQuestion = normalize(question);

  return (
    services.find((service) =>
      normalizedQuestion.includes(normalize(service.title)),
    ) ||
    services.find((service) =>
      service.title
        .split(" ")
        .some((word) => word.length > 4 && normalizedQuestion.includes(normalize(word))),
    ) ||
    null
  );
}

function findRequest(question: string, requests: ServiceRequest[]) {
  const normalizedQuestion = normalize(question);

  return requests.find((request) => {
    return (
      normalizedQuestion.includes(normalize(request.reference)) ||
      normalizedQuestion.includes(normalize(request.title)) ||
      (request.serviceId && normalizedQuestion.includes(normalize(request.serviceId)))
    );
  });
}

function answerNewsQuestion(newsItems: NewsItem[]) {
  if (newsItems.length === 0) {
    return "There are no municipal news items published yet.";
  }

  return `Here are the latest municipal news items:\n${formatList(
    newsItems.slice(0, 4).map((item) => `${item.title} (${item.date})`),
  )}`;
}

function answerServiceQuestion(service: Service) {
  return `${service.title} usually takes ${service.estimatedDays} days. Required documents:\n${formatList(
    service.requiredDocuments,
  )}`;
}

function answerAllServicesQuestion() {
  return `Citizens can apply for these municipal services:\n${formatList(
    services.map(
      (service) =>
        `${service.title} (${service.category}, about ${service.estimatedDays} days)`,
    ),
  )}`;
}

function answerRequestDocuments(request: ServiceRequest) {
  const service = services.find((item) => item.id === request.serviceId);

  if (!service) {
    return `${request.reference} is a ${request.title}. I could not match it to a service document checklist.`;
  }

  return `${request.reference} is for ${service.title}. Required documents:\n${formatList(
    service.requiredDocuments,
  )}`;
}

function isNotApprovedRequest(request: ServiceRequest) {
  return [
    "Submitted",
    "Under Review",
    "Pending Documents",
    "Escalated",
  ].includes(request.status);
}

function answerNotApprovedRequests(
  requests: ServiceRequest[],
  canViewAllRequests: boolean,
) {
  const pendingRequests = requests.filter(isNotApprovedRequest);

  if (pendingRequests.length === 0) {
    return canViewAllRequests
      ? "There are no visible requests waiting for approval right now."
      : "You do not have any requests waiting for approval right now.";
  }

  return `${
    canViewAllRequests
      ? "These requests have not been approved yet"
      : "Your requests that have not been approved yet"
  }:\n${formatList(
    pendingRequests.map(
      (request) =>
        `${request.reference}: ${request.title} is ${request.status} in ${request.department}`,
    ),
  )}`;
}

function buildAnswer(
  question: string,
  requests: ServiceRequest[],
  newsItems: NewsItem[],
  canViewAllRequests: boolean,
) {
  const normalizedQuestion = normalize(question);
  const asksNews = /\b(news|announcement|announcements|latest)\b/.test(
    normalizedQuestion,
  );
  const asksStatus = /\b(status|request|reference|progress|submitted)\b/.test(
    normalizedQuestion,
  );
  const asksDocuments =
    /\b(document|documents|required|paperwork|papers|need)\b/.test(
      normalizedQuestion,
    );
  const asksServices = /\b(service|services|apply|permit|certificate|report|complaint)\b/.test(
    normalizedQuestion,
  );
  const asksAll =
    /\b(all|list|available|catalog|types|what can)\b/.test(normalizedQuestion);
  const asksNotApproved =
    /\b(not approved|unapproved|not accepted|not completed|pending approval|waiting for approval|haven't been approved|have not been approved)\b/.test(
      normalizedQuestion,
    ) ||
    (/\b(request|requests)\b/.test(normalizedQuestion) &&
      /\b(pending|waiting|open|unfinished)\b/.test(normalizedQuestion));

  if (asksNews) {
    return answerNewsQuestion(newsItems);
  }

  if (asksNotApproved) {
    return answerNotApprovedRequests(requests, canViewAllRequests);
  }

  if (asksServices && asksAll && !findService(question)) {
    return answerAllServicesQuestion();
  }

  const matchedService = findService(question);

  if ((asksDocuments || asksServices) && matchedService) {
    return answerServiceQuestion(matchedService);
  }

  if (asksStatus) {
    const matchedRequest = findRequest(question, requests);

    if (matchedRequest && asksDocuments) {
      return answerRequestDocuments(matchedRequest);
    }

    if (matchedRequest) {
      return `${matchedRequest.reference} is currently ${matchedRequest.status}. It was last updated on ${matchedRequest.updatedAt}. Summary: ${matchedRequest.summary}`;
    }

    if (requests.length > 0) {
      return `${
        canViewAllRequests
          ? "Here are the latest request records I can see"
          : "I can only discuss requests attached to your account. Your latest requests are"
      }:\n${formatList(
        requests
          .slice(0, canViewAllRequests ? 10 : 5)
          .map(
            (request) =>
              `${request.reference}: ${request.title} is ${request.status}`,
          ),
      )}`;
    }

    return "I cannot find any requests attached to your account yet.";
  }

  if (asksDocuments || asksServices) {
    return `Tell me the service name and I can list the required documents. Available services include:\n${formatList(
      services.slice(0, 8).map((service) => service.title),
    )}`;
  }

  return `I can help with ${
    canViewAllRequests ? "request statuses" : "your own request status"
  }, latest municipal news, available services, and required documents. Try asking: “List all services” or “What documents do I need for a business permit?”`;
}

export function CitizenChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi, I can help with request status, municipal news, services, and required documents.",
    },
  ]);

  const canViewAllRequests =
    user?.role === "employee" ||
    user?.role === "municipality_admin" ||
    user?.role === "super_admin";

  const refreshRequests = useCallback(async () => {
    try {
      const latestRequests = await getAllRequests();
      setRequests(latestRequests);
      return latestRequests;
    } catch {
      setRequests([]);
      return [];
    }
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setNewsItems(getNewsItems());
      refreshRequests();
    });

    function handleNewsUpdated() {
      setNewsItems(getNewsItems());
    }

    function handleRequestsUpdated() {
      refreshRequests();
    }

    window.addEventListener("civicflow-news-updated", handleNewsUpdated);
    window.addEventListener(getRequestsUpdatedEventName(), handleRequestsUpdated);
    window.addEventListener("storage", handleNewsUpdated);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("civicflow-news-updated", handleNewsUpdated);
      window.removeEventListener(
        getRequestsUpdatedEventName(),
        handleRequestsUpdated,
      );
      window.removeEventListener("storage", handleNewsUpdated);
    };
  }, [refreshRequests]);

  const unreadLabel = useMemo(
    () => (requests.length ? `${requests.length} request records loaded` : "Ask me anything"),
    [requests.length],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = input.trim();
    if (!question) return;
    const latestRequests = await refreshRequests();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: question,
    };
    const assistantMessage: ChatMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: buildAnswer(
        question,
        latestRequests,
        newsItems,
        canViewAllRequests,
      ),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);
    setInput("");
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5">
      {isOpen ? (
        <div className="flex h-[min(560px,calc(100vh-32px))] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[min(380px,calc(100vw-40px))]">
          <div className="flex items-center justify-between bg-[#174767] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <div className="text-sm font-semibold">CivicFlow Assistant</div>
                <div className="text-xs text-blue-100">{unreadLabel}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-2 transition hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "ml-4 bg-[#1f5f8b] text-white sm:ml-8"
                    : "mr-4 border border-slate-200 bg-white text-slate-700 sm:mr-8"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-950 outline-none focus:border-[#1f5f8b]"
              placeholder="Ask about status, news, services..."
            />
            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-[#1f5f8b] text-white transition hover:bg-[#174767]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="ml-auto flex w-fit items-center gap-2 rounded-full bg-[#1f5f8b] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#174767]"
        >
          <MessageCircle className="h-5 w-5" />
          Ask CivicFlow
        </button>
      )}
    </div>
  );
}
