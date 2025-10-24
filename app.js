import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel, PostModel } from "./model/schemas.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose.connect(uri, { dbName: 'socialUsersDB' })
    .then(() => {
        console.log("✅Connected to MongoDB✅");
    })
    .catch((err) => {
        console.error("❌Error connecting to MongoDB❌", err);
        mongoose.connection.close();
        console.log("⛔Conection Closed⛔");
    });

app.get("/home", (req, res) => {
    res.json({ Message: "🎉Server is runin from root endpoint🎉" })
});

app.post("/register", async (req, res, next) => {
    const data = req.body;

    let email = data["email"];

    try {
        const findUser = await UserModel.findOne({ email: email })

        if (findUser) {
            res.send("User already exist");
            return;            
        } else {
            const user = new UserModel({
                "email": data["email"],
                "password": data["password"],
                "username": data["username"],
                "age": parseInt(data["age"]),
            });
            await user.save();
            res.send("User registered succesfully")
        }
    } catch (error) {
        next(error);
    }
});

app.post("/login", (req, res) => {
    res.json({ Message: "This is the LOGIN endpoint"});
});

app.get("/dashboard", (req, res) => {
    res.json({ Message: "This is the DASHBOARD endpoint"});
});

//Block automatic request from browser
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use("/.well-known", (req, res) => res.status(204).end());

//Catch-all middleware for handling undefined routes/endpoints
app.use((req, res, next) => {
    const err = new Error(`Cannot find the URL ${req.originalUrl} in this app. Please check.`);
    err.status = "Endpoint Failure";
    err.statusCode = 404;
    next(err);
});

//Error handling middleware for express
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "Error";
    console.error(`❌ ${err.statusCode} - ${err.message} ❌`);
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    })
})

app.listen(port, () => {
    console.log(`🚀Server running on http://localhost:${port}`)
});