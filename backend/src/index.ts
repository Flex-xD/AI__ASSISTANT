import express from "express"
import { connectdb } from "./db";
import dotenv from "dotenv";
import processingRoutes from "./routes/processingRoutes";
import  uploadingRoutes from "./routes/uploadingRoutes";
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/llmProcessing" , processingRoutes);
app.use("/api/uploading" , uploadingRoutes);

app.listen(PORT , () => {
    connectdb();
    console.log(`Server is running on port : ${PORT}`);
});