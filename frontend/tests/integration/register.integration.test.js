import nock from "nock";
import { registerUser } from "../../src/auth/RegistrationPage"; 

describe("RegistrationPage fetch requests", () => {
  it("responds correctly to /auth/googleuser", async () => {
    nock("http://localhost:8080").post("/auth/googleuser").reply(200, {
      token: "test-token",
      username: "test-user",
      picUrl: "test-picUrl",
    });
    const result = await registerUser("test-token", "test-user", "test-picUrl"); // replace with your actual function
    expect(result.token).toBe("test-token");
    expect(result.username).toBe("test-user");
    expect(result.picUrl).toBe("test-picUrl");
  });

  it("responds correctly to /register/user", async () => {
    nock("http://localhost:8080").post("/register/user").reply(200, {
      message: "User registered successfully",
    });
    const result = await registerUser("test-username", "test-password"); // replace with your actual function
    expect(result.message).toBe("User registered successfully");
  });
});