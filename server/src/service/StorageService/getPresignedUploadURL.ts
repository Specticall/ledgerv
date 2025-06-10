import { PutObjectCommand } from "@aws-sdk/client-s3";
import { sha256 } from "../../utils/general";
import { BUCKET_NAME, ONE_HOUR, storage } from "../../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";

// Returns a presigned URL that lets image be uploaded
const getPresignedUploadURL = async (filename: string, userId: number) => {
  // The key value will be a {userid}/{hashedfilename}
  const { name, ext } = path.parse(filename);
  const hashedFilename = sha256(name);
  const fileKey = `${userId}/${hashedFilename}${ext || ""}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: "application/octet-stream",
  });

  const url = await getSignedUrl(storage, command, { expiresIn: ONE_HOUR });
  return { url, fileKey };
};

export default getPresignedUploadURL;
