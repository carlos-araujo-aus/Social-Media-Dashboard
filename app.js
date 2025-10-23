import express from 'express';
import jwt from J
import { jwt } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

const secretKey = process.env.SECRET_KEY;
const users = [];

function au