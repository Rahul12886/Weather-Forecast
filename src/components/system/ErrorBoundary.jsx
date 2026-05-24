import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
          <section className="glass-panel max-w-md p-8 text-center">
            <FiAlertTriangle className="mx-auto mb-4 h-10 w-10 text-amber-500" />
            <h1 className="text-2xl font-bold">Something went cloudy</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Refresh the app and try again. The rest of your settings are saved locally.
            </p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
