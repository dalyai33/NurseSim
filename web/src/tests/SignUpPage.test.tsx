// src/features/signup/SignUpPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignUpPage from "../features/auth/SignUpPage";
import type * as RRDom from "react-router-dom";

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: typeof RRDom = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock email validator
vi.mock("../../lib/validate", () => ({
  isValidEmail: (email: string) => email.includes("@"),
}));

describe("SignUpPage", () => {
  it("renders all form fields and buttons", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Check all inputs
    expect(screen.getByLabelText(/First Name/i)).not.toBeNull();
    expect(screen.getByLabelText(/Last Name/i)).not.toBeNull();
    expect(screen.getByLabelText(/Student ID/i)).not.toBeNull();
    expect(screen.getByLabelText(/Phone Number/i)).not.toBeNull();
    expect(screen.getByLabelText(/Email/i)).not.toBeNull();
    expect(screen.getByLabelText(/Password/i)).not.toBeNull();

    // Check buttons
    expect(screen.getByRole("button", { name: /Sign Up/i })).not.toBeNull();
    expect(screen.getByRole("button", { name: /Sign In/i })).not.toBeNull();
  });

  it("shows errors for empty or invalid inputs", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(screen.queryByText(/Invalid email address/i)).not.toBeNull();
    expect(screen.queryByText(/Really bro\? no password/i)).not.toBeNull();
    expect(screen.queryByText(/You should have a first name/i)).not.toBeNull();
    expect(screen.queryByText(/You should have a last name/i)).not.toBeNull();
    expect(screen.queryByText(/You should have a student ID/i)).not.toBeNull();
    expect(screen.queryByText(/You should have a phone number/i)).not.toBeNull();
  });

  it("navigates to login on valid input", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
    fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "97000001" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "+12345678910" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@domain.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });
});
