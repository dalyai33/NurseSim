import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LandingPage } from "../features/landing/LandingPage";
import "@testing-library/jest-dom";

// Mock react-router-dom
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock the image import
vi.mock("../../assets/MainBackground.png", () => ({
  default: "mocked-background.png",
}));

describe("LandingPage", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  it("renders the landing title", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", { name: /ohsu nurse sim\+/i })
    ).toBeInTheDocument();
  });

  it("navigates to /sim when Enter button is clicked", () => {
    render(<LandingPage />);

    fireEvent.click(screen.getByRole("button", { name: /enter/i }));

    expect(navigateMock).toHaveBeenCalledWith("/sim");
  });

  it("navigates to /teacher when Teacher View button is clicked", () => {
    render(<LandingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /teacher view/i })
    );

    expect(navigateMock).toHaveBeenCalledWith("/teacher");
  });
});
