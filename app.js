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
const saltRounds = 10;

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
    const dataRegister = req.body;

    try {
        const findUser = await UserModel.findOne({ email: dataRegister["email"] })

        if (findUser) {
            res.status(400).json({ message: "User already exists" });
            return;            
        } else {
            let passwordHashed = await bcrypt.hash(dataRegister["password"], saltRounds);
            const user = new UserModel({
                "email": dataRegister["email"],
                "password": passwordHashed,
                "username": dataRegister["username"],
                "age": parseInt(dataRegister["age"]),
            });
            await user.save();
            res.status(201).json({ message: "User registered succesfully" });
        }
    } catch (error) {
        next(error);
    }
});

app.post("/login", async (req, res, next) => {
    const dataLogin = req.body;

    let email = dataLogin["email"];
    
    try {
        const userToLogin = await UserModel.findOne({ email: email });
        
        if (userToLogin) {
            let password = dataLogin["password"];
            let pswMatch = await bcrypt.compare(password, userToLogin["password"]);
            if (!pswMatch) {
                res.status(401).json({ message: "Please verify your credentials" });
                return
            } else {
                res.redirect("/dashboard");
            }
        } else {
            res.status(404).json({ message: "User not found, please register to login" });
            return;
        }
    } catch (error) {
        next(error);
    }
});


app.get("/dashboard", (req, res) => {
    res.json({ Message: "This is the DASHBOARD endpoint"});
});

app.post("/post", async (req, res, next) => {
    try {
        const data = req.body
        if (!data) {
            res.status(401).json({ message: "No text on this post. Please fill the form" });
            return;
        } else {
            const post = new PostModel({
                "userId": data["userId"],
                "text": data["text"],
            })
            await post.save();
            res.status(201).json({ message: "Post registered succesfully" });
        }
    } catch (error) {
        next(error);
    }
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