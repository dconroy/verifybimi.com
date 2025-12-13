import { Footer } from '../Footer';
import { Header } from '../Header';
import '../../App.css';

function isOnToolsPath(pathname: string): boolean {
  return pathname.includes('/tools');
}

export function ToolsPage() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const baseUrl = import.meta.env.BASE_URL || '/';
  const homeHref = baseUrl;
  const dmarcHref = `${baseUrl}tools/dmarc/`;
  const bimiHref = `${baseUrl}tools/bimi/`;
  const spfDkimHref = `${baseUrl}tools/spf-dkim/`;

  if (!isOnToolsPath(pathname)) {
    return (
      <div className="app">
        <Header />
        <main className="app-main">
          <div className="upload-area">
            <h2 style={{ marginTop: 0 }}>Tools</h2>
            <p>
              <a href={homeHref}>Back to logo converter</a>
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
      <Header />

      <main className="app-main">
        <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.025em' }}>Tools</h1>
          <p style={{ display: 'block', margin: '0 auto', fontSize: '1.25rem', maxWidth: '600px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Helpful utilities for getting BIMI-ready: authentication checks, DNS helpers, and validation.
          </p>
        </div>

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
                Check if your domain publishes a DMARC record and whether it's enforced (required for BIMI).
              </div>
            </a>
            <a className="tool-tile" href={bimiHref}>
              <div className="tool-tile-title">BIMI DNS record checker</div>
              <div className="tool-tile-desc">
                Verify your BIMI DNS record is properly configured and points to a valid logo URL.
              </div>
            </a>
            <a className="tool-tile" href={spfDkimHref}>
              <div className="tool-tile-title">SPF/DKIM checker</div>
              <div className="tool-tile-desc">
                Check your SPF and DKIM records. Both are required prerequisites for BIMI eligibility.
              </div>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


