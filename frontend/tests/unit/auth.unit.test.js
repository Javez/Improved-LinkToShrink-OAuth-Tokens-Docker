import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import AuthPage from "../../src/auth/AuthPage";
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ token: "test-token" }),
  })
);

describe("AuthPage", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it("calls fetch with the input values", async () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    const button = screen.getByText("Login");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
