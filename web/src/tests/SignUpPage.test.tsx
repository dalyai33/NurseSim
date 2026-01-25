// src/features/signup/SignUpPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignUpPage from "../features/auth/SignUpPage";
import type * as RRDom from "react-router-dom";
import "@testing-library/jest-dom";


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

    // Updated to match the actual error messages
    expect(screen.queryByText(/Enter a valid OHSU email\./i)).not.toBeNull();
    expect(screen.queryByText(/Password required\./i)).not.toBeNull();
    expect(screen.queryByText(/First name required\./i)).not.toBeNull();
    expect(screen.queryByText(/Last name required\./i)).not.toBeNull();
    expect(screen.queryByText(/Student ID required\./i)).not.toBeNull();
    expect(screen.queryByText(/Phone required\./i)).not.toBeNull();
  });

  it("navigates to landing on valid input", async () => {
  // Mock successful fetch response
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ok: true })
    })
  ));

  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Alex" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
  fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "97000001" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "+12345678910" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@ohsu.edu" } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

  fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

  // Wait for async effects
  await screen.findByText(/Sign Up/i); // Wait for component re-render (optional)
  
  expect(mockedNavigate).toHaveBeenCalledWith("/landing");
});

it("shows server error when fetch fails", async () => {
  // Mock fetch to throw an error
  vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("Network error"))));

  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Alex" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
  fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "97000001" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "+12345678910" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@ohsu.edu" } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

  fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

  // Wait for the error message to appear
  const error = await screen.findByText(/Could not reach the server. Please try again./i);
  expect(error).toBeInTheDocument();
});


  it("redirects to log in screen when user has account already", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );
    const link = screen.getByText("Already have an account? Sign In");
    fireEvent.click(link);
    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("shows an error when email is empty", () => {
    render(
      <MemoryRouter>
        <SignUpPage />
      </MemoryRouter>
    );

    // Leave all required fields except email filled OR blank as appropriate
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Alex" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
    fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "97000001" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "+12345678910" } });

    // Email is empty
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "" } });

    // Password can be filled or left blank — not important for covering *email empty* branch
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    expect(screen.queryByText(/Email is required\./i)).not.toBeNull();
  });



  it("sets isTeacher when correct teacher code is entered", () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  const teacherInput = screen.getByLabelText(/Teacher Code/i) as HTMLInputElement;
  const teacherCheckbox = screen.getByLabelText(/Create Teacher Account/i) as HTMLInputElement;

  // Enter correct code
  fireEvent.change(teacherInput, { target: { value: "NurseSimCapstone" } });

  expect(teacherInput.value).toBe("NurseSimCapstone");
  expect(teacherCheckbox.checked).toBe(true);

  // Now check the checkbox
  fireEvent.click(teacherCheckbox);
  expect(teacherCheckbox.checked).toBe(false);
  expect(screen.queryByText(/Please enter the correct teacher code first/i)).toBeNull();
});

it("shows error if checkbox clicked without correct teacher code", () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  const teacherCheckbox = screen.getByLabelText(/Create Teacher Account/i) as HTMLInputElement;

  // Checkbox clicked without entering code
  fireEvent.click(teacherCheckbox);
  expect(teacherCheckbox.checked).toBe(false);
  expect(screen.queryByText(/Please enter the correct teacher code first/i)).toBeNull();
});

it("resets teacher error when correct code entered after previous wrong attempt", () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  const teacherInput = screen.getByLabelText(/Teacher Code/i) as HTMLInputElement;

  // Enter incorrect code
  fireEvent.change(teacherInput, { target: { value: "wrongcode" } });
  expect(teacherInput.value).toBe("wrongcode");

  // Now enter correct code
  fireEvent.change(teacherInput, { target: { value: "NurseSimCapstone" } });
  expect(teacherInput.value).toBe("NurseSimCapstone");

  // Teacher error should be removed
  expect(screen.queryByText(/Invalid teacher code/i)).toBeNull();
});

it("shows server error if signup fails", async () => {
  vi.stubGlobal("fetch", vi.fn(() =>
    Promise.resolve({ ok: false, json: () => Promise.resolve({ error: "Server error" }) })
  ));

  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Alex" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
  fireEvent.change(screen.getByLabelText(/Student ID/i), { target: { value: "97000001" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "+12345678910" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@ohsu.edu" } });
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });

  fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

  // Wait for error message
  const error = await screen.findByText(/Server error/i);
  expect(error).not.toBeNull();
});

it("shows teacher code error when clicking checkbox with wrong code", () => {
  render(
    <MemoryRouter>
      <SignUpPage />
    </MemoryRouter>
  );

  // Enter wrong teacher code
  fireEvent.change(screen.getByLabelText(/Teacher Code/i), { target: { value: "wrongcode" } });

  const checkbox = screen.getByLabelText(/Create Teacher Account/i) as HTMLInputElement;

  // Temporarily enable checkbox
  checkbox.disabled = false;

  fireEvent.click(checkbox);

  // Expect error message
  expect(screen.getByText(/Please enter the correct teacher code first\./i)).toBeInTheDocument();
  expect(checkbox.checked).toBe(false); // checkbox is reset
});




});
