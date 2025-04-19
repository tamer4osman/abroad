import React, { useEffect } from 'react';
import App from '../App';
import { registerExtensionErrorHandler } from '../utils/errorHandling';
import ErrorBoundary from './common/ErrorBoundary';

/**
 * AppWithErrorHandling - Wrapper component for the main App that handles
 * browser extension errors and provides global error boundaries
 */
export const AppWithErrorHandling: React.FC = () => {
  useEffect(() => {
    // Register the global extension error handler when the app mounts
    const unregisterHandler = registerExtensionErrorHandler();
    
    // Clean up when the app unmounts
    return () => {
      unregisterHandler();
    };
  }, []);

  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
};

export default AppWithErrorHandling;