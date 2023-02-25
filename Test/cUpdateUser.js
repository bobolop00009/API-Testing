const request = require("supertest");
const { expect } = require("chai");

const baseUrl = "https://kasir-api.belajarqa.com";
let bearerToken;
let statusCode;
let body;
let userID;

describe("User - Update User", () => {

    before(async () => {
        const responseAuthLogin = await request(baseUrl)
        .post("/authentications")
        .send({ email: "sampoerna@gmail.com", password: "123456"})

        bearerToken = (responseAuthLogin.body.data.accessToken);
    })

    describe("Positive Case - Update using valid user ID", () => {

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
            const responseUpdateUser = await request(baseUrl)
            .put(`/users/${userID}`)
            .set("Authorization", `Bearer ${bearerToken}`)
            .send({
                "name": `Update name ${userID}`,
                "email": `user${userID}@update.com`,
            })

            statusCode = responseUpdateUser.status;
            body = responseUpdateUser.body;
        })

        it("Response status is 200", () => {
            expect(statusCode).to.equal(200);
        });

        it("Response body status is Success", () => {
            expect(body.status).to.equal("success");
        });

        it("Response message is success", () => {
            expect(body.message).to.equal("User berhasil diupdate");
        });

        it("Users name is contains \"Update name\"", () => {
            expect(body.data.name).to.include("Update name");
        });
    })

    describe("Negative Case - Update using invalid user ID", () => {

        before(async () => {
            const responseUpdateUser = await request(baseUrl)
            .put("/users/1")
            .set("Authorization", `Bearer ${bearerToken}`)
            .send({
                "name": "Update name",
                "email": "user@update.com",
            })

            statusCode = responseUpdateUser.status;
            body = responseUpdateUser.body;
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