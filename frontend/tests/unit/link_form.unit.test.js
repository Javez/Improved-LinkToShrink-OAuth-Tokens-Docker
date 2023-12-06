import React from "react";
import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import LinkForm from "../../src/components/LinkForm"; // adjust the path to match your file structure

describe("LinkForm", () => {
  let mockHandleLinkFormData;
  let history;

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ shortUrl: "short-url" }),
        text: () => Promise.resolve("short-url"),
        status: 200,
      })
    );
    mockHandleLinkFormData = jest.fn();
    history = createMemoryHistory();
  });

  it("renders without crashing", () => {
    render(
      <Router history={history}>
        <LinkForm
          _host="localhost"
          _port="8080"
          handleLinkFormData={mockHandleLinkFormData}
          history={history}
        />
      </Router>
    );
  });

  it("calls handleLinkFormData with the input value on form submission", async () => {
    render(
      <Router history={history}>
        <LinkForm
          _host="localhost"
          _port="8080"
          handleLinkFormData={mockHandleLinkFormData}
          history={history}
        />
      </Router>
    );

    const input = screen.getByPlaceholderText("https://example.com");
    fireEvent.change(input, { target: { value: "test-url" } });

    const button = screen.getByText("Reduce My Link");
    fireEvent.click(button);

    await waitFor(() =>
      expect(mockHandleLinkFormData).toHaveBeenCalledWith(
        "test-url",
        "short-url"
      )
    );
  });
});
