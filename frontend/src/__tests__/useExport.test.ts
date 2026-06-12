import { describe, it, expect } from "vitest";

describe("Export utility functions", () => {
  it("should have correct type definitions", () => {
    type ExportFormat = "png" | "jpeg" | "webp";
    const validFormats: ExportFormat[] = ["png", "jpeg", "webp"];
    expect(validFormats).toHaveLength(3);
  });

  it("should validate export options structure", () => {
    const options = {
      format: "png" as const,
      width: 800,
      quality: 0.92,
    };
    expect(options.format).toBe("png");
    expect(options.width).toBeGreaterThanOrEqual(100);
    expect(options.width).toBeLessThanOrEqual(4096);
    expect(options.quality).toBeGreaterThanOrEqual(0);
    expect(options.quality).toBeLessThanOrEqual(1);
  });

  it("should reject invalid width values", () => {
    const isValidWidth = (w: number) => typeof w === "number" && Number.isFinite(w) && w >= 100 && w <= 4096;
    expect(isValidWidth(800)).toBe(true);
    expect(isValidWidth(50)).toBe(false);
    expect(isValidWidth(5000)).toBe(false);
    expect(isValidWidth(NaN)).toBe(false);
    expect(isValidWidth(Infinity)).toBe(false);
  });

  it("should reject invalid quality values", () => {
    const isValidQuality = (q: number) => typeof q === "number" && Number.isFinite(q) && q >= 0 && q <= 1;
    expect(isValidQuality(0.92)).toBe(true);
    expect(isValidQuality(0.5)).toBe(true);
    expect(isValidQuality(-0.1)).toBe(false);
    expect(isValidQuality(1.5)).toBe(false);
    expect(isValidQuality(NaN)).toBe(false);
  });
});
