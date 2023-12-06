import isGoogleTokenValid from "../../src/api/googleTokenCheck";
import fetch from "node-fetch";

jest.mock("node-fetch");

describe("isGoogleTokenValid", () => {
  it("returns true when the token is valid", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({}),
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await isGoogleTokenValid("valid_token");

    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/tokeninfo?id_token=valid_token"
    );
  });

  it("returns false when the token is invalid", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({ error_description: "Invalid Value" }),
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await isGoogleTokenValid("invalid_token");

    expect(result).toBe(false);
    expect(fetch).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/tokeninfo?id_token=invalid_token"
    );
  });
});
