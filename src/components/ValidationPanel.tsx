import type { ValidationResult } from '../core/types';

interface ValidationPanelProps {
  validation: ValidationResult | null;
}

export function ValidationPanel({ validation }: ValidationPanelProps) {
  if (!validation) {
    return (
      <div className="validation-panel">
        <h3>Validation</h3>
        <p className="validation-placeholder">Convert a logo to see validation results</p>
      </div>
    );
  }

  const statusClass = validation.valid ? 'valid' : 'invalid';
  const statusIcon = validation.valid ? '✓' : '✗';

  return (
    <div className="validation-panel">
      <h3>Validation Status</h3>
      
      <div className={`validation-status ${statusClass}`}>
        <span className="status-icon">{statusIcon}</span>
        <span className="status-text">
          {validation.valid ? 'Valid for BIMI' : 'Not valid for BIMI'}
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
    </div>
  );
}

