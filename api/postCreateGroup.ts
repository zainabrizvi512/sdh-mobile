// api/groups.ts
export type CreateGroupPayload = {
    name: string;
    type: 'family' | 'friends' | 'team' | 'other';
    // optional: if you already have selected members’ auth0/user IDs
    memberIds?: string[];
    // optional image file
    image?: { uri: string; name?: string; type?: string };
};

export async function createGroup({
    name,
    type,
    memberIds,
    image,
}: CreateGroupPayload, token: string): Promise<any> {
    const form = new FormData();

    form.append('name', name);
    form.append('type', type);

    if (memberIds?.length) {
        // backend accepts JSON string or comma-separated; we’ll send JSON
        form.append('memberIds', JSON.stringify(memberIds));
    }

    if (image?.uri) {
        const filename = image.name ?? image.uri.split('/').pop() ?? `group_${Date.now()}.jpg`;
        const mime = image.type ?? (filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

        // FormData in React Native accepts an object with uri/name/type; cast to any to satisfy TypeScript.
        form.append('picture', {
            uri: image.uri,
            name: filename,
            type: mime,
        } as any);
    }

    // if you use a client with an interceptor that injects Authorization, just use it;
    // here’s a plain fetch example:
    const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
            // do NOT set Content-Type; RN will set correct multipart boundary for FormData
            Authorization: `Bearer ${token}`,
        } as any,
        body: form,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to create group (${res.status})`);
    }

    return res.json();
}
