import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../features/auth/LoginPage";
import type * as RRDom from "react-router-dom";

// --------------------
// Mocks
// --------------------
const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual: typeof RRDom = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../../lib/validate", () => ({
  isValidEmail: (email: string) => email.includes("@"),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    vi.restoreAllMocks();
  });

  it("loads the login page", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /log in/i })).not.toBeNull();
  });

  it("renders the login form fields", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).not.toBeNull();
    expect(screen.getByLabelText(/password/i)).not.toBeNull();
  });

  it("shows errors for invalid email and empty password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "" },
    });

<<<<<<< HEAD
    const emailError = screen.queryByText(/Invalid email or password\./i); // updated
    const pwError = screen.queryByText(/Password is required\./i);       // updated
=======
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));
>>>>>>> origin/main

    expect(screen.queryByText(/invalid email or password\./i)).not.toBeNull();
    expect(screen.queryByText(/password is required\./i)).not.toBeNull();
  });

  it("navigates to landing on successful login", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    } as Response);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@ohsu.edu" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/landing");
    });
  });

  it("shows form error when login fails", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, error: "Invalid credentials" }),
    } as Response);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@ohsu.edu" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText(/invalid credentials/i)).not.toBeNull();
  });


  it("shows default error message when login fails without server error message", async () => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ ok: false }), // ← NO error field
  } as Response);

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "test@ohsu.edu" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "wrongpassword" },
  });

  fireEvent.click(screen.getByRole("button", { name: /log in/i }));

  expect(
    await screen.findByText(/login failed\. please check your email and password\./i)
  ).not.toBeNull();
  });


  it("navigates to signup when clicking Create Account", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/create account/i));

    expect(mockedNavigate).toHaveBeenCalledWith("/signup");
  });

  it("shows error when email is empty", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "somepassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.queryByText(/email is required\./i)).not.toBeNull();
  });


  it("shows server error when fetch throws", async () => {
  globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@ohsu.edu" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      await screen.findByText(/could not reach the server\. try again\./i)
    ).not.toBeNull();
  });

});

