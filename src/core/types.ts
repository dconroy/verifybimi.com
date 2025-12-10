/**
 * Core types for BIMI logo conversion
 * These types are framework-agnostic and can be reused by backend or CLI tools
 */

export type Shape = "circle" | "rounded-square";

export type ConvertOptions = {
  backgroundColor?: string;      // hex string, default "#FFFFFF"
  shape?: Shape;                 // default "circle"
  paddingPercent?: number;        // default 12.5
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
};

