import { Footer } from '../Footer';
import '../../App.css';

function isOnToolsPath(pathname: string): boolean {
  return pathname.includes('/tools');
}

export function ToolsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const homeHref = baseUrl;
  const dmarcHref = `${baseUrl}tools/dmarc/`;

  if (!isOnToolsPath(pathname)) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>VerifyBIMI</h1>
          <p className="app-description">Tools</p>
          <div className="app-header-actions">
            <a className="header-cta" href={homeHref}>
              Back to the converter
            </a>
          </div>
        </header>
        <main className="app-main">
          <div className="upload-area">
            <h2 style={{ marginTop: 0 }}>Tools</h2>
            <p>
              <a href={homeHref}>Back to the converter</a>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (typeof document !== 'undefined') {
    document.title = 'Tools | VerifyBIMI';
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tools</h1>
        <p className="app-description">
          Helpful utilities for getting BIMI-ready: authentication checks, DNS helpers, and validation.
        </p>
        <div className="app-header-actions">
          <a className="header-cta" href={homeHref}>
            Back to the converter
          </a>
          <a className="header-cta" href={dmarcHref}>
            DMARC verifier
          </a>
        </div>
      </header>

      <main className="app-main">
        <div className="tools-page">
          <div className="tools-card">
            <div className="tools-kicker">Tools</div>
            <h2 className="tools-title">Available tools</h2>
            <p className="tools-muted">
              These tools run in your browser. DNS lookups are performed using DNS-over-HTTPS via a public resolver you
              select.
            </p>
          </div>

          <div className="tools-grid">
            <a className="tool-tile" href={dmarcHref}>
              <div className="tool-tile-title">DMARC verifier</div>
              <div className="tool-tile-desc">
                Check if your domain publishes a DMARC record and whether it’s enforced (required for BIMI).
              </div>
            </a>
            <div className="tool-tile tool-tile-disabled" aria-disabled="true">
              <div className="tool-tile-title">More tools coming soon</div>
              <div className="tool-tile-desc">BIMI DNS record checker, SPF/DKIM helpers, and more.</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


