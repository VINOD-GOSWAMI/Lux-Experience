import { test, expect } from "@playwright/test";
import { AppUrls, linkType } from "../config/app-url";
import {validateConsoleErrorsForUrls,getLinks,captureConsoleErrors} from "../utils/linkHelper";

const pages = Object.entries(AppUrls).map(([name, url]) => ({ name, url }));
const linkTypes: linkType[] = ["internal", "external", "all"];

test.describe("Console Errors ", () => {
  
  for (const { name, url } of pages) {
    test(`Key Pages - No console errors on ${name} page`, async ({ page }) => {
      const errors = await captureConsoleErrors(page);
      await page.goto(url, { waitUntil: "domcontentloaded" });
      expect(errors,`${url} has console errors:\n${errors.join("\n")}`).toHaveLength(0);
    });
  }

  for (const type of linkTypes) {
    test(`Crawling Links - Validate that ${type} links generate no console errors`, async ({page,context}) => {
      await page.goto(AppUrls.Home, { waitUntil: "domcontentloaded" });
      const links = await getLinks(page, type);
      test.skip(links.length === 0, `No ${type} links found.`);
      await validateConsoleErrorsForUrls(context, links, type);
    });
  }
});
