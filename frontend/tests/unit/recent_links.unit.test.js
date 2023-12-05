import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import RecentLinks from "../../src/components/RecentLinks"; // adjust this path to point to your RecentLinks file

describe("RecentLinks", () => {
  it("renders correctly", () => {
    const urlArray = ["http://example.com", "http://test.com"];
    const shortUrlArray = ["http://short.com", "http://short2.com"];
    render(
      <RecentLinks urlArray={urlArray} shortUrlArray={shortUrlArray} />
    );

    expect(screen.getByText("Recent links")).toBeInTheDocument();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0].value).toBe("http://example.com");
    expect(inputs[1].value).toBe("http://short.com");
    expect(inputs[2].value).toBe("http://test.com");
    expect(inputs[3].value).toBe("http://short2.com");
  });

  it("copies short link to clipboard when copy button is clicked", () => {
    const urlArray = ["http://example.com"];
    const shortUrlArray = ["http://short.com"];
    render(
      <RecentLinks urlArray={urlArray} shortUrlArray={shortUrlArray} />
    );
    const copyButton = screen.getByText("Copy");

    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(),
      },
    });

    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://short.com"
    );
  });
});
