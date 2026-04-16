import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type NullableString = string | null;

interface FeedbackContextPayload {
  pageUrl?: unknown;
  pagePath?: unknown;
  actionPath?: unknown;
  referrer?: unknown;
  timezone?: unknown;
  browserLang?: unknown;
  deviceType?: unknown;
  platform?: unknown;
  userAgent?: unknown;
  viewport?: {
    width?: unknown;
    height?: unknown;
  };
  screen?: {
    width?: unknown;
    height?: unknown;
  };
  screenshot?: unknown;
}

interface FeedbackPayload {
  message?: unknown;
  contact?: unknown;
  quickType?: unknown;
  helpfulVote?: unknown;
  triggerSource?: unknown;
  context?: FeedbackContextPayload;
}

const MAX_MESSAGE_LENGTH = 5000;
const MAX_CONTACT_LENGTH = 320;
const MAX_TEXT_FIELD_LENGTH = 2000;
const MAX_SCREENSHOT_LENGTH = 2_500_000;
const MAX_ACTION_PATH_ITEMS = 12;
const QUICK_TYPES = new Set(["bug", "feature", "content", "other"]);

function asTrimmedString(value: unknown, maxLength: number): NullableString {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

function asBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  return null;
}

function asSizeNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const rounded = Math.round(value);
  if (rounded < 0 || rounded > 20000) return null;
  return rounded;
}

function toActionPath(value: unknown): NullableString {
  if (!Array.isArray(value)) {
    return asTrimmedString(value, MAX_TEXT_FIELD_LENGTH);
  }

  const cleaned = value
    .map((item) => asTrimmedString(item, 300))
    .filter((item): item is string => Boolean(item))
    .slice(-MAX_ACTION_PATH_ITEMS);

  if (cleaned.length === 0) return null;
  return cleaned.join(" -> ");
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || "0.0.0.0";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackPayload;
    const context = body.context ?? {};

    const rawMessage = asTrimmedString(body.message, MAX_MESSAGE_LENGTH);
    const contact = asTrimmedString(body.contact, MAX_CONTACT_LENGTH);
    const quickTypeRaw = asTrimmedString(body.quickType, 50);
    const quickType =
      quickTypeRaw && QUICK_TYPES.has(quickTypeRaw) ? quickTypeRaw : null;
    const helpfulVote = asBoolean(body.helpfulVote);
    const triggerSource = asTrimmedString(body.triggerSource, 80);

    if (!rawMessage && !quickType && helpfulVote === null) {
      return NextResponse.json(
        { error: "Provide message or quick feedback selection" },
        { status: 400 },
      );
    }

    const autoMessage = [
      quickType ? `Type: ${quickType}` : null,
      helpfulVote === null
        ? null
        : `Helpful vote: ${helpfulVote ? "yes" : "no"}`,
    ]
      .filter(Boolean)
      .join(" | ");
    const message = rawMessage || autoMessage || "Quick feedback";

    const pageUrl = asTrimmedString(context.pageUrl, MAX_TEXT_FIELD_LENGTH);
    const pagePath = asTrimmedString(context.pagePath, 500);
    const actionPath = toActionPath(context.actionPath);
    const referrer =
      asTrimmedString(context.referrer, MAX_TEXT_FIELD_LENGTH) ||
      asTrimmedString(request.headers.get("referer"), MAX_TEXT_FIELD_LENGTH);
    const timezone = asTrimmedString(context.timezone, 100);
    const browserLang = asTrimmedString(context.browserLang, 50);
    const deviceType = asTrimmedString(context.deviceType, 50);
    const platform = asTrimmedString(context.platform, 100);
    const userAgent =
      asTrimmedString(context.userAgent, MAX_TEXT_FIELD_LENGTH) ||
      asTrimmedString(request.headers.get("user-agent"), MAX_TEXT_FIELD_LENGTH);
    const screenshot = asTrimmedString(
      context.screenshot,
      MAX_SCREENSHOT_LENGTH,
    );
    const viewportWidth = asSizeNumber(context.viewport?.width);
    const viewportHeight = asSizeNumber(context.viewport?.height);
    const screenWidth = asSizeNumber(context.screen?.width);
    const screenHeight = asSizeNumber(context.screen?.height);

    const feedback = await prisma.feedback.create({
      data: {
        message,
        contact,
        quickType,
        helpfulVote,
        triggerSource,
        pageUrl,
        pagePath,
        actionPath,
        referrer,
        timezone,
        browserLang,
        deviceType,
        platform,
        userAgent,
        viewportWidth,
        viewportHeight,
        screenWidth,
        screenHeight,
        ip: getClientIp(request),
        screenshot,
      },
      select: { id: true, createTime: true },
    });

    return NextResponse.json({ success: true, data: feedback });
  } catch (error) {
    console.error("Feedback Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 },
    );
  }
}
