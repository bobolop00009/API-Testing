const request = require("supertest");
const { expect } = require("chai");

const baseUrl = "https://kasir-api.belajarqa.com";
let bearerToken;
let body;

describe("User - Delete User", () => {

    before(async () => {
        const responseAuthLogin = await request(baseUrl)
        .post("/authentications")
        .send({ email: "sampoerna@gmail.com", password: "123456"})

        bearerToken = (responseAuthLogin.body.data.accessToken);
    })

    describe("Positive Case - Delete using valid user ID", () => {

        before(async () => {
            const responseGetUserList = await request(baseUrl)
            .get("/users")
            .set("Authorization", `Bearer ${bearerToken}`)
            //.query({q: "toko"})

            body = responseGetUserList.body;
            let randomArrUser = Math.floor(Math.random()*body.data.users.length);
            userID = body.data.users[randomArrUser].id;
        })

        before(async () => {
            const responseDeleteUser = await request(baseUrl)
            .delete(`/users/${userID}`)
            .set("Authorization", `Bearer ${bearerToken}`)

            statusCode = responseDeleteUser.status;
            body = responseDeleteUser.body;
        })

        it("Response status is 200", () => {
            expect(statusCode).to.equal(200);
        });

        it("Response body status is Success", () => {
            expect(body.status).to.equal("success");
        });

        it("Response message is success", () => {
            expect(body.message).to.equal("User berhasil dihapus");
        });

        it("Users with this userID is deleted from list", async () => {
            const responseGetUserDetail = await request(baseUrl)
            .get(`/users/${userID}`)
            .set("Content-Type", "application/json")
            .set("Authorization", `Bearer ${bearerToken}`)

            body = responseGetUserDetail.body;
            expect(body.message).to.equal("User tidak ditemukan");
        });
    })

    describe("Negative Case - Delete using invalid user ID", () => {

        before(async () => {
            const responseDeleteUser = await request(baseUrl)
            .delete("/users/1")
            .set("Authorization", `Bearer ${bearerToken}`)

            statusCode = responseDeleteUser.status;
            body = responseDeleteUser.body;
        })

        it("Response status is 404", () => {
            expect(statusCode).to.equal(404);
        });

        it("Response body status is Fail", () => {
            expect(body.status).to.equal("fail");
        });

        it("Response message is fail", () => {
            expect(body.message).to.equal("id tidak valid");
        });
    });
});