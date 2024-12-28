import { Request, Response } from "express";

import uploadService from "../../service/upload";

const uploadController = async (req: Request, res: Response) => {
  console.log({ files: req });
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded");
    }
    const result = await uploadService(req);

    if (result) {
      return res.status(200).send("File uploaded and processed successfully");
    } else {
      return res.status(500).send("Something went wrong");
    }
  } catch (err) {
    console.error("Error while uploading the file: ", err);
  }
};

export default uploadController;
