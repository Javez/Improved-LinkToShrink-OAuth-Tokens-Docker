import React from "react";
import { screen, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import MainPage from "../../src/components/MainPage"; // adjust this path to point to your MainPage file

describe("MainPage", () => {
  it("renders correctly", () => {
    render(
      <Router>
        <MainPage />
      </Router>
    );

    expect(screen.getByText("Main page")).toBeInTheDocument();
  });
});
