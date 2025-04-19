/**
 * Utility functions for handling browser extension and general errors
 */

/**
 * Register a global error handler that suppresses common browser extension errors
 * that might affect your application
 * @returns A function to unregister the error handlers
 */
export const registerExtensionErrorHandler = (): (() => void) => {
  const handleError = (event: ErrorEvent): boolean => {
    // Check if error is related to browser extensions
    if (
      event.message &&
      (event.message.includes("Could not establish connection") ||
        event.message.includes("Receiving end does not exist") ||
        event.message.includes("Extension context invalidated") ||
        event.message.includes("Host validation failed") ||
        event.message.includes("Host is not supported") ||
        event.message.includes("insights whitelist") ||
        // Chrome extension errors
        event.message.includes("Extension handler") ||
        // Content script errors
        event.message.includes("content script"))
    ) {
      // Prevent default browser error handling
      event.preventDefault();
      console.warn("Browser extension error suppressed:", event.message);
      return true;
    }
    return false;
  };

  // Add error event listener
  window.addEventListener("error", handleError, true);

  // Also catch unhandled promise rejections from extensions
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason &&
      typeof event.reason.message === "string" &&
      (event.reason.message.includes("Could not establish connection") ||
        event.reason.message.includes("Receiving end does not exist") ||
        event.reason.message.includes("Extension context invalidated"))
    ) {
      event.preventDefault();
      console.warn(
        "Browser extension promise rejection suppressed:",
        event.reason.message
      );
    }
  });

  // Store the unhandledrejection handler for removal later
  const handleRejection = (event: PromiseRejectionEvent) => {
    if (
      event.reason &&
      typeof event.reason.message === "string" &&
      (event.reason.message.includes("Could not establish connection") ||
        event.reason.message.includes("Receiving end does not exist") ||
        event.reason.message.includes("Extension context invalidated"))
    ) {
      event.preventDefault();
      console.warn(
        "Browser extension promise rejection suppressed:",
        event.reason.message
      );
    }
  };

  // Add unhandled promise rejection listener
  window.addEventListener("unhandledrejection", handleRejection);

  // Return function to unregister handlers if needed
  return () => {
    window.removeEventListener("error", handleError, true);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
};

/**
 * Check if an error is from a browser extension
 * @param error The error object to check
 * @returns boolean indicating if the error is likely from an extension
 */
export const isExtensionError = (error: unknown): boolean => {
  if (!error) return false;

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "";

  return (
    errorMessage.includes("Could not establish connection") ||
    errorMessage.includes("Receiving end does not exist") ||
    errorMessage.includes("Extension context invalidated") ||
    errorMessage.includes("Host validation failed") ||
    errorMessage.includes("Host is not supported") ||
    errorMessage.includes("insights whitelist") ||
    errorMessage.includes("Extension handler") ||
    errorMessage.includes("content script")
  );
};
