import React from "react";
import { screen, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../../src/components/Navbar"; // adjust this path to point to your Navbar file

describe("Navbar", () => {
  it("renders correctly", () => {
    render(
      <Router>
        <Navbar />
      </Router>
    );

    expect(screen.getByText("Link to Shrink")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Check ChatGPT")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});
