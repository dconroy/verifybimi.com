/**
 * Core BIMI Conversion API
 * 
 * This module provides the main conversion functions that can be used
 * by React components, backend services, or CLI tools.
 * 
 * FUTURE MICRO-SAAS INTEGRATION:
 * - These functions can be moved to a separate package
 * - Backend API can wrap these functions with:
 *   - User authentication
 *   - Usage limits and quotas
 *   - Rate limiting
 *   - Analytics tracking
 *   - Caching of conversions
 *   - Batch processing
 */

import type { ConvertOptions, ValidationResult } from './types';
import { validateBimiSvg } from './svgValidate';
import { normalizeSvg } from './svgNormalize';
import { imageToSvg } from './imageToSvg';

export type { ConvertOptions, ValidationResult, Shape } from './types';

/**
 * Converts a file (PNG, JPG, or SVG) to a BIMI-compliant SVG
 */
export async function convertToBimiSvg(
  file: File,
  options: ConvertOptions = {}
): Promise<{ svg: string; validation: ValidationResult }> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  let svg: string;

  if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
    // Handle SVG file
    const svgText = await file.text();
    svg = normalizeSvg(svgText, options);
  } else if (
    fileType.startsWith('image/') ||
    fileName.match(/\.(png|jpg|jpeg)$/i)
  ) {
    // Handle raster image
    svg = await imageToSvg(file, options);
  } else {
    throw new Error(`Unsupported file type: ${fileType}. Supported: PNG, JPG, SVG`);
  }

  // Validate the result
  const validation = validateBimiSvg(svg);

  return { svg, validation };
}

/**
 * Validates an SVG string against BIMI requirements
 */
export { validateBimiSvg as validateBimiSvg };

