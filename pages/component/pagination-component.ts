import { Page } from "@playwright/test";
import { BaseComponent } from "./base-component";

export class PaginationComponent extends BaseComponent {
  readonly pagination;
  readonly nextLink;
  readonly currentPageLocator;

  constructor(page: Page) {
    super(page);
    this.pagination = page.getByRole("navigation", { name: "Pagination" });
    this.nextLink = this.pagination.getByLabel("Next page");
    this.currentPageLocator = this.pagination.locator('[aria-current="page"]');
  }

  async hasNextPage(): Promise<boolean> {
    try {
      return await this.nextLink.evaluate(
        (el) => !el.classList.contains("disabled")
      );
    } catch (error) {
      return false;
    }
  }

  /** Navigate to next page safely */
  async goToNextPage(): Promise<void> {
   await Promise.all([
      this.nextLink.click(),
      this.page.waitForSelector("turbo-progress-bar", { state: "hidden" }),
      this.page.waitForResponse((response) =>response.url().includes("pull_request_review_decisions") && response.status() === 200 && response.request().method() === "POST"),
      this.page.waitForLoadState("domcontentloaded"),
    ]);
  }

  /** Extract the current page number */
  async getCurrentPageNumber(): Promise<number> {
    const text = await this.currentPageLocator.innerText();
    return Number(text);
  }

  /** Extract the total number of pages */
  async getTotalPages(): Promise<number> {
    const total = await this.currentPageLocator.getAttribute(
      "data-total-pages"
    );
    return Number(total);
  }
}
