"use server";

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

type S3File = {
  key: string;
  lastModified: Date;
  size: number;
  url: string;
};

type S3Folder = {
  key: string;
};

type S3ListingResult = {
  files: S3File[];
  folders: S3Folder[];
  prefix: string;
};

/**
 * Server action to list files in an S3 bucket folder
 * @param folderPath - The folder path in the S3 bucket
 */
export async function listS3FolderContents(
  folderPath: string = ""
): Promise<S3ListingResult> {
  // Initialize the S3 client
  const s3Client = new S3Client({
    region: process.env.S3_REGION!,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_ACCESS_SECRET!,
    },
  });

  // Ensure folder path ends with a slash if not empty
  const normalizedPath = folderPath
    ? folderPath.endsWith("/")
      ? folderPath
      : `${folderPath}/`
    : "";

  try {
    // Configure the parameters for listing objects
    const params = {
      Bucket: process.env.S3_BUCKET_NAME || "",
      Prefix: normalizedPath,
      Delimiter: "/", // Use delimiter to get folders as CommonPrefixes
    };

    // Send the ListObjectsV2 command
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);

    // CloudFront domain for generating URLs
    const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;

    // Extract file information
    const files =
      data.Contents?.map((item) => ({
        key: item.Key || "",
        lastModified: item.LastModified || new Date(),
        size: item.Size || 0,
        url: cloudfrontDomain
          ? `https://${cloudfrontDomain}/${item.Key}`
          : `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
      })) || [];

    // Filter out the current directory entry which is often included
    const filteredFiles = files.filter((file) => file.key !== normalizedPath);

    // Extract subfolder information
    const folders =
      data.CommonPrefixes?.map((prefix) => ({
        key: prefix.Prefix || "",
      })) || [];

    // Return the combined results
    return {
      files: filteredFiles,
      folders,
      prefix: normalizedPath,
    };
  } catch (error) {
    console.error("Error listing S3 objects:", error);
    throw new Error("Failed to list S3 folder contents");
  }
}
