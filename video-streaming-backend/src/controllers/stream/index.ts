import { Request, Response } from "express";
import path from "path";

const streamBySegmentController = (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const segment = req.params.segment;
  const filePath = path.join(
    __dirname,
    "..",
    "..",
    "..",
    "uploads",
    fileName,
    segment
  );
  res.sendFile(filePath);
};

export default streamBySegmentController;
