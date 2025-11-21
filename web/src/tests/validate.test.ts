// src/lib/validate.test.ts
import { describe, it, expect } from "vitest";
import { isValidEmail } from "../lib/validate";

describe("isValidEmail", () => {
  it("returns true for valid emails", () => {
    expect(isValidEmail("test@ohsu.edu")).toBe(true);
    expect(isValidEmail("user.name+tag@ohsu.edu")).toBe(true);
    expect(isValidEmail("myemail@ohsu.edu")).toBe(true);
  });

  it("returns false for invalid emails", () => {
    expect(isValidEmail("plainaddress")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("@missingusername.com")).toBe(false);
    expect(isValidEmail("spaces are@notallowed.com")).toBe(false);
    expect(isValidEmail("double@@domain.com")).toBe(false);
    expect(isValidEmail(" test@example.com")).toBe(false);
    expect(isValidEmail("test@example.com ")).toBe(false);
    expect(isValidEmail(" ")).toBe(false);
    expect(isValidEmail("bob.email.com")).toBe(false);
    expect(isValidEmail("nonOHSUdomain@bruh.com")).toBe(false);
  });
});
