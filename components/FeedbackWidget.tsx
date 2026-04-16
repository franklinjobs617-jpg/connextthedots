"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MessageSquarePlus,
  X,
  Send,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Bug,
  Lightbulb,
  MessageCircle,
  Ellipsis,
} from "lucide-react";
import { usePathname } from "next/navigation";

const PATH_HISTORY_KEY = "ctd_feedback_path_history";
const LAST_SUBMIT_AT_KEY = "ctd_feedback_last_submit_at";
const MAX_PATH_HISTORY = 12;
const NUDGE_DELAY_MS = 2_000;
const NUDGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const MAX_SCREENSHOT_FILE_SIZE = 2 * 1024 * 1024;

type QuickType = "bug" | "feature" | "content" | "other";
type TriggerSource = "manual_button" | "timed_nudge" | "error_nudge";

interface FeedbackContextPayload {
  pageUrl: string;
  pagePath: string;
  actionPath: string[];
  referrer: string | null;
  timezone: string | null;
  browserLang: string | null;
  deviceType: string;
  platform: string | null;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  screen: {
    width: number;
    height: number;
  };
  screenshot: string | null;
}

const quickTypeOptions: Array<{
  value: QuickType;
  label: string;
  icon: typeof Bug;
}> = [
  { value: "bug", label: "Report bug", icon: Bug },
  { value: "feature", label: "Suggest feature", icon: Lightbulb },
  { value: "content", label: "Content issue", icon: MessageCircle },
  { value: "other", label: "Other", icon: Ellipsis },
];

function getDeviceType(userAgent: string): string {
  const normalized = userAgent.toLowerCase();
  if (/ipad|tablet/.test(normalized)) return "tablet";
  if (/mobi|android|iphone/.test(normalized)) return "mobile";
  return "desktop";
}

function getStoredTimestamp(key: string): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(key);
  if (!raw) return 0;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function setStoredTimestamp(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, Date.now().toString());
}

function shouldShowNudge(): boolean {
  if (typeof window === "undefined") return false;
  const now = Date.now();
  const lastSubmitAt = getStoredTimestamp(LAST_SUBMIT_AT_KEY);
  if (lastSubmitAt && now - lastSubmitAt < NUDGE_COOLDOWN_MS) return false;
  return true;
}

function readPathHistoryFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(PATH_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is string => typeof item === "string" && Boolean(item))
      .slice(-MAX_PATH_HISTORY);
  } catch {
    return [];
  }
}

function savePathHistory(pathHistory: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(PATH_HISTORY_KEY, JSON.stringify(pathHistory));
  } catch {
    // ignore storage errors
  }
}

async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Screenshot parsing failed"));
    };
    reader.onerror = () => reject(new Error("Screenshot parsing failed"));
    reader.readAsDataURL(file);
  });
}

