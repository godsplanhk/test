import { Request, Response } from "express";
import puppeteer from "puppeteer";
import { platform as _platform, homedir } from "os";
import { join } from "path";

const detectChromePath = async(): Promise<string> => {
    const {Launcher} = await import("chrome-launcher")
    const chromePath = Launcher.getFirstInstallation();
    if (!chromePath) throw new Error("Chrome not found! Install Chrome and try again.");
    return chromePath;
};

const detectUserDataDir = (): string => {
    const platform = _platform();
    if (platform === "win32") {
        return join(process.env.LOCALAPPDATA || "", "Google/Chrome/User Data/Default");
    } else if (platform === "darwin") {
        return join(homedir(), "Library/Application Support/Google/Chrome/Default");
    } else if (platform === "linux") {
        return join(homedir(), ".config/google-chrome/Default");
    }
    throw new Error("Unsupported OS");
};

export const extractCookiesController = async (req: Request, res: Response): Promise<void> => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
        res.status(400).json({ error: "URL parameter is required and must be a string" });
        return;
    }
    const dir = await detectChromePath()
    try {
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: dir,
            userDataDir: detectUserDataDir(),
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "networkidle2" });

        const cookies = await page.cookies();
        await browser.close();

        res.json({ cookies });
    } catch (error) {
        console.error("Error extracting cookies:", error);
        res.status(500).json({ error: "Failed to extract cookies" });
    }
};
