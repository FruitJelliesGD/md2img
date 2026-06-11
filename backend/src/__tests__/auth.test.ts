import { describe, it, expect } from "vitest";
import crypto from "crypto";

describe("auth middleware timing-safe comparison", () => {
  it("equal strings should match", () => {
    const a = Buffer.from("test-api-key");
    const b = Buffer.from("test-api-key");
    expect(crypto.timingSafeEqual(a, b)).toBe(true);
  });

  it("different strings should not match", () => {
    const a = Buffer.from("test-api-key-123");
    const b = Buffer.from("wrong-api-key-99");
    expect(crypto.timingSafeEqual(a, b)).toBe(false);
  });

  it("different lengths should be handled", () => {
    const a = Buffer.from("short");
    const b = Buffer.from("much-longer-key");
    expect(a.length).not.toBe(b.length);
  });
});
