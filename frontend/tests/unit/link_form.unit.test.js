import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import LinkForm from "../../src/components/LinkForm"; // adjust this path to point to your LinkForm file
import { MemoryRouter } from "react-router-dom";

describe("LinkForm", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <LinkForm />
      </MemoryRouter>
    );
    const input = screen.getByLabelText("URL");
    expect(input).toBeInTheDocument();
  });

  it("calls onSubmit with the input value", () => {
    const handleSubmit = jest.fn();
    render(
      <LinkForm onSubmit={handleSubmit} />
    );
    const input = screen.getByLabelText("URL");
    fireEvent.change(input, { target: { value: "test-url" } });
    const button = screen.getByText("Submit");
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledWith("test-url");
  });
});
