const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");
const path = require("path");

const authMiddleware = require(
  path.join(__dirname, "..", "Middleware", "AuthMiddleware.js")
);



describe("Auth Middleware Unit Tests", () => {

  // ================== NO TOKEN ==================
  it("should return 401 if no token is provided", () => {
    const req = {
      headers: {} 
    };

    const res = {
      status(code) {
        expect(code).to.equal(401);
        return this;
      },
      json(data) {
        expect(data.message).to.equal("No token, authorization denied");
      }
    };

    const next = () => {
      throw new Error("next() should not be called");
    };

    authMiddleware(req, res, next);
  });

  // ================== INVALID TOKEN ==================
  it("should return 401 if token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidtoken"
      }
    };

    const res = {
      status(code) {
        expect(code).to.equal(401);
        return this;
      },
      json(data) {
        expect(data.message).to.equal("Token is not valid");
      }
    };

    const next = () => {
      throw new Error("next() should not be called");
    };

    authMiddleware(req, res, next);
  });

  // ================== VALID TOKEN ==================
  it("should return 401 if no token is provided", () => {
  const req = {
    headers: {}
  };

  const res = {
    status(code) {
      expect(code).to.equal(401);
      return this;
    },
    json(data) {
      expect(data.message).to.equal("No token, authorization denied");
    }
  };

  const next = () => {
    throw new Error("next() should not be called");
  };

  authMiddleware(req, res, next);
});



});
