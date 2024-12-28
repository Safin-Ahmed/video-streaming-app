import express from "express";
import uploadController from "../../controllers/upload";
import authenticate from "../../middleware/authenticate";

const router = express.Router();
router.post("/upload", authenticate, uploadController);

export default router;
