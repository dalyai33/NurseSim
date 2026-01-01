import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimLandingPage } from "../features/sim/SimLandingPage";

// ---------------- mocks ----------------
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

vi.mock("../../assets/DuckHospitalRoom.png", () => ({
  default: "mocked-sim-bg.png",
}));

vi.mock("../../assets/GenericAvatar.png", () => ({
  default: "mocked-avatar.png",
}));

// ---------------- tests ----------------
describe("SimLandingPage", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    localStorage.clear();
  });

  it("renders the tutorial as available and levels as locked when tutorial is not completed", () => {
    render(<SimLandingPage />);

    // Tutorial button exists
    expect(screen.getByText(/tutorial/i)).toBeTruthy();

    // Locked indicators shown
    expect(screen.getAllByText(/locked/i).length).toBeGreaterThan(0);

    // Level buttons are disabled
    const level1Button = screen.getByRole("button", {
      name: /level 1 curriculum/i,
    });
    expect(level1Button.hasAttribute("disabled")).toBe(true);
  });

  it("navigates to tutorial when Tutorial button is clicked", () => {
    render(<SimLandingPage />);

    fireEvent.click(screen.getByRole("button", { name: /tutorial/i }));

    expect(navigateMock).toHaveBeenCalledWith("/sim/tutorial");
  });

  it("does not navigate to level when tutorial is not completed", () => {
    render(<SimLandingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /level 1 curriculum/i })
    );

    expect(navigateMock).not.toHaveBeenCalledWith("/sim/level-1");
  });

  it("shows completed badge and unlocks levels when tutorial is completed", () => {
    localStorage.setItem("nursesim_tutorial_completed", "true");

    render(<SimLandingPage />);

    expect(screen.getByText(/completed/i)).toBeTruthy();

    const level1Button = screen.getByRole("button", {
      name: /level 1 curriculum/i,
    });

    expect(level1Button.hasAttribute("disabled")).toBe(false);
  });

  it("navigates to level 1 when tutorial is completed", () => {
    localStorage.setItem("nursesim_tutorial_completed", "true");

    render(<SimLandingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /level 1 curriculum/i })
    );

    expect(navigateMock).toHaveBeenCalledWith("/sim/level-1");
  });

  it("navigates to level 2 and 3 when tutorial is completed", () => {
    localStorage.setItem("nursesim_tutorial_completed", "true");

    render(<SimLandingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /level 2 curriculum/i })
    );
    fireEvent.click(
      screen.getByRole("button", { name: /level 3 curriculum/i })
    );

    expect(navigateMock).toHaveBeenCalledWith("/sim/level-2");
    expect(navigateMock).toHaveBeenCalledWith("/sim/level-3");
  });

  it("navigates back to landing when back arrow is clicked", () => {
    render(<SimLandingPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /back/i })
    );

    expect(navigateMock).toHaveBeenCalledWith("/landing");
  });
});
