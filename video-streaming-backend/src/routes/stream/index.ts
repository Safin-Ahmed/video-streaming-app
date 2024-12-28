import express from "express";
import {
  streamBySegmentController,
  getUploadedVideos,
} from "../../controllers/stream";
import authenticate from "../../middleware/authenticate";

const router = express.Router();

router.get(
  "/stream/:fileName/:segment",
  authenticate,
  streamBySegmentController
);

router.get("/stream/videos", getUploadedVideos);

export default router;