export default function FeedbackWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [quickType, setQuickType] = useState<QuickType | null>(null);
  const [helpfulVote, setHelpfulVote] = useState<boolean | null>(null);
  const [triggerSource, setTriggerSource] =
    useState<TriggerSource>("manual_button");
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(
    null,
  );
  const [screenshotName, setScreenshotName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const isFeedbackPage = useMemo(
    () => Boolean(pathname && /\/feedback\/?$/.test(pathname)),
    [pathname],
  );

  const canSubmit = useMemo(
    () => Boolean(message.trim() || quickType || helpfulVote !== null),
    [message, quickType, helpfulVote],
  );

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    const pagePath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const history = readPathHistoryFromStorage();
    const merged = [...history.filter((item) => item !== pagePath), pagePath].slice(
      -MAX_PATH_HISTORY,
    );
    savePathHistory(merged);
    setPathHistory(merged);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFeedbackPage) return;
    if (!shouldShowNudge()) return;

    const timer = window.setTimeout(() => {
      setShowNudge(true);
      setTriggerSource("timed_nudge");
    }, NUDGE_DELAY_MS);

    const onError = () => {
      if (!shouldShowNudge()) return;
      setShowNudge(true);
      setTriggerSource("error_nudge");
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  }, [isFeedbackPage]);

  const buildContext = (): FeedbackContextPayload => {
    const pagePath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const userAgent = navigator.userAgent || "";
    const actionPath =
      pathHistory.length > 0
        ? pathHistory
        : [...readPathHistoryFromStorage(), pagePath].slice(-MAX_PATH_HISTORY);

    return {
      pageUrl: window.location.href,
      pagePath,
      actionPath,
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      browserLang: navigator.language || null,
      deviceType: getDeviceType(userAgent),
      platform: navigator.platform || null,
      userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
      screenshot: screenshotDataUrl,
    };
  };

  const resetForm = () => {
    setMessage("");
    setContact("");
    setQuickType(null);
    setHelpfulVote(null);
    setScreenshotDataUrl(null);
    setScreenshotName("");
  };

  const openByManualClick = () => {
    setIsOpen(true);
    setShowNudge(false);
    setTriggerSource("manual_button");
    setStatusMessage("");
  };

  const openFromNudgeVote = (vote: boolean) => {
    setHelpfulVote(vote);
    setIsOpen(true);
    setShowNudge(false);
    setStatusMessage("");
  };

  const dismissNudge = () => {
    setShowNudge(false);
  };

  const handleScreenshotChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SCREENSHOT_FILE_SIZE) {
      setStatusMessage("Screenshot must be smaller than 2MB.");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setScreenshotDataUrl(dataUrl);
      setScreenshotName(file.name);
      setStatusMessage("");
    } catch {
      setStatusMessage("Failed to read screenshot file.");
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setStatusMessage("Please add details or choose quick options.");
      return;
    }

    setLoading(true);
    setStatusMessage("");

    try {
      const context = buildContext();
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          contact,
          quickType,
          helpfulVote,
          triggerSource,
          context,
        }),
      });

      if (!res.ok) {
        setStatusMessage("Failed to submit feedback. Please try again.");
        return;
      }

      setStoredTimestamp(LAST_SUBMIT_AT_KEY);
      resetForm();
      setIsOpen(false);
      setShowNudge(false);
      setStatusMessage("");
    } catch {
      setStatusMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isFeedbackPage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      {showNudge && !isOpen && (
        <div className="w-72 rounded-xl border border-slate-200 bg-white shadow-xl p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-slate-600">
              Was this page helpful? One tap is enough.
            </p>
            <button
              onClick={dismissNudge}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Dismiss feedback nudge"
            >
              <X size={14} />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => openFromNudgeVote(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <ThumbsUp size={14} />
              Helpful
            </button>
            <button
              type="button"
              onClick={() => openFromNudgeVote(false)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
            >
              <ThumbsDown size={14} />
              Not helpful
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="w-88 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-5 fade-in zoom-in-95 origin-bottom-right">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">Send Feedback</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md p-1 transition-colors"
              aria-label="Close feedback"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-600">
                Quick category (optional)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickTypeOptions.map((option) => {
                  const Icon = option.icon;
                  const active = quickType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setQuickType((prev) =>
                          prev === option.value ? null : option.value,
                        )
                      }
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs transition-colors ${
                        active
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={14} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-600">
                Was this page helpful? (optional)
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setHelpfulVote((prev) => (prev === true ? null : true))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                    helpfulVote === true
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ThumbsUp size={14} />
                  Helpful
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setHelpfulVote((prev) => (prev === false ? null : false))
                  }
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs transition-colors ${
                    helpfulVote === false
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <ThumbsDown size={14} />
                  Not helpful
                </button>
              </div>
            </div>

            <textarea
              className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none resize-none h-24 transition-all"
              placeholder="Add details (optional). For example: what you expected and what happened."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
            />

            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
              placeholder="Email (optional, for reply)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />

            <p className="text-xs text-slate-500">
              {screenshotName || "Attach screenshot (optional, max 2MB)"}
            </p>
            <label className="block">
              <span className="sr-only">Attach screenshot</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-md file:border file:border-slate-200 file:bg-white file:px-2.5 file:py-1.5 file:text-xs file:text-slate-700 hover:file:bg-slate-50"
              />
            </label>

            {statusMessage ? (
              <p className="text-xs text-amber-600">{statusMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="mt-1 w-full bg-slate-900 text-white text-sm font-bold py-2.5 rounded-lg hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-slate-200"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Send <Send size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      )}

      <button
        onClick={openByManualClick}
        className="group inline-flex items-center gap-2 h-12 rounded-full bg-slate-900 px-4 text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-blue-200/50"
      >
        <MessageSquarePlus size={20} />
        <span className="text-sm font-medium">Feedback</span>
      </button>
    </div>
  );
}
