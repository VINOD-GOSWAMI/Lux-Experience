import { test, expect } from "@playwright/test";

test("Validate that all page links return 2xx or 3xx status codes", async ({ page, request }) => {
  await page.goto("");
  const links = await page.$$eval("a[href]", as =>[...new Set(as.map(a => (a as HTMLAnchorElement).href))]);
  console.log(`Total unique links: ${links.length}`);

  for (const link of links) {
    const status = (await request.get(link)).status();
    console.log(` ${link} : ${status}`);
    expect.soft(status, `Broken link: ${link} returned ${status}`).toBeGreaterThanOrEqual(200);
    expect.soft(status).toBeLessThan(400);
  }
});
