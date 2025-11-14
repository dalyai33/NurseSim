// src/tests/DashboardPage.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MantineProvider } from "@mantine/core";
import DashboardPage from "../features/dashboard/DashboardPage";

describe("DashboardPage", () => {
  it("renders the welcome heading, sidebar, and success message", () => {
    render(
    <MantineProvider>
      <DashboardPage />
    </MantineProvider>
  );

    // Get elements by text and assert their content
    const heading = screen.getByRole("heading", { level: 2 });
    const paragraph = screen.getByText("You successfully logged in!");

    // Assert their text content
    expect(heading.textContent).toBe("Welcome to NurseSim!");
    expect(paragraph.textContent).toBe("You successfully logged in!");
  });
});
