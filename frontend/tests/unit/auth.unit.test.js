// AuthPage.unit.test.js
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import AuthPage from "../../src/auth/AuthPage";
import { MemoryRouter } from "react-router-dom";
import fetch from "node-fetch";
import { waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";

jest.mock("node-fetch");

describe("AuthPage", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
  });

  test("renders form fields and buttons", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    expect(inputs[0]).toBeInTheDocument(); // for email input
    expect(inputs[1]).toBeInTheDocument(); // for password input

    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  test("shows error when email is invalid", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "invalid email" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows error when password is invalid", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "test@email.com" } });
    fireEvent.change(inputs[1], { target: { value: "invalid password" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle(
        "Password must be at least 8 characters long and contain at least one digit, one lower case letter, and one upper case letter"
      )
    ).toBeInTheDocument();
  });

  test("submits form data when form is valid", async () => {
    const mockResponse = { status: "success" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");

    fireEvent.change(inputs[0], { target: { value: "test@email.com" } });
    fireEvent.change(inputs[1], { target: { value: "validPassword123" } });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for fetch to be called
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check that fetch was called with the correct data
    expect(fetch).toHaveBeenCalledWith("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@email.com",
        password: "validPassword123",
      }),
    });
  });

  test("renders email input field", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("https://example.com");
    expect(emailInput).toBeInTheDocument();
  });

  test("renders password input field", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Password"); // Adjust this to match the actual placeholder text
    expect(passwordInput).toBeInTheDocument();
  });

  test("renders Confirm button", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).toBeInTheDocument();
  });

  test("show error when email is invalid", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(emailInput, { target: { value: "invalid email" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows errr when password is invalid", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getAllByPlaceholderText(
      "https://example.com"
    )[1];
    fireEvent.change(passwordInput, { target: { value: "invalid password" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle(
        "Password must be at least 8 characters long and contain at least one digit, one lower case letter, and one upper case letter"
      )
    ).toBeInTheDocument();
  });

  test("displays error message when fetch request fails", async () => {
    fetch.mockRejectedValueOnce(new Error("Fetch failed"));

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "test@email.com" } });
    fireEvent.change(inputs[1], { target: { value: "validPassword123" } });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for the error message to be displayed
    const errorMessage = await screen.findByText("Fetch failed");
    expect(errorMessage).toBeInTheDocument();
  });

  test("redirects to home page and updates session storage when fetch request is successful", async () => {
    const mockResponse = { token: "token123", username: "testuser" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    const history = createMemoryHistory();
    render(
      <MemoryRouter history={history}>
        <AuthPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("https://example.com");
    const passwordInput = screen.getByPlaceholderText("password"); // Adjust this to match the actual placeholder text
    fireEvent.change(emailInput, { target: { value: "test@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "validPassword123" } });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for the fetch request to complete
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check that the user was redirected to the home page
    expect(history.location.pathname).toBe("/");

    // Check that the session storage was updated
    expect(sessionStorage.getItem("token")).toBe("token123");
    expect(sessionStorage.getItem("username")).toBe("testuser");
  });
});
