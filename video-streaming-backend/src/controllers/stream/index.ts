import { Request, Response } from "express";
import path from "path";
import { S3wrapper } from "../../utils/S3wrapper";

const s3wrapper = new S3wrapper();

export const streamBySegmentController = (req: Request, res: Response) => {
  const fileName = req.params.fileName;
  const segment = req.params.segment;
  try {
    // Generate a pre-signed URL for the requested segment
    const params = {
      Bucket: "safin-video-streaming",
      Key: `${fileName}/${segment}`, // Full S3 key for the video segment
      Expires: 60 * 5, // URL valid for 5 minutes
    };

    const signedUrl = s3wrapper.getSignedUrl(params);

    res.status(200).json({
      success: true,
      signedUrl,
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({
      success: false,
      message: "Unable to generate video segment URL",
      error: err,
    });
  }
};

export const getUploadedVideos = async (req: Request, res: Response) => {
  try {
    // List objects in the bucket
    const data = await s3wrapper.getFolders("safin-video-streaming");

    res.status(200).json({
      success: true,
      videos: data,
    });
  } catch (error) {
    console.error("Error retrieving videos from S3:", error);
    res.status(500).json({
      success: false,
      message: "Unable to retrieve video list",
    });
  }
};
