const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const User = require("../Models/User");

chai.use(chaiHttp);
const expect = chai.expect;

let token;

// ================== TEST USER DATA ==================
const testUser = {
  name: "Test User",
  email: `test_${Date.now()}@gmail.com`,
  password: "123456",
};

// ================== AUTH TESTS ==================
describe("AUTH TESTS", function () {

  // Clean DB before tests
  // before(async function () {
  //   await User.deleteMany({});
  // });
 // ================== SIGNUP TESTS ==================
  it("should signup a new user", async function () {
    const res = await chai
      .request(app)
      .post("/api/auth/signup")
      .send(testUser);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("message");
  });

  it("should fail for duplicate email", async function () {
    const res = await chai
      .request(app)
      .post("/api/auth/signup")
      .send(testUser);

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal("User already exists");
  });

   // ================== LOGIN TESTS ==================

  it("should login user and return token", async function () {
    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res).to.have.status(200);
    expect(res.body.token).to.exist;

    token = res.body.token;
  });

  it("should fail login with wrong password", async function () {
    const res = await chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "wrongpassword",
      });

    expect(res).to.have.status(401);
  });
   // ================== PROTECTED ROUTE TESTS ==================

  it("should access protected route with valid token", async function () {
    const res = await chai
      .request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
  });

  it("should fail protected route without token", async function () {
    const res = await chai
      .request(app)
      .get("/protected");

    expect(res).to.have.status(401);
  });

  it("should fail protected route with invalid token", async function () {
    const res = await chai
      .request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res).to.have.status(401);
  });

});
let resetToken;

//=================================Forgot Password Tests=================================// 
describe("Forgot Password API", () => {
  it("should send reset password email", async () => {
    const res = await chai
      .request(app)
      .post("/api/forgot-password/request-reset")
      .send({ email: testUser.email });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("message");

    // Get token from DB 
    const user = await User.findOne({ email: testUser.email });
    resetToken = user.resetPasswordToken; 
    expect(resetToken).to.exist;
  });
});
