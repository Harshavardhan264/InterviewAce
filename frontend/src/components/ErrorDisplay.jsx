import React, { useContext, useState } from 'react';
import { ErrorContext } from '../context/ErrorContext';
import { 
  WifiOff, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  X, 
  RefreshCw, 
  Bug 
} from 'lucide-react';

const ErrorDisplay = () => {
  const { apiError, clearApiError } = useContext(ErrorContext);
  const [showDebug, setShowDebug] = useState(false);

  if (!apiError) return null;

  const isOffline = apiError.status === 'OFFLINE';

  const handleRetry = () => {
    clearApiError();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md transition-opacity duration-300">
      {/* Background decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full glow-accent-cyan opacity-25 blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-red-500/20 shadow-2xl space-y-5 relative">
        {/* Close Button */}
        {!isOffline && (
          <button 
            onClick={clearApiError}
            className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="flex flex-col items-center text-center space-y-3">
          {isOffline ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10 animate-bounce">
              <WifiOff size={28} />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg shadow-amber-500/10 animate-pulse">
              <AlertTriangle size={28} />
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-white">
              {isOffline ? 'Server Connection Interrupted' : 'API Request Failed'}
            </h2>
            <p className="text-dark-400 text-xs px-4">
              {isOffline 
                ? 'We cannot reach the InterviewAce backend. Please check your network connection or verify that the server is running.' 
                : apiError.message}
            </p>
          </div>
        </div>

        {/* Debug Console Panel */}
        <div className="border border-dark-850 rounded-2xl overflow-hidden bg-dark-950/40">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="flex items-center justify-between w-full px-4 py-3 text-xs font-semibold text-dark-350 hover:bg-dark-900/40 transition-colors"
          >
            <span className="flex items-center gap-1.5"><Bug size={14} className="text-brand-400" /> View Debug Information</span>
            {showDebug ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDebug && (
            <div className="px-4 pb-4 space-y-2 border-t border-dark-850 pt-3 select-text font-mono text-[10px] text-dark-400 leading-normal max-h-48 overflow-y-auto">
              <div className="grid grid-cols-3 border-b border-dark-900 pb-1.5">
                <span className="text-dark-500">Method</span>
                <span className="col-span-2 text-white font-bold">{apiError.method}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-dark-900 pb-1.5">
                <span className="text-dark-500">Endpoint</span>
                <span className="col-span-2 text-brand-400 truncate" title={apiError.url}>{apiError.url}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-dark-900 pb-1.5">
                <span className="text-dark-500">Status Code</span>
                <span className={`col-span-2 font-extrabold ${apiError.status === 'OFFLINE' ? 'text-red-400' : 'text-amber-400'}`}>
                  {apiError.status}
                </span>
              </div>
              <div className="grid grid-cols-3 border-b border-dark-900 pb-1.5">
                <span className="text-dark-500">Server Logs</span>
                <pre className="col-span-2 text-red-300 whitespace-pre-wrap select-text leading-tight">{apiError.details || 'No payload description returned'}</pre>
              </div>
              <div className="grid grid-cols-3 pt-0.5">
                <span className="text-dark-500">Timestamp</span>
                <span className="col-span-2 text-dark-400 font-semibold">{apiError.timestamp}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions panel */}
        <div className="flex gap-3">
          {isOffline ? (
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 px-4 w-full border border-brand-500/20 shadow-md transition-colors text-xs"
            >
              <RefreshCw size={14} className="animate-spin" />
              Reconnect Database & Server
            </button>
          ) : (
            <>
              <button
                onClick={clearApiError}
                className="flex-1 rounded-xl border border-dark-800 bg-dark-900/40 hover:bg-dark-900 text-dark-350 font-semibold py-2.5 text-xs transition-colors"
              >
                Dismiss Warning
              </button>
              <button
                onClick={handleRetry}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-2.5 text-xs border border-brand-500/20 shadow-md transition-colors"
              >
                <RefreshCw size={12} />
                Retry Operation
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
