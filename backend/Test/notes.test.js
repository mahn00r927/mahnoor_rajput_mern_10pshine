const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

const User = require("../Models/User");
const Note = require("../Models/Note");

chai.use(chaiHttp);
const expect = chai.expect;

let token;
let noteId;

// ================== TEST USER ==================
const testUser = {
  name: "Note Test User",
  email: `note_${Date.now()}@gmail.com`,
  password: "123456",
};

// ================== NOTES API TESTS ==================
describe("NOTES API TESTS", function () {

  // ================== SETUP ==================
  before(async function () {
    // Clean DB
    await User.deleteMany({});
    await Note.deleteMany({});

    // Signup user
    await chai.request(app)
      .post("/api/auth/signup")
      .send(testUser);

    // Login user & get token
    const res = await chai.request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    token = res.body.token;
  });

  // ================== CREATE NOTE TESTS ==================

  // Create note successfully
  it("should create a new note", async function () {
    const res = await chai
      .request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Note",
        content: "This is a test note",
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property("_id");
    expect(res.body.title).to.equal("Test Note");

    noteId = res.body._id; 
  });

  // Create note without title/content
  it("should fail to create note if fields are missing", async function () {
    const res = await chai
      .request(app)
      .post("/api/notes")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "" });

    expect(res).to.have.status(400);
    expect(res.body.message).to.equal("All fields are required");
  });

  //  Create note without token
  it("should fail to create note without token", async function () {
    const res = await chai
      .request(app)
      .post("/api/notes")
      .send({
        title: "No Auth",
        content: "Should fail",
      });

    expect(res).to.have.status(401);
  });

  // ================== GET NOTES TESTS ==================

  //  Get all notes of logged-in user
  it("should get all notes for logged-in user", async function () {
    const res = await chai
      .request(app)
      .get("/api/notes")
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an("array");
    expect(res.body.length).to.be.greaterThan(0);
  });

  //  Get notes without token
  it("should fail to get notes without token", async function () {
    const res = await chai
      .request(app)
      .get("/api/notes");

    expect(res).to.have.status(401);
  });

  // ================== UPDATE NOTE TESTS ==================

  //  Update note successfully
  it("should update an existing note", async function () {
    const res = await chai
      .request(app)
      .put(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title",
        content: "Updated Content",
      });

    expect(res).to.have.status(200);
    expect(res.body.title).to.equal("Updated Title");
  });
  

  // ================== DELETE NOTE TESTS ==================

  //  Delete note successfully
  it("should delete a note", async function () {
    const res = await chai
      .request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body.message).to.equal("Note deleted successfully");
  });

  //  Delete already deleted note
  it("should fail to delete note if not found", async function () {
    const res = await chai
      .request(app)
      .delete(`/api/notes/${noteId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res).to.have.status(404);
  });

});
