import nock from "nock";
import { isGoogleTokenValid } from "../../src/api/googleTokenCheck"; 

describe("isGoogleTokenValid", () => {
  it("returns true for a valid token", async () => {
    nock("https://oauth2.googleapis.com")
      .get("/tokeninfo?id_token=test-token")
      .reply(200, {});

    const result = await isGoogleTokenValid("test-token");
    expect(result).toBe(true);
  });

  it("returns false for an invalid token", async () => {
    nock("https://oauth2.googleapis.com")
      .get("/tokeninfo?id_token=test-token")
      .reply(200, { error_description: "Invalid Value" });
    const result = await isGoogleTokenValid("test-token");
    expect(result).toBe(false);
  });
});
