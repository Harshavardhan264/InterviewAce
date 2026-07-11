import React, { Component } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('React UI Error Boundary Captured Crash:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-dark-950 px-4 py-12 relative overflow-hidden text-white">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full glow-accent opacity-55 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full glow-accent opacity-30 blur-3xl pointer-events-none" />
          
          <div className="w-full max-w-xl glass-panel rounded-3xl p-8 border border-red-500/20 shadow-2xl space-y-6 flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 shadow-lg shadow-red-500/10 animate-pulse">
              <AlertOctagon size={36} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Application Crashed</h1>
              <p className="text-dark-400 text-sm max-w-md mx-auto">
                An unexpected rendering error occurred in the user interface. We have captured the diagnostic logs below.
              </p>
            </div>

            <div className="w-full bg-dark-900 border border-dark-800 rounded-2xl p-4 text-left font-mono text-[11px] leading-relaxed text-red-400 max-h-48 overflow-y-auto select-text shadow-inner">
              <p className="font-bold text-white mb-2">{this.state.error?.toString()}</p>
              <pre className="text-dark-400 whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack || 'No component stack trace available'}
              </pre>
            </div>

            <button
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 px-6 w-full border border-brand-500/30 shadow-lg transition-all duration-200"
            >
              <RefreshCw size={16} />
              Reset UI Environment
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
