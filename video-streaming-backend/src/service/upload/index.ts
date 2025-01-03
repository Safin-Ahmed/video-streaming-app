import { Request } from "express";
import path from "path";
import fs from "fs/promises";
import execCommand from "../../utils/command";
import { replaceWhitespaceWithDash, sanitizeFilename } from "../../utils/text";
import { VideoQuality } from "../../interfaces/systemTypes";
import { S3wrapper } from "../../utils/S3wrapper";

const resolutions: VideoQuality[] = [
  { width: 640, height: 360, bitrate: "800k", label: "360p" },
  { width: 854, height: 480, bitrate: "1400K", label: "480p" },
  { width: 1280, height: 720, bitrate: "2800k", label: "720p" },
  { width: 1920, height: 1080, bitrate: "5000k", label: "1080p" },
];

const s3wrapper = new S3wrapper();
import { XMLParser, XMLBuilder } from "fast-xml-parser";

const injectBaseUrlToManifest = async (
  outputDir: string,
  fileName: string,
  baseURL: string
): Promise<void> => {
  try {
    const mpdFile = path.join(outputDir, `${fileName.split(".")[0]}.mpd`);
    const mpdContent = await fs.readFile(mpdFile, "utf-8");

    // Check if BaseURL already exists
    if (mpdContent.includes("<BaseURL>")) {
      console.log("BaseURL already exists in MPD file. Skipping injection.");
      return;
    }

    // Find the position of the opening <MPD> tag
    const mpdOpenTagIndex = mpdContent.indexOf("<MPD");
    if (mpdOpenTagIndex === -1) {
      throw new Error("Invalid MPD file: Missing <MPD> tag.");
    }

    // Find the closing `>` of the <MPD> tag (supports attributes in the <MPD> tag)
    const mpdCloseTagIndex = mpdContent.indexOf(">", mpdOpenTagIndex);
    if (mpdCloseTagIndex === -1) {
      throw new Error("Invalid MPD file: Malformed <MPD> tag.");
    }

    // Inject <BaseURL> right after the <MPD> opening tag
    const updatedContent =
      mpdContent.slice(0, mpdCloseTagIndex + 1) +
      `\n\t<BaseURL>${baseURL}</BaseURL>\n` +
      mpdContent.slice(mpdCloseTagIndex + 1);

    // Write back the updated content
    await fs.writeFile(mpdFile, updatedContent, "utf-8");
    console.log("BaseURL successfully injected.");
  } catch (error) {
    console.error("Error injecting BaseURL:", error);
    throw error;
  }
};

const processVideo = async (
  tempPath: string,
  outputDir: string,
  fileName: string
): Promise<boolean> => {
  try {
    const commands: string[] = resolutions.map((res) => {
      const output = `${outputDir}/${fileName.split(".")[0]}_${res.label}`;
      const command = `ffmpeg -i ${tempPath} -map 0:v -b:v ${res.bitrate} -s:v ${res.width}x${res.height} -c:v libx264 -map 0:a -c:a aac -b:a 128K -f dash ${output}.mpd`;

      return command;
    });

    for (const command of commands) {
      await execCommand(command);
    }

    // Generate a combined DASH manifest
    const command = `ffmpeg -f dash -i ${outputDir}/${
      fileName.split(".")[0]
    }_1080p.mpd -f dash -i ${outputDir}/${
      fileName.split(".")[0]
    }_720p.mpd -f dash -i ${outputDir}/${
      fileName.split(".")[0]
    }_480p.mpd -f dash -i ${outputDir}/${
      fileName.split(".")[0]
    }_360p.mpd -c copy -map 0 -map 1 -map 2 -map 3 -f dash ${outputDir}/${
      fileName.split(".")[0]
    }.mpd`;

    await execCommand(command);
    return true;
  } catch (error) {
    console.error("Error while processing the video", error);
    return false;
  }
};

const moveFilesToS3 = async (outputDir: string, folderName: string) => {
  const result = await s3wrapper.uploadDirectory(
    outputDir,
    "safin-video-streaming",
    folderName
  );

  return result;
};

const uploadService = async (req: Request): Promise<Boolean> => {
  try {
    if (!req.files || !req.files.video) throw new Error("Bad Request");
    const videoFile: any = req.files.video;
    const fileName = sanitizeFilename(
      replaceWhitespaceWithDash(videoFile.name)
    );
    const tempPath = path.join(__dirname, "..", "..", "..", "temp", fileName);
    const outputDir = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      fileName.split(".")[0]
    );

    let baseURL = `http://localhost:4000/stream/${fileName.split(".")[0]}/`;

    // Create directories if not exist
    await fs.mkdir(path.join(__dirname, "..", "..", "..", "temp"), {
      recursive: true,
    });

    await fs.mkdir(path.join(__dirname, "..", "..", "..", "uploads"), {
      recursive: true,
    });

    await fs.mkdir(outputDir, { recursive: true });

    // Move the uploaded file to temp directory
    await videoFile.mv(tempPath);

    // Process the video using FFmpeg
    await processVideo(tempPath, outputDir, fileName);
    await injectBaseUrlToManifest(outputDir, fileName, baseURL);
    await moveFilesToS3(outputDir, fileName.split(".")[0]);

    return true;
  } catch (err) {
    console.error("Error in uploadService: ", err);
    return false;
  }
};

export default uploadService;
