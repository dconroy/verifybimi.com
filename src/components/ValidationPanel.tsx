import type { ValidationResult } from '../core/types';

interface ValidationPanelProps {
  validation: ValidationResult | null;
  isSvgSource?: boolean | null;
}

export function ValidationPanel({ validation, isSvgSource }: ValidationPanelProps) {
  if (!validation) {
    return (
      <div className="validation-panel">
        <h3>Validation</h3>
        <p className="validation-placeholder">Convert a logo to see validation results</p>
      </div>
    );
  }

  const dmarcToolHref = `${import.meta.env.BASE_URL}tools/dmarc/`;

  const statusClass = validation.valid ? 'valid' : 'invalid';
  const statusIcon = validation.valid ? '✓' : '✗';

  return (
    <div className="validation-panel">
      <h3>Validation Status</h3>
      
      <div className={`validation-status ${statusClass}`}>
        <span className="status-icon">{statusIcon}</span>
        <span className="status-text">
          {validation.valid 
            ? (isSvgSource === false 
                ? 'Valid BIMI SVG structure. This file was auto-generated from a raster logo, so visual accuracy should still be reviewed by a designer.'
                : 'Valid BIMI SVG. This file meets core BIMI structural requirements.')
            : 'Not valid for BIMI'}
        </span>
      </div>

      {validation.errors.length > 0 && (
        <div className="validation-errors">
          <h4>Errors</h4>
          <ul>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="validation-warnings">
          <h4>Warnings</h4>
          <ul className="checklist">
            {validation.warnings.map((warning, index) => (
              <li key={index} className="check-warning">
                <span className="check-icon">!</span>
                <span className="check-name">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.checks && validation.checks.length > 0 && (
        <div className="validation-checklist">
          <h4>BIMI Compliance Checklist</h4>
          {isSvgSource === false && (
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontStyle: 'italic' }}>
              Validation result applies to the generated SVG. Since this started from a raster image, visual accuracy may still require a designer to review.
            </p>
          )}
          <ul className="checklist">
            {validation.checks.map((check, index) => (
              <li key={index} className={check.passed ? 'check-passed' : 'check-failed'}>
                <span className="check-icon">{check.passed ? '✓' : '✗'}</span>
                <span className="check-name">{check.name}</span>
                {check.message && (
                  <span className="check-message">{check.message}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="validation-next-steps">
        <h4>Next steps (for BIMI)</h4>
        <p style={{ marginTop: 0 }}>
          BIMI eligibility typically requires an enforced DMARC policy (<code>p=quarantine</code> or <code>p=reject</code>).{' '}
          <a href={dmarcToolHref}>Verify your DMARC record</a>.
        </p>
      </div>
    </div>
  );
}

