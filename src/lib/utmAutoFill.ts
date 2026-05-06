// Auto-fill UTM parameters in the URL when the user lands without them.
// Mirrors the legacy GTM behavior: detect source (paid Meta / referral / direct),
// rewrite the URL via history.replaceState and persist UTMs to cookies so the
// checkout link builder (useCheckoutUrl) can forward them to CaktoPay/Efí.
import { getSessionId } from "@/hooks/useTracking";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const COOKIE_MAP: Record<string, string> = {
  utm_source: "cookieUtmSource",
  utm_medium: "cookieUtmMedium",
  utm_campaign: "cookieUtmCampaign",
  utm_content: "cookieUtmContent",
  utm_term: "cookieUtmTerm",
};

function setCookie(name: string, value: string, days = 30) {
  try {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch {
    /* noop */
  }
}

function classifyReferrer(): { source: string; medium: string; campaign: string } {
  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get("fbclid");
    if (fbclid) return { source: "facebook", medium: "paid", campaign: "meta" };

    const ref = document.referrer;
    if (!ref) return { source: "direct", medium: "direct", campaign: "direct" };
    const refUrl = new URL(ref);
    if (refUrl.hostname === window.location.hostname) {
      return { source: "direct", medium: "direct", campaign: "direct" };
    }
    const host = refUrl.hostname.replace(/^www\./, "");
    const source = host.split(".")[0] || "referral";
    return { source, medium: "referral", campaign: "referral" };
  } catch {
    return { source: "direct", medium: "direct", campaign: "direct" };
  }
}

let ran = false;

export function ensureUtms(): void {
  if (typeof window === "undefined" || ran) return;
  ran = true;

  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let changed = false;

    if (!params.get("utm_source")) {
      const { source, medium, campaign } = classifyReferrer();
      params.set("utm_source", source);
      if (!params.get("utm_medium")) params.set("utm_medium", medium);
      if (!params.get("utm_campaign")) params.set("utm_campaign", campaign);
      changed = true;
    }

    // Always ensure sck is present in URL for traceability.
    const sck = getSessionId();
    if (params.get("sck") !== sck) {
      params.set("sck", sck);
      changed = true;
    }

    // Persist UTMs to cookies for downstream consumers (useCheckoutUrl).
    UTM_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) setCookie(COOKIE_MAP[k], v);
    });

    if (changed) {
      window.history.replaceState({}, "", url.toString());
    }
  } catch (e) {
    console.warn("[utm] ensureUtms failed", e);
  }
}
