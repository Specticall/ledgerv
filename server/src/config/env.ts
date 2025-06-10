// Smoke test
if (!process.env.PORT) {
  throw new Error("Enviroment variables were not loaded properly");
}

export const PORT = process.env.PORT || "";
export const JWT_KEY = process.env.JWT_KEY || "";
export const MINIO_ROOT_USER = process.env.MINIO_ROOT_USER || "";
export const MINIO_ROOT_PASSWORD = process.env.MINIO_ROOT_PASSWORD || "";
export const MINIO_PORT = process.env.MINIO_PORT || "";
export const MINIO_UI_PORT = process.env.MINIO_UI_PORT || "";
export const MINIO_BASE_URL = process.env.MINIO_BASE_URL || "";
