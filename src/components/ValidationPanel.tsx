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
          <ul>
            {validation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.valid && validation.errors.length === 0 && validation.warnings.length === 0 && (
        <p className="validation-success">All BIMI requirements met! ✓</p>
      )}
    </div>
  );
}

