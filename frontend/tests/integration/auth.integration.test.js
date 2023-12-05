import nock from "nock";
import { performAuth } from "../../src/auth/AuthPage";

describe("fetch requests", () => {
  it("responds correctly to /login/user", async () => {
    nock("http://localhost:8080").post("/login/user").reply(200, {
      token: "test-token",
      username: "test-user",
    });
    const response = await fetch("http://localhost:8080/login/user", {
      method: "POST",
      body: new FormData(),
      credentials: "include",
    });
    const data = await response.json();
    expect(data.token).toBe("test-token");
    expect(data.username).toBe("test-user");
  });

  it("responds correctly to /auth/googleuser", async () => {
    nock("http://localhost:8080").post("/auth/googleuser").reply(200, {
      token: "test-token",
      username: "test-user",
      picUrl: "test-picUrl",
    });
    const result = await performAuth("test-token", "test-user", "test-picUrl");
    expect(result.token).toBe("test-token");
    expect(result.username).toBe("test-user");
    expect(result.picUrl).toBe("test-picUrl");
  });
});
