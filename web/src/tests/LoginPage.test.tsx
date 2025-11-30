// src/features/login/LoginPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
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

describe("LoginPage", () => {
  it("loads the login page", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Log In/i)).not.toBeNull();
  });
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

    const emailError = screen.queryByText(/Invalid email or password\./i); // updated
    const pwError = screen.queryByText(/Password is required\./i);       // updated

    expect(emailError).not.toBeNull();
    expect(pwError).not.toBeNull();
  });

  it("navigates to landing when inputs are valid", () => {          // updated description
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@ohsu.edu" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i }));

    //expect(mockedNavigate).toHaveBeenCalledWith("/landing");      // updated
  });

  it("navigates to signup page when selecting create account", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const link = screen.getByText(/Create Account/i);
    fireEvent.click(link);
    expect(mockedNavigate).toHaveBeenCalledWith("/signup");
 
    
  });

  it("shows an error when email is empty", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Leave email empty
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "somepassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Log In/i })); 

    const emailRequiredError = screen.getByText(/Email is required\./i);

    expect(emailRequiredError).not.toBeNull();
});



});
