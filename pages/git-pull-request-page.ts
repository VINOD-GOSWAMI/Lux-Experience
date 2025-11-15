import { Page } from "@playwright/test";
import { PaginationComponent } from "./component/pagination-component";
import { PRListComponent } from "./component/pr-list-component";
import { BasePage } from "./base-page";

export class GitHubPullRequestsPage extends BasePage{
  constructor( page: Page) {
    super(page);
  }

  get pagination() {
    return new PaginationComponent(this.page);
  }

  get prList() {
    return new PRListComponent(this.page);
  }
}
