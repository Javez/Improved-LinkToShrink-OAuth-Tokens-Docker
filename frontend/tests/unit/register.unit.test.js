// RegistrationPage.unit.test.js
import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import RegistrationPage from "../../src/auth/RegistrationPage";
import { MemoryRouter } from "react-router-dom";
import fetch from "node-fetch";
import { createMemoryHistory } from "history";

jest.mock("node-fetch");

describe("RegistrationPage", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );
  });

  test("renders form fields and buttons", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    expect(inputs[0]).toBeInTheDocument(); // for username input
    expect(inputs[1]).toBeInTheDocument(); // for email input
    expect(inputs[2]).toBeInTheDocument(); // for password input

    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  test("shows error when username is invalid", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "invalid username" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle(
        "Username must be at least 4 characters long and contain only letters, numbers"
      )
    ).toBeInTheDocument();
  });

  test("shows error when email is invalid", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[1], { target: { value: "invalid email" } });
    fireEvent.click(screen.getByText("Confirm"));

    expect(
      screen.getByTitle("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  test("shows error when password is invalid", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[2], { target: { value: "invalid password" } });
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
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "validUsername" } });
    fireEvent.change(inputs[1], { target: { value: "valid@email.com" } });
    fireEvent.change(inputs[2], { target: { value: "ValidPassword123" } });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for the fetch request to complete
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check that the fetch request was made with the correct data
    expect(fetch).toHaveBeenCalledWith("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "validUsername",
        email: "valid@email.com",
        password: "ValidPassword123",
      }),
    });

    // Check that the user was redirected to the home page
    // Replace "HomeComponent" with the actual component or text that's only present in the home page
    expect(await screen.findByText("HomeComponent")).toBeInTheDocument();
  });

  test("shows error when registration fails", async () => {
    const mockResponse = { error: "Registration failed" };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => mockResponse,
    });

    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    const inputs = screen.getAllByPlaceholderText("https://example.com");
    fireEvent.change(inputs[0], { target: { value: "validUsername" } });
    fireEvent.change(inputs[1], { target: { value: "valid@email.com" } });
    fireEvent.change(inputs[2], { target: { value: "ValidPassword123" } });
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for the fetch request to complete
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check that an error message is displayed
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });

  test("shows error when Google login fails", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    // Simulate Google login failure
    const googleButton = screen.getByText("Continue with google");
    fireEvent.click(googleButton);

    // Check that an error message is displayed
    expect(screen.getByText("Google Login failed")).toBeInTheDocument();
  });

  test("shows error when Google token is invalid", async () => {
    // Mock the isGoogleTokenValid function to return false
    jest.mock("../api/googleTokenCheck", () => () => false);

    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>
    );

    // Simulate Google login success
    const googleButton = screen.getByText("Continue with google");
    fireEvent.click(googleButton);

    // Wait for the token validation to complete
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check that an error message is displayed
    expect(screen.getByText("Google token is not valid")).toBeInTheDocument();
  });
});