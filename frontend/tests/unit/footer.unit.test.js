import React from "react";
import { screen, render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../../src/components/Footer"; 

describe("NavBar", () => {
  it("renders correctly", () => {
    render(
      <Router>
        <NavBar />
      </Router>
    );

    expect(screen.getByText("Link to Shrink")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Privacy")).toBeInTheDocument();
    expect(
      screen.getByText("© 2023-2024 Danylov O.G. | All Rights Reserverd")
    ).toBeInTheDocument();
  });
});
