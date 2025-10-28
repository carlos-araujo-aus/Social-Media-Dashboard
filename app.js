//All the imports
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel, PostModel } from "./model/schemas.js";

//Config of the projecyt
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const sessionSecret = process.env.SESSION_SECRET
const saltRounds = 10;

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Connect to the DB
const mongoDB = () => {mongoose.connect(uri, { dbName: 'socialUsersDB' })
    .then(() => {
        console.log("✅Connected to MongoDB✅");
    })
    .catch((err) => {
        console.error("❌Error connecting to MongoDB❌", err);
        mongoose.connection.close();
        console.log("⛔Conection Closed⛔");
    });
}
mongoDB()

//Middelware to handle session
app.use(session({
    cookie: { maxAge: 120000 },
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));

//Function to handle authorization
const requireAuth = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized. Please login first" })
    }
}


app.get("/home", (req, res) => {
    res.json({ Message: "🎉this is the home endpoint🎉" })
});

//Register a new user
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

//Login
app.post("/login", async (req, res, next) => {
    const dataLogin = req.body;

    let email = dataLogin["email"];
    
    try {
        const userToLogin = await UserModel.findOne({ email: email });
        console.log("1: ", userToLogin)
        if (userToLogin) {
            let password = dataLogin["password"];
            console.log("2: ", password)
            let pswMatch = await bcrypt.compare(password, userToLogin["password"]);
            console.log("3: ", pswMatch)
            if (!pswMatch) {
                res.status(401).json({ message: "Please verify your credentials" });
                return
            } else {
                req.session.username = userToLogin.username;
                req.session.userId = userToLogin._id;
                res.status(200).json({ 
                    message: "Loggin successful",
                    redirectTo: "/dashboard"
                 })
            }
        } else {
            res.status(404).json({ message: "User not found, please register to login" });
            return;
        }
    } catch (error) {
        next(error);
    }
});

//Get all users
app.get("/users", requireAuth, async (req, res, next) => {
    try {
        const allUsers = await UserModel.find()
        if (allUsers.length === 0) {
            res.status(200).json({ message: "There are no users registered yet"})
            return;
        } else {
            const usernames = allUsers.map(user => user.username);

            res.status(200).json({
                Quantity: allUsers.length,
                Usernames: usernames
            })
        }
    } catch (error) {
        next(error)
    }
})

//Post a post
app.post("/post", requireAuth, async (req, res, next) => {
    try {
        const data = req.body
        if (!data) {
            res.status(401).json({ message: "No text on this post. Please fill the form" });
            return;
        } else {
            const post = new PostModel({
                "userId": req.session.userId,
                "text": data["text"],
            })
            await post.save();
            res.status(201).json({ message: "Post registered succesfully" });
        }
    } catch (error) {
        next(error)
    };
});

//Get all posts
app.get("/dashboard", requireAuth,async (req, res, next) => {
    try {
        const allPosts = await PostModel.find()
        if (allPosts.length === 0){
            res.status(200).json({ message: "There are no posts yet" })
        } else{
            res.status(200).json(allPosts)
        }       
    } catch (error) {
        next(error)
    } 
});

//Get posts by username
app.get("/dashboard/:username", requireAuth, async (req, res, next) => {
    try {
        const username = req.params.username;
        const usernameFind = await UserModel.findOne({username: username});
        if (!usernameFind) {
            res.status(404).json({ message: `There is no user with that username: ${username}` });
            return;
        } else {
            const userId = usernameFind._id;
            const postsOfUser = await PostModel.find({userId: userId});
            res.status(200).json({
                username: username,
                posts: postsOfUser,
                message: postsOfUser.length === 0 ? `The user ${username} does not have any post yet` : undefined,
            });            
        }
    } catch (error) {
        next(error);
    }
});

//Get My posts
app.get("/my-posts", requireAuth, async (req, res, next) => {
    try {
        const userIdnow = req.session.userId
        const myPosts = await PostModel.find({userId: userIdnow});
        console.log(myPosts)
        if (myPosts.length === 0) {
            res.status(404).json({ message: "You do not have posts yet" })
            return;
        }
        const allMyPosts = myPosts.map(posts => posts.text);
        res.status(200).json({ message:"This are your posts: ", text: allMyPosts })
    } catch (error) {
        next(error)
    }
})

//Update post
app.put("/updatepost/:postid", requireAuth, async (req, res, next) => {
    try {
        const postId = req.params.postid
        const newText = req.body.newText

        if (!newText || newText.trim().length === 0) {
            res.status(400).json({ message: "Enter the new text of the post" })
            return;
        }

        const postFinded = await PostModel.findOne({_id:postId, userId: req.session.userId})

        if (!postFinded) {
            res.status(404).json({ message: "Post not found or unauthorized" });
            return;
        }
        
        const update = await PostModel.updateOne({_id:postId},{text: newText.trim()})   

        if (update.matchedCount === 0) {
            res.status(404).json({ message: "No post updated"});
            return;
        }
        
        res.status(200).json({ message: "Post updated" }); 
        
    } catch (error) {
        next(error);
    }
})

//Delete a post
app.delete("/deletepost/:postid", requireAuth, async (req, res, next) => {
    try {
        const postId = req.params.postid
        const postFinded = await PostModel.findOne({_id: postId, userId: req.session.userId})

        if (!postFinded) {
            res.status(404).json({ message: "Post not found or unauthorized" })
            return;
        }

        const postToDelete = await PostModel.deleteOne({_id:postId})

        if (postToDelete.deletedCount === 0) {
            res.status(404).json({ message: "There is no post with that postId" })
            return
        }
        res.status(200).json({ message: `The post was deleted: ${postToDelete.deletedCount}` })
    } catch (error) {
        next(error)
    }
})

//Get endpoint for the logout
app.get("/logout", requireAuth, (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(400).json({ message: "Error logging out", Error: err });
            return;
        }
        res.cookie("username", "", { expires: new Date(0) });
        res.status(200).json({ 
            message: "Logged out successful",
            redirectTo: "/home"
         });
    });
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

//Start to listen the port
app.listen(port, () => {
    console.log(`🚀Server running on http://localhost:${port}`)
});