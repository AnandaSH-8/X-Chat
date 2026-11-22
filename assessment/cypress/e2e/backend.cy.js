// Test user credentials that will be used across tests
const rand = Math.floor(Math.random() * 10000);
const testUser = {
  fullName: "Test User",
  username: "testuser" + rand,
  email: `testuser${rand}@example.com`,
  password: "Password123!",
};
const otherUser = {
  fullName: "Other User",
  username: "otheruser" + rand,
  email: `otheruser${rand}@example.com`,
  password: "Password123!",
};
// Message that will be used for sending and receiving tests
const testMessage =
  "Hello, this is a test message " + Math.floor(Math.random() * 10000);
// ---------------- BACKEND API TESTS ----------------
describe("Backend API Tests", () => {
  before(() => {
    // Register both users and login as testUser once
    cy.backendRequest({ method: "POST", url: "/api/users/register", body: testUser });
    cy.backendRequest({ method: "POST", url: "/api/users/register", body: otherUser });
    cy.backendRequest({
      method: "POST",
      url: "/api/users/login",
      body: { email: testUser.email, password: testUser.password },
    }).then((response) => {
      Cypress.env("accessToken", response.body.data.accessToken);
    });
  });

  it("should register a user via API", () => {
    const apiUser = {
      fullName: "API Test User",
      username: "apiuser" + Math.floor(Math.random() * 10000),
      email: `apiuser${Math.floor(Math.random() * 10000)}@example.com`,
      password: "Password123!",
    };

    // Use backend URL for API tests
    cy.backendRequest({
      method: "POST",
      url: "/api/users/register",
      body: apiUser,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property(
        "username",
        apiUser.username.toLowerCase()
      );
      expect(response.body.data).to.have.property(
        "email",
        apiUser.email.toLowerCase()
      );
      expect(response.body.data).to.have.property("fullName", apiUser.fullName);
    });
  });

  it("should fail to register with duplicate email", () => {
    cy.backendRequest({
      method: "POST",
      url: "/api/users/register",
      body: testUser,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(409);
      expect(response.body.success).to.be.false;
    });
  });

  it("should login via API and receive token", () => {
    cy.backendRequest({
      method: "POST",
      url: "/api/users/login",
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property("accessToken");
      expect(response.body.data.user).to.have.property(
        "email",
        testUser.email.toLowerCase()
      );
    });
  });

  it("should fetch user profile with valid token", () => {
    cy.backendRequest({
      method: "GET",
      url: "/api/users/me",
      headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property("email", testUser.email.toLowerCase());
    });
  });

  it("should search for users with valid token", () => {
    cy.backendRequest({
      method: "GET",
      url: `/api/users/search?searchTerm=${otherUser.username.substring(0, 6)}`,
      headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an("array");
      expect(
        response.body.data.some((user) => user.username === otherUser.username.toLowerCase())
      ).to.be.true;
    });
  });

  it("should initialize a chat room with another user", () => {
    cy.backendRequest({
      method: "GET",
      url: `/api/users/search?searchTerm=${otherUser.username}`,
      headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
    }).then((searchResponse) => {
      const otherUserId = searchResponse.body.data.find(
        (user) => user.username === otherUser.username.toLowerCase()
      )._id;

      cy.backendRequest({
        method: "POST",
        url: "/api/rooms/init",
        body: { otheruser: otherUserId },
        headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data).to.have.property("members");
        expect(response.body.data.members).to.have.length(2);
        Cypress.env("roomId", response.body.data._id);
      });
    });
  });

  it("should fetch user rooms", () => {
    cy.backendRequest({
      method: "GET",
      url: "/api/rooms/userrooms",
      headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      expect(response.body.data.some((room) => room._id === Cypress.env("roomId"))).to.be.true;
    });
  });

  it("should logout and invalidate tokens", () => {
    cy.backendRequest({
      method: "GET",
      url: "/api/users/logout",
      headers: { Cookie: `accessToken=${Cypress.env("accessToken")}` },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;

      cy.wait(1000);

      cy.backendRequest({
        method: "GET",
        url: "/api/users/me",
        headers: { Cookie: `accessToken=${123}` },
        failOnStatusCode: false,
      }).then((invalidResponse) => {
        expect(invalidResponse.status).to.eq(401);
      });
    });
  });
});