import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, storage } from "../../config/config";

const deleteFile = async (fileKey: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  await storage.send(command);
};

export default deleteFile;
