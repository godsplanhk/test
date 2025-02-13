import { launch } from "puppeteer";
import { Launcher } from "chrome-launcher";
import { platform as _platform, homedir } from "os";
import { join } from "path";

const detectChromePath = () => {
    const chromePath = Launcher.getFirstInstallation();
    if (!chromePath) throw new Error("Chrome not found! Install Chrome and try again.");
    return chromePath;
};

const detectUserDataDir = () => {
    const platform = _platform();
    if (platform === "win32") {
        return join(process.env.LOCALAPPDATA, "Google/Chrome/User Data/Default");
    } else if (platform === "darwin") {
        return join(homedir(), "Library/Application Support/Google/Chrome/Default");
    } else if (platform === "linux") {
        return join(homedir(), ".config/google-chrome/Default");
    }
    throw new Error("Unsupported OS");
};

const extractCookies = async (url) => {
    try {
        const browser = await launch({
            headless: false,
            executablePath: detectChromePath(),
            userDataDir: detectUserDataDir(),
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });
        
        let isLoggedIn = await page.evaluate(() => document.cookie.includes("ds_user_id") || document.cookie.includes("c_user"));

        if (!isLoggedIn) {
            console.log(`Not logged into ${url}. Please log in.`);
            await page.waitForFunction(() => document.cookie.includes("ds_user_id") || document.cookie.includes("c_user"), { timeout: 0 });
        }

        const cookies = await page.cookies();
        await browser.close();
        return JSON.stringify(cookies, null, 2);
    } catch (error) {
        console.error("Error extracting cookies:", error);
        return undefined;
    }
};

(async () => {
    const instagramCookies = await extractCookies("https://www.instagram.com/");
    console.log(JSON.stringify(instagramCookies));
})();

