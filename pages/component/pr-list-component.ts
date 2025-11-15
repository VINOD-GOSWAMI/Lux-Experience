import { Locator, type Page } from "@playwright/test";
import { PRRowComponent } from "./pr-row-component";
import { PRRowData } from "../../types/PullRequest";
import { BaseComponent } from "./base-component";

export class PRListComponent extends BaseComponent{
  private readonly root: Locator;

  constructor(page: Page) {
    super(page);
    this.root = page.getByRole('group', { name: 'Issues' });
  }

  get rows() {
    return this.root.locator('.js-issue-row');
  }
  
  /** Return total PR rows found on the page */
  async count(): Promise<number> {
    return await this.rows.count();
  }

  /** Return PRRowComponent[] for all rows */
  async getRows(): Promise<PRRowComponent[]> {
    const rows: PRRowComponent[] = [];
    const total = await this.count();

    for (let i = 0; i < total; i++) {
      rows.push(new PRRowComponent(this.rows.nth(i)));
    }
    return rows;
  }

  /** Extract all PR data from current page */
  async getAllPRData(): Promise<PRRowData[]> {
    const rows = await this.getRows();
    const result: PRRowData[] = [];
    for (const row of rows) {
      result.push(await row.toJSON());
    }
    return result;
  }
}
