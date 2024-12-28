import AWS, { S3 } from "aws-sdk";
import dotenv from "dotenv";
import fs from "fs-extra";
import path from "path";

dotenv.config();

export class S3wrapper {
  protected _s3Client: S3;

  public constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    this._s3Client = new AWS.S3({
      region: process.env.BUCKET_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  public async uploadFile(filePath: string, bucketName: string, key: string) {
    const fileStream = fs.createReadStream(filePath);

    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileStream,
    };

    return this._s3Client.upload(uploadParams).promise();
  }

  public async uploadDirectory(
    dirPath: string,
    bucketName: string,
    folderName: string
  ): Promise<boolean> {
    const uploadPromises: Promise<AWS.S3.ManagedUpload.SendData>[] = [];

    const processDirectory = async (dirPath: string, currentFolder: string) => {
      const files = await fs.readdir(dirPath);

      for (const fileName of files) {
        const filePath = path.join(dirPath, fileName);
        const fileStat = await fs.stat(filePath);

        if (fileStat.isFile()) {
          const key = `${currentFolder}/${fileName}`;
          uploadPromises.push(this.uploadFile(filePath, bucketName, key));
        } else if (fileStat.isDirectory()) {
          await processDirectory(filePath, `${currentFolder}/${fileName}`);
        }
      }
    };

    await processDirectory(dirPath, folderName);

    try {
      await Promise.all(uploadPromises);
      return true;
    } catch (error) {
      console.error("Error uploading files: ", error);
      throw error;
    }
  }

  /**
   * Fetches a list of files from the specified bucket or folder within the bucket.
   * @param bucketName The name of the S3 bucket.
   * @param prefix The folder prefix (optional).
   * @returns A list of file objects with their name, size, and last modified date.
   */
  public async getFiles(
    bucketName: string,
    prefix: string = ""
  ): Promise<{ name: string; size: number; lastModified: Date }[]> {
    try {
      const data = await this._s3Client
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: prefix, // Specify the folder or root
        })
        .promise();

      if (!data.Contents) {
        return [];
      }

      // Map the S3 object metadata to a simplified structure
      return data.Contents.map((item) => ({
        name: item.Key || "", // Key (file path)
        size: item.Size || 0, // File size in bytes
        lastModified: item.LastModified || new Date(), // Last modified date
      }));
    } catch (error) {
      console.error("Error fetching files from S3: ", error);
      throw error;
    }
  }

  public async getFolders(
    bucketName: string,
    prefix: string = ""
  ): Promise<string[]> {
    try {
      const data = await this._s3Client
        .listObjectsV2({
          Bucket: bucketName,
          Prefix: prefix, // Optional: Specify folder prefix
          Delimiter: "/", // Ensures only top-level folders are returned
        })
        .promise();

      // Extract folder names from CommonPrefixes
      const folders =
        data.CommonPrefixes?.map(
          (item) => item.Prefix?.replace(prefix, "").replace("/", "") || ""
        ) || [];

      return folders;
    } catch (error) {
      console.error("Error fetching folders from S3: ", error);
      throw error;
    }
  }

  public getSignedUrl(params: any): string {
    return this._s3Client.getSignedUrl("getObject", params);
  }
}
