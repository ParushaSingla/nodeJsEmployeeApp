const expect = require("chai").expect;
let chai = require("chai");
let chaiHttp = require("chai-http");
const opening = require("../models/opening");
var app = require("../app");
var request = require("supertest");
chai.use(chaiHttp);
//let the user be 
const user = {
  username: "parusha",
  password: "parusha",
};
//1. sign in ) now let's login the user before we run any tests
var authenticatedUser = request.agent(app);
before(function (done) {
  authenticatedUser
    .post("/auth/api/signIn")
    .send(user)
    .end(function (err, response) {
      expect(response.statusCode).to.equal(302);
      expect("Location", "/api/auth/listOfOpening");
      done();
    });
});
describe("check all the apis", function (done) {
  //2. GET list of opening
  it("GET list of opening", function (done) {
    authenticatedUser.get("/api/auth/listOfOpening").expect(200, done);
  });
  //3. Detail unauthorized user forbiddden
  it("unauthorized user are forbidden", function (done) {
    request(app).get("/api/auth/detailOpening/851c").expect(403, done);
  });
  //4. CREATE opening returns validation error
  it("should return a 412 if any field is missing while creation", function (done) {
    openData = {
      projectName: "samsung",
      clientName: "samsung",
      role: "senior",
      jobDescription: "back end dev",
      status: "open",
    };
    authenticatedUser
      .post("/api/auth/createOpening")
      .send(openData)
      .expect(412, done);
  });
  //5. UPDATE opening can have status value either open or closed
  it("should return a 412 if the status code is not open or closed", function (done) {
    openData = {
      projectName: "samsung",
      clientName: "samsung",
      technologies: "java",
      role: "senior",
      jobDescription: "back end dev",
      status: "wrongstatus",
    };
    authenticatedUser
      .post("/api/auth/createOpening")
      .send(openData)
      .expect(412, done);
  });
  //6.APPLY Manager cannot apply for an opening
  it("apply for opening", function (done) {
    authenticatedUser.get("/api/auth/apply/36w8").expect(403, done);
  });
});
//7.REGISTER create new user and redirect to login page
describe("/registeration", () => {
  var user = { username: "parusha1", password: "parusha1", roles: ["manager"] };
  it("it should register new user", (done) => {
    chai
      .request(app)
      .post("/auth/api/signUp")
      .send(user)
      .end((err, res) => {
        expect("Location", "/login");
        done();
      });
  });
});
