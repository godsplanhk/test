export function extractTiktokUsername(url:string) {
    const match = url.match(/tiktok\.com\/@([a-zA-Z0-9_.-]+)/);
    return match ? match[1] : null;
}

