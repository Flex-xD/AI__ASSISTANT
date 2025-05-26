import express from "express"
import { connectdb } from "./db";
import dotenv from "dotenv";
import processingRoutes from "./routes/processingRoutes";
import  uploadingRoutes from "./routes/uploadingRoutes";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/llmProcessing" , processingRoutes);
app.use("/api/uploading" , uploadingRoutes);

app.listen(PORT , () => {
    connectdb();
    console.log(`Server is running on port : ${PORT}`);
});