import { GetObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, ONE_HOUR, storage } from "../../config/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Returns a presigned URL that lets image be downloaded
const getPresignedDownloadURL = async (fileKey: string) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
  });

  const url = await getSignedUrl(storage, command, { expiresIn: ONE_HOUR });
  return url;
};

export default getPresignedDownloadURL;
