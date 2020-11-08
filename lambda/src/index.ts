import * as chrome from 'chrome-aws-lambda';
import { Browser } from 'puppeteer-core';

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
};

const respond = (statusCode: number, body: any) => ({
    statusCode,
    headers: {
        "Content-Type": "application/json",
        ...CORS_HEADERS,
    },
    body: JSON.stringify(body),
});

const toPdf = async (html: string, browser: Browser) => {
    const page = await browser.newPage();
    await page.setContent(html);

    const pdf = await page.pdf({
        preferCSSPageSize: true,
    });

    await browser.close();

    return pdf.toString('base64');
};

export const handler = async (event: any, context: any) => {
    try {
        // Create puppeteer browser
        const browser: Browser = await chrome.puppeteer.launch({
            args: chrome.args,
            defaultViewport: chrome.defaultViewport,
            executablePath: await chrome.executablePath,
            headless: chrome.headless,
            ignoreHTTPSErrors: true,
        });

        // Convert given html string to a base64 encoded pdf string
        const html = event.body;
        const pdf = await toPdf(html, browser);

        return respond(200, { pdf });
    } catch (e) {
        return respond(400, {
            message: e.errorMessage || e.message || e.toString()
        });
    }
};
