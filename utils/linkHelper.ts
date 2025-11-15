import { expect, BrowserContext, Page } from "@playwright/test";
import { TestConfig } from "../config/test-config";

export type LinkFilter = "internal" | "external" | "all";

export async function getLinks(page: Page, filter: LinkFilter) {
  const links = await page.$$eval("a[href]", as =>
    [...new Set(as.map(a => (a as HTMLAnchorElement).href))]
  );

  switch (filter) {
    case "internal":
      return links.filter(l => l.startsWith(TestConfig.BASE_URL));
    case "external":
      return links.filter(l => !l.startsWith(TestConfig.BASE_URL));
    default:
      return links;
  }
}

export async function captureConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  return errors;
}

export async function validateConsoleErrorsForUrls(
  context: BrowserContext,
  urls: string[],
  type: LinkFilter
) {
  const result: Record<string, string[]> = {};

  await Promise.all(
    urls.map(async url => {
      const page = await context.newPage();
      const errors = await captureConsoleErrors(page);

      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
      } catch (e) {
        errors.push(`Failed to load: ${e}`);
      }

      if (errors.length > 0) result[url] = errors;
      await page.close();
    })
  );

  // Logging
  if (Object.keys(result).length > 0) {
    console.error(`❌ Console errors on ${type} links:`, result);
  } else {
    console.log(`✔ No console errors on ${type} links`);
  }

  expect(Object.keys(result), `${type} links have console errors`).toHaveLength(0);
}
