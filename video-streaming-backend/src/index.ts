import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import streamingRoute from "./routes/stream";
import uploadRoute from "./routes/upload";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 4000;

app.use(fileUpload());

app.use(cors());

// Middleware for file upload
app.use(uploadRoute);

// Streaming Endpoint
app.use(streamingRoute);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
