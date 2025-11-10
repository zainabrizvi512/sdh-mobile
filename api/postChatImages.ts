// api/postChatImages.ts
import axios, { AxiosRequestConfig } from "axios";
import { envConfig } from "../config/envConfig";

export type ChatImageAsset = {
    uri: string;
    type?: string;      // e.g. "image/jpeg", "image/png"
    name?: string;     // optional filename
    width?: number;    // optional, used for attachmentsMeta
    height?: number;   // optional, used for attachmentsMeta
};

/**
 * Upload one or more images to a group chat via REST.
 * Backend will broadcast 'new_message' on success.
 *
 * @param assets  One or more image files (uri/type/name/width/height)
 * @param token   Bearer token
 * @param groupId Target group id
 * @param caption Optional text caption (goes in `text`)
 */
export const postChatImages = async (
    assets: ChatImageAsset[],
    token: string,
    groupId: string,
    caption?: string
) => {
    if (!assets?.length) throw new Error("No images provided");

    const url = `${envConfig.EXPO_PUBLIC_BASE_URL}/groups/rest/${groupId}/messages`;

    const formData = new FormData();

    // The controller accepts either "files" or "images"; we’ll use "images"
    for (let i = 0; i < assets.length; i++) {
        const a = assets[i];
        formData.append("images", {
            uri: a.uri,
            type: a.type || "image/jpeg",
            name:
                a.name ||
                `photo-${Date.now()}-${i}.${(a.type?.split("/")?.[1] ?? "jpg")}`,
        } as any);
    }

    // type must match what your backend expects (it worked with "audio" lowercase, so we use "image")
    formData.append("type", "image");

    // optional caption
    if (caption && caption.trim().length) {
        formData.append("text", caption.trim());
    }

    // optional per-file metadata (width/height), backend reads JSON at `attachmentsMeta`
    const meta = assets.map((a) => ({
        width: typeof a.width === "number" ? a.width : undefined,
        height: typeof a.height === "number" ? a.height : undefined,
    }));
    formData.append("attachmentsMeta", JSON.stringify(meta));

    const config: AxiosRequestConfig = {
        method: "POST",
        url,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        data: formData,
        maxBodyLength: Infinity,
    };

    try {
        const res = await axios(config);
        return res;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.log(
                "postChatImages error",
                error.response?.data || error.message
            );
        } else {
            console.log("postChatImages unexpected error", error);
        }
        throw error;
    }
};

/**
 * Convenience helper for a single image.
 */
export const postChatImage = async (
    asset: ChatImageAsset,
    token: string,
    groupId: string,
    caption?: string
) => postChatImages([asset], token, groupId, caption);
