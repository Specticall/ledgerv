import crypto from "crypto";
import { MINIO_BASE_URL } from "../config/env";
import axios, { isAxiosError } from "axios";

export function sha256(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export async function checkMinIOHealth() {
  try {
    const response = await axios.get(`${MINIO_BASE_URL}/minio/health/ready`, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 200;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("MinIO health check failed:", error.message);
    }
    return false;
  }
}
