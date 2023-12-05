import isGoogleTokenValid from "../../src/api/googleTokenCheck"; 

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe("isGoogleTokenValid", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("returns true for a valid token", async () => {
    const result = await isGoogleTokenValid("test-token");
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns false for an invalid token", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error_description: "Invalid Value" }),
      })
    );

    const result = await isGoogleTokenValid("test-token");
    expect(result).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("returns false when an error occurs", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API is down"));

    const result = await isGoogleTokenValid("test-token");
    expect(result).toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});