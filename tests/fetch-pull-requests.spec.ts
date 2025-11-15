import { test, expect } from "@playwright/test";
import { GitHubPullRequestsPage } from "../pages/git-pull-request-page";
import { CSVHelper } from "../utils/csv-helper";
import { PRRowData } from "../types/PullRequest";
import expectedPR from "../data/expected-pr.json";

import { FileHelper } from "../utils/file-helper";

test.describe("Pull Request CSV Export Validation Test Suite", () => {
  test("Validates CSV export for the first-page PR list", async ({ page }) => {
    const prPage = new GitHubPullRequestsPage(page);
    await page.goto("https://github.com/appwrite/appwrite/pulls");
    const rows: PRRowData[] = await prPage.prList.getAllPRData();
    console.log(`Total PRs: ${rows.length}`);
    const filePath = FileHelper.buildCSVPath("pull-requests");
    CSVHelper.export(filePath, rows);
    const csv = CSVHelper.read(filePath);
    expect(csv.rows.length).toBe(25);
    expect(csv.rows).toContainEqual(expectedPR);
    console.log("CSV validated:", filePath);
  });

  test("Exports complete PR list via pagination and validates CSV", async ({page}) => {
    await page.goto("https://github.com/appwrite/appwrite/pulls");
    const prPage = new GitHubPullRequestsPage(page);
    let allRows: PRRowData[] = [];
    while (true) {
      const rows = await prPage.prList.getAllPRData();
      allRows.push(...rows);
      const hasNextPage = await prPage.pagination.hasNextPage();
      if (!hasNextPage) break;
      await prPage.pagination.goToNextPage();
    }
    console.log(`Total PRs collected: ${allRows.length}`);
    const filePath = FileHelper.buildCSVPath("pull-requests");
    CSVHelper.export(filePath, allRows);
    const csv = CSVHelper.read(filePath);
    expect(csv.rows.length).toBe(allRows.length);
    expect(csv.rows).toContainEqual(expectedPR);
    console.log("CSV validated:", filePath);
  });
});
