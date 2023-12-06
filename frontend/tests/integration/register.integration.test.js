// RegistrationPage.integration.test.js
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RegistrationPage from "../../src/auth/RegistrationPage";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("RegistrationPage Integration", () => {
  test("submits the form and navigates to the login page", async () => {
    // Spy on the fetch API
    const mockFetch = jest.spyOn(global, "fetch");
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: "Registration successful. Please log in.",
          }),
      })
    );

    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    // Simulate form submission
    fireEvent.change(screen.getAllByPlaceholderText("https://example.com")[0], {
      target: { value: "testUsername" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("https://example.com")[1], {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getAllByPlaceholderText("https://example.com")[2], {
      target: { value: "TestPassword123" },
    });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for the fetch call
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Check the result
    expect(
      screen.getByText("Already have account? Sing In")
    ).toBeInTheDocument();

    // Clean up the fetch mock
    mockFetch.mockRestore();
  });

  // ... other integration tests
});
