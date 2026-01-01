import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SimIntroductionPage } from "../features/sim/SimIntroductionPage";

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

// Mock image imports
vi.mock("../../assets/DuckHospitalRoom.png", () => ({
  default: "mocked-sim-bg.png",
}));

vi.mock("../../assets/GenericAvatar.png", () => ({
  default: "mocked-avatar.png",
}));

// ---------------- tests ----------------
describe("SimIntroductionPage", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    localStorage.clear();
  });

  it("renders the introduction popup by default", () => {
    render(<SimIntroductionPage />);

    expect(
      screen.getByText(/welcome to the nursing sim\+ tutorial/i)
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: /start quiz/i })
    ).toBeTruthy();
  });

  it("starts the quiz when Start Quiz is clicked", () => {
    render(<SimIntroductionPage />);

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(
      screen.getByText(/what does the prefix 'hemo-'/i)
    ).toBeTruthy();
  });

  it("shows incorrect popup when a wrong answer is selected", () => {
    render(<SimIntroductionPage />);

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));
    fireEvent.click(screen.getByRole("button", { name: /liver/i }));

    expect(
      screen.getByText(/not quite try again/i)
    ).toBeTruthy();
  });

  it("shows success popup and sets localStorage when correct answer is selected", () => {
    render(<SimIntroductionPage />);

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));
    fireEvent.click(screen.getByRole("button", { name: /blood/i }));

    expect(
      screen.getByText(/correct! 'hemo-' relates to blood/i)
    ).toBeTruthy();

    expect(localStorage.getItem("nursesim_tutorial_completed")).toBe("true");
  });

  it("navigates to /sim when Exit Tutorial is clicked", () => {
    render(<SimIntroductionPage />);

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));
    fireEvent.click(screen.getByRole("button", { name: /blood/i }));
    fireEvent.click(screen.getByRole("button", { name: /exit tutorial/i }));

    expect(navigateMock).toHaveBeenCalledWith("/sim");
  });

  it("navigates back to /sim when back arrow is clicked", () => {
    render(<SimIntroductionPage />);

    fireEvent.click(screen.getByRole("button", { name: /back/i }));

    expect(navigateMock).toHaveBeenCalledWith("/sim");
  });
  it("closes the incorrect popup when Close and try again is clicked", () => {
    render(<SimIntroductionPage />);

    // Start the quiz
    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    // Choose a wrong answer
    fireEvent.click(screen.getByRole("button", { name: /liver/i }));

    // Incorrect popup should be visible
    expect(
        screen.getByText(/not quite try again/i)
    ).toBeTruthy();

    // Close the popup
    fireEvent.click(
        screen.getByRole("button", { name: /close and try again/i })
    );

    // Popup should be gone
    expect(
        screen.queryByText(/not quite try again/i)
    ).toBeNull();
    });

});
