import nock from "nock";
import { handleLinkSubmit } from "../../src/components/LinkForm";

describe("LinkForm fetch requests", () => {
  it("responds correctly to /shrinkUrl", async () => {
    nock("http://localhost:8080").post("/shrinkUrl").reply(200, "short-url");
    const result = await handleLinkSubmit("test-url"); 
    expect(result).toBe("short-url");
  });

  it("responds with 401 for unauthorized request", async () => {
    nock("http://localhost:8080").post("/shrinkUrl").reply(401);
    const result = await handleLinkSubmit("test-url"); 
    expect(result).toBeUndefined();
  });
});