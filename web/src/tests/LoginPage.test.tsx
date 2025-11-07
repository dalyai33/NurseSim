// src/features/login/LoginPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock email validator
vi.mock("../../lib/validate", () => ({
  isValidEmail: (email: string) => email.includes("@"),
}));

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const pwInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole("button", { name: /Log In/i });

    expect(emailInput).not.toBeNull();
    expect(pwInput).not.toBeNull();
    expect(loginButton).not.toBeNull();
  });

  it("shows errors for invalid email and empty password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalidemail" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    const emailError = screen.queryByText(/Invalid email address/i);
    const pwError = screen.queryByText(/Really bro\? no password\?/i);

    expect(emailError).not.toBeNull();
    expect(pwError).not.toBeNull();
  });

  it("navigates to dashboard when inputs are valid", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@domain.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    expect(mockedNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
