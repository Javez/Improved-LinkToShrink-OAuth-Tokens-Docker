import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import RegistrationPage from "../../src/auth/RegistrationPage"; // adjust this path to point to your RegistrationPage file
import { MemoryRouter } from "react-router-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "User registered successfully" }),
  })
);

describe("RegistrationPage", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
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
        <RegistrationPage />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(usernameInput, { target: { value: "test-username" } });
    fireEvent.change(passwordInput, { target: { value: "test-password" } });
    const button = screen.getByText("Register");
    fireEvent.click(button);

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });
});
