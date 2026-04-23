import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SimLevel3Page } from "../features/sim/SimLevel3Page";
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

// Mock image imports
vi.mock("../../assets/Final_Updated_Hospital_Bg.png", () => ({
  default: "mocked-bg.png",
}));

vi.mock("../../assets/Duck.png", () => ({
  default: "mocked-duck.png",
}));

// Mock ChatbotComponent
vi.mock("../../components/Chatbot", () => ({
  default: () => <div>Mocked Chatbot</div>,
}));

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("SimLevel3Page", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    fetchMock.mockClear();
  });

  it("uses localhost domain for start level fetch", async () => {
    // Mock the start response
    const mockStartResponse = {
      attempt_id: 123,
      step: {
        step_id: 1,
        scenario_id: 3,
        step_number: 1,
        prompt_text: "What is the first step?",
        choices: ["Option 1", "Option 2"],
      },
    };

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStartResponse,
    });

    render(<SimLevel3Page />);

    // Click the "Start Level 3" button
    fireEvent.click(screen.getByRole("button", { name: /start level 3/i }));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:5000/api/sim/level3/start",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ retake: false }),
        })
      );
    });
  });

  it("uses localhost domain for submit answer fetch", async () => {
    // First, mock the start response to set up the step
    const mockStartResponse = {
      attempt_id: 123,
      step: {
        step_id: 1,
        scenario_id: 3,
        step_number: 1,
        prompt_text: "What is the first step?",
        choices: ["Option 1", "Option 2"],
      },
    };

    // Mock the answer response
    const mockAnswerResponse = {
      ok: true,
      completed: false,
      game_over: false,
      is_correct: true,
      feedback: "Correct!",
      next_step: null,
    };

    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStartResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnswerResponse,
      });

    render(<SimLevel3Page />);

    // Start the level
    fireEvent.click(screen.getByRole("button", { name: /start level 3/i }));

    // Wait for the step to be rendered
    await waitFor(() => {
      expect(screen.getByText("What is the first step?")).toBeInTheDocument();
    });

    // Click on the first choice
    fireEvent.click(screen.getByRole("button", { name: /option 1/i }));

    // Wait for the submit fetch to be called
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "http://localhost:5000/api/sim/attempts/123/answer",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step_id: 1,
            selected_index: 0,
          }),
        })
      );
    });
  });
});