import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Only initializes in production or when explicitly enabled
 */
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  // Only initialize if DSN is configured and we're in production
  if (!dsn) {
    if (import.meta.env.DEV) {
      console.log("Sentry: Skipping initialization (no DSN configured)");
    }
    return;
  }

  Sentry.init({
    dsn,
    
    // Environment configuration
    environment: import.meta.env.MODE,
    
    // Release tracking (uses build hash if available)
    release: import.meta.env.VITE_APP_VERSION || "1.0.0",
    
    // Integrations
    integrations: [
      // Browser tracing for performance monitoring
      Sentry.browserTracingIntegration(),
      // Replay for session recording on errors
      Sentry.replayIntegration({
        // Mask all text for privacy
        maskAllText: true,
        // Block all media for privacy
        blockAllMedia: true,
      }),
    ],

    // Performance Monitoring
    // Capture 10% of transactions for performance monitoring in production
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

    // Session Replay
    // Capture 1% of sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.01,
    replaysOnErrorSampleRate: 1.0,

    // Filter out noisy errors
    beforeSend(event, hint) {
      const error = hint.originalException;
      
      // Ignore network errors that are expected
      if (error instanceof Error) {
        // Ignore cancelled requests
        if (error.message.includes("AbortError")) {
          return null;
        }
        // Ignore auth-related navigation errors (expected during logout)
        if (error.message.includes("Failed to fetch") && 
            event.request?.url?.includes("supabase")) {
          return null;
        }
      }

      // Scrub sensitive data
      if (event.request?.headers) {
        delete event.request.headers["Authorization"];
        delete event.request.headers["Cookie"];
      }

      return event;
    },

    // Don't send PII
    sendDefaultPii: false,

    // Ignore errors from browser extensions
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
      // Firefox extensions
      /^moz-extension:\/\//i,
      // Safari extensions
      /^safari-extension:\/\//i,
    ],
  });

  if (import.meta.env.DEV) {
    console.log("Sentry: Initialized successfully");
  }
}

/**
 * Capture a custom error with additional context
 */
export function captureError(
  error: Error,
  context?: Record<string, unknown>
) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Set user context for error tracking
 * Call this after successful authentication
 */
export function setUserContext(user: { id: string; email?: string }) {
  Sentry.setUser({
    id: user.id,
    // Only include email if you have user consent
    // email: user.email,
  });
}

/**
 * Clear user context on logout
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = "info"
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
  });
}

// Re-export Sentry's ErrorBoundary for use in components
export const ErrorBoundary = Sentry.ErrorBoundary;
export { Sentry };
