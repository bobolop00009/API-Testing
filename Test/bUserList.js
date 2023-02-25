const request = require("supertest");
const { expect } = require("chai");

const baseUrl = "https://kasir-api.belajarqa.com";
let bearerToken;
let body;

describe("User - Get User List", () => {

    before(async () => {
        const responseAuthLogin = await request(baseUrl)
        .post("/authentications")
        .send({ email: "sampoerna@gmail.com", password: "123456"})

        bearerToken = (responseAuthLogin.body.data.accessToken);
    })

    describe("Positive Case - Query Param q included in data users name", () => {

        before(async () => {
            const responseGetUserList = await request(baseUrl)
            .get("/users")
            .set("Authorization", `Bearer ${bearerToken}`)
            .query({q: "name"})

            body = responseGetUserList.body;
        })

        it('Data users is not empty', () => {
            expect(body.data.users.length).to.not.equal(0);
        });

        it('Data meta total is not 0  ', () => {
            expect(body.data.meta.total).to.not.equal(0);
        });
    })

    describe("Negative Case - Query Param q not included in data users name", () => {

        before(async () => {
            const responseGetUserList = await request(baseUrl)
            .get("/users")
            .set("Authorization", `Bearer ${bearerToken}`)
            .query({q: "qwe"})

            body = responseGetUserList.body;
        })

        it('Data users is empty', () => {
            expect(body.data.users.length).to.equal(0);
        });

        it('Data meta total is 0  ', () => {
            expect(body.data.meta.total).to.equal(0);
        });
    });
});