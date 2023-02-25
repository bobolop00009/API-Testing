const request = require("supertest");
const { expect } = require("chai");
const {describe} = require("mocha");

const data = require('../data/data.js')

const baseUrl = 'https://kasir-api.belajarqa.com'
const dataRegister = data.register

let bearerToken;
let statusCode;
let body;

describe("Create User & Authetications", () => {

    before(async () => {
        const responseAuthLogin = await request(baseUrl)
        .post("/authentications")
        .send({ email: "sampoerna@gmail.com", password: "123456"})

        bearerToken = (responseAuthLogin.body.data.accessToken);
    })

    describe("Positive Case - Use valid email", () => {

        before(async () => {
            const responseCreateUser = await request(baseUrl)
            .post("/users")
            .set("Authorization", `Bearer ${bearerToken}`)
            .send(dataRegister)

            statusCode = responseCreateUser.status;
            body = responseCreateUser.body;
        })

        it("Response status is 201", () => {
            expect(statusCode).to.equal(201);
        });

        it("Response body status is Success", () => {
            expect(body.status).to.equal("success");
        });

        it("Response message is success", () => {
            expect(body.message).to.equal("User berhasil ditambahkan");
        });
    })

    describe("Negative Case - Use invalid email", () => {

        before(async () => {
            const responseCreateUser = await request(baseUrl)
            .post("/users")
            .set("Authorization", `Bearer ${bearerToken}`)
            .send({
                "name": `sampirna`,
                "email": "simpirni.com",
                "password": "12346"
            })

            statusCode = responseCreateUser.status;
            body = responseCreateUser.body;
        })

        it("Response status is 400", () => {
            expect(statusCode).to.equal(400);
        });

        it("Response body status is Fail", () => {
            expect(body.status).to.equal("fail");
        });

        it("Response message is fail", () => {
            expect(body.message).to.equal("\"email\" must be a valid email");
        });
    });
});