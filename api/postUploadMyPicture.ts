// api/postUploadPfp.ts
import { envConfig } from "@/config/envConfig";
import axios, { AxiosRequestConfig } from "axios";

export type UploadPfpResponse = { imageUrl: string };

const guessMimeFromName = (name?: string) => {
  const ext = (name || "").toLowerCase();
  if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) return "image/jpeg";
  if (ext.endsWith(".png")) return "image/png";
  if (ext.endsWith(".webp")) return "image/webp";
  if (ext.endsWith(".gif")) return "image/gif";
  if (ext.endsWith(".heic")) return "image/heic";
  if (ext.endsWith(".heif")) return "image/heif";
  if (ext.endsWith(".avif")) return "image/avif";
  if (ext.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
};

const fileNameFromUri = (uri: string) => {
  try {
    const base = uri.split("?")[0];
    const name = base.substring(base.lastIndexOf("/") + 1) || "pfp.jpg";
    return name.includes(".") ? name : `${name}.jpg`;
  } catch {
    return "pfp.jpg";
  }
};

export const postUploadMyPicture = async (
  token: string,
  localUri: string
): Promise<UploadPfpResponse> => {
  const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/users/me/picture`;

  const name = fileNameFromUri(localUri);
  const type = guessMimeFromName(name);

  // iOS returns file://; Android may return content:// or file:// — RN FormData supports { uri, type, name }
  const data = new FormData();
  // @ts-expect-error RN FormData file type
  data.append("file", { uri: localUri, name, type });

  const config: AxiosRequestConfig = {
    method: "POST",
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      // Let RN set boundaries automatically:
      "Content-Type": "multipart/form-data",
    },
    data,
  };

  const res = await axios<UploadPfpResponse>(config);
  return res.data;
};
