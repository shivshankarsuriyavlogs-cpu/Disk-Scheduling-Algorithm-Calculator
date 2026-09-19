import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Disk Scheduling Calculator runtime error:', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        fontFamily: 'system-ui, sans-serif',
        background: '#f8fafc',
        color: '#0f172a',
      }}>
        <section style={{
          maxWidth: '720px',
          width: '100%',
          padding: '28px',
          borderRadius: '16px',
          background: '#fff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px rgba(15,23,42,.08)',
        }}>
          <h1 style={{ margin: '0 0 10px', fontSize: '24px' }}>
            Disk Scheduling Calculator
          </h1>
          <p style={{ margin: '0 0 14px', color: '#475569' }}>
            The application hit a runtime error. Refresh once; if it persists, the
            technical error below identifies the failing code instead of showing a blank page.
          </p>
          <pre style={{
            margin: 0,
            padding: '14px',
            overflow: 'auto',
            borderRadius: '10px',
            background: '#f1f5f9',
            color: '#b91c1c',
            whiteSpace: 'pre-wrap',
          }}>{this.state.message}</pre>
        </section>
      </main>
    );
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Application root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>,
);
