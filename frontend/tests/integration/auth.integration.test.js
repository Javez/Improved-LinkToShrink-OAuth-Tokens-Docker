// AuthPage.integration.test.js
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "../../src/auth/AuthPage";
import fetch from "node-fetch";

jest.mock("node-fetch");
describe("AuthPage Integration", () => {
 test("submits the form and navigates to the home page", async () => {
   // Spy on the fetch API
   const mockFetch = jest.spyOn(global, "fetch");
   mockFetch.mockImplementation(() =>
     Promise.resolve({
       json: () => Promise.resolve({ token: "123", username: "test" }),
     })
   );

   render(
     <MemoryRouter>
       <AuthPage />
     </MemoryRouter>
   );

   // Simulate form submission
   fireEvent.change(screen.getByPlaceholderText("https://example.com"), {
     target: { value: "test@example.com" },
   });
   fireEvent.click(screen.getByText("Confirm"));

   // Wait for the fetch call
   await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

   // Check the result
   expect(screen.getByText("Home")).toBeInTheDocument();

   // Clean up the fetch mock
   mockFetch.mockRestore();
 });

  // ... other integration tests
});
