import express from "express"
import { connectdb } from "./db";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT , () => {
    connectdb();
    console.log(`Server is running on port : ${PORT}`);
})