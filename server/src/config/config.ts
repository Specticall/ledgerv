import { S3Client } from "@aws-sdk/client-s3";
import { PrismaClient } from "@prisma/client";
import { MINIO_PORT, MINIO_ROOT_PASSWORD, MINIO_ROOT_USER } from "./env";

/**
 * Prisma client instance
 */
export const prisma = new PrismaClient();
export const BUCKET_NAME = "storage-bucket";
export const GOOGLE_AUTH_API_URL =
  "https://www.googleapis.com/oauth2/v3/userinfo";
export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 3600;
export const ONE_HOUR = 3600;
export const storage = new S3Client({
  region: "us-east-1",
  endpoint: `http://localhost:${MINIO_PORT}`,
  credentials: {
    accessKeyId: MINIO_ROOT_USER,
    secretAccessKey: MINIO_ROOT_PASSWORD,
  },
  forcePathStyle: true,
});
