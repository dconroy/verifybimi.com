/**
 * Download utilities for BIMI SVG and validation reports
 */

import type { ValidationResult } from '../core/types';

/**
 * Downloads a string as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the BIMI SVG file
 */
export function downloadBimiSvg(svg: string, originalFilename: string): void {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const filename = `${baseName}-bimi.svg`;
  downloadFile(svg, filename, 'image/svg+xml');
}

/**
 * Downloads validation report as JSON
 */
export function downloadValidationReport(validation: ValidationResult, originalFilename: string): void {
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const filename = `${baseName}-validation.json`;
  const json = JSON.stringify(validation, null, 2);
  downloadFile(json, filename, 'application/json');
}

/**
 * Copies text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

