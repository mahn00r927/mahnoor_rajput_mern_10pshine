const chai = require("chai");
const expect = chai.expect;
const jwt = require("jsonwebtoken");

const verifyToken = require("../Middleware/VerifyToken");

describe("verifyToken Middleware Tests", () => {

  // ===== NO TOKEN =====
  it("should return 401 if token is missing", () => {
    const req = {
      headers: {}  
    };

    const res = {
      status: (code) => {
        expect(code).to.equal(401);
        return {
          json: (data) => {
            expect(data.message).to.exist;
          }
        };
      }
    };

    const next = () => {
      throw new Error("next() should not be called");
    };

    verifyToken(req, res, next);
  });

  // ===== INVALID TOKEN =====
  it("should return 401 if token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidtoken"
      }
    };

    const res = {
      status: (code) => {
        expect(code).to.equal(401);
        return {
          json: (data) => {
            expect(data.message).to.exist;
          }
        };
      }
    };

    const next = () => {
      throw new Error("next() should not be called");
    };

    verifyToken(req, res, next);
  });

  // ===== VALID TOKEN =====
  it("should attach user and call next()", () => {
  const payload = { id: "user123" };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { noTimestamp: true });


  const req = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };

  const res = {};
  const next = () => {
    expect(req.user.id).to.equal(payload.id);
  };

  verifyToken(req, res, next);
});


});
