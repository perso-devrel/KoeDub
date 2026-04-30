import type { Analytics } from 'firebase/analytics';

const ENABLED =
  !!import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your_firebase_key' &&
  !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

let analyticsPromise: Promise<Analytics | null> | null = null;

async function getAnalytics(): Promise<Analytics | null> {
  if (!ENABLED) return null;
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    try {
      const firebaseApp = await import('firebase/app');
      const analyticsMod = await import('firebase/analytics');
      const supported = await analyticsMod.isSupported();
      if (!supported) return null;
      const app = firebaseApp.getApps()[0] ?? firebaseApp.initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      });
      return analyticsMod.getAnalytics(app);
    } catch {
      return null;
    }
  })();

  return analyticsPromise;
}

export async function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    const a = await getAnalytics();
    if (!a) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(a, name as string, params as Record<string, unknown> | undefined);
  } catch {
    // Swallow analytics errors — never block UX.
  }
}

export async function trackPageView(path: string, title?: string) {
  try {
    const a = await getAnalytics();
    if (!a) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(a, 'page_view', {
      page_path: path,
      page_location: typeof window !== 'undefined' ? window.location.href : path,
      page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
    });
  } catch {
    // Ignore.
  }
}

export async function setAnalyticsUserId(userId: string | null) {
  try {
    const a = await getAnalytics();
    if (!a) return;
    const { setUserId } = await import('firebase/analytics');
    setUserId(a, userId);
  } catch {
    // Ignore.
  }
}
