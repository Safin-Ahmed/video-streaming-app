import express from "express";
import streamBySegmentController from "../../controllers/stream";
import authenticate from "../../middleware/authenticate";

const router = express.Router();

router.get(
  "/stream/:fileName/:segment",
  authenticate,
  streamBySegmentController
);

export default router;
